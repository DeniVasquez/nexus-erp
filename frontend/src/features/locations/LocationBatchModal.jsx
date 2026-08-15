import { createSignal, createResource, createMemo, Show, For } from "solid-js";
import { locationsApi } from "../../services/locations.api";
import { warehousesApi } from "../../services/warehouses.api";
import { showToast } from "../../utils/toast";

// Debe coincidir con MAX_BATCH_LOCATIONS del backend
// (backend/src/modules/locations/application/use-cases/createLocationsBatch.js).
const MAX_BATCH_LOCATIONS = 500;
const PREVIEW_LIMIT = 20;

const COORDINATE_GROUPS = [
  { key: "aisle", label: "Pasillo" },
  { key: "rack", label: "Estante" },
  { key: "level", label: "Nivel" },
  { key: "position", label: "Posición" },
];

// Misma regla que el backend: si no hay desde/hasta, la coordenada queda fija
// en el prefijo; si hay desde/hasta, varía como `${prefijo}${n}`.
const resolveValues = (prefix, from, to) => {
  const hasFrom = from !== "" && from !== undefined && from !== null;
  const hasTo = to !== "" && to !== undefined && to !== null;

  if (!hasFrom && !hasTo) return [prefix || ""];

  const fromNum = Number(from);
  const toNum = Number(to);
  if (!hasFrom || !hasTo || !Number.isInteger(fromNum) || !Number.isInteger(toNum) || fromNum > toNum) {
    return null;
  }

  const values = [];
  for (let n = fromNum; n <= toNum; n += 1) values.push(`${prefix || ""}${n}`);
  return values;
};

const buildCode = ({ aisle, rack, level, position }) =>
  [aisle, rack, level, position].filter(Boolean).join("-");

function LocationBatchModal(props) {
  const [warehouse, setWarehouse] = createSignal("");

  const [fields, setFields] = createSignal({
    aisle: { prefix: "", from: "", to: "" },
    rack: { prefix: "", from: "", to: "" },
    level: { prefix: "", from: "", to: "" },
    position: { prefix: "", from: "", to: "" },
  });

  const updateField = (key, part, value) =>
    setFields((prev) => ({ ...prev, [key]: { ...prev[key], [part]: value } }));

  const [capacity, setCapacity] = createSignal("");
  const [notes, setNotes] = createSignal("");

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const [warehouses] = createResource(() =>
    warehousesApi.getAll({ isActive: true, limit: 1000 }),
  );

  // Combinaciones calculadas en vivo, mismo criterio que el backend.
  const preview = createMemo(() => {
    const valuesByField = {};
    for (const { key } of COORDINATE_GROUPS) {
      const f = fields()[key];
      const values = resolveValues(f.prefix, f.from, f.to);
      if (values === null) return { invalidField: key, combinations: [] };
      valuesByField[key] = values;
    }

    const combinations = [];
    for (const aisle of valuesByField.aisle) {
      for (const rack of valuesByField.rack) {
        for (const level of valuesByField.level) {
          for (const position of valuesByField.position) {
            const coords = { aisle, rack, level, position };
            combinations.push(buildCode(coords));
          }
        }
      }
    }
    return { invalidField: null, combinations };
  });

  const total = () => preview().combinations.length;
  const overLimit = () => total() > MAX_BATCH_LOCATIONS;

  const canSubmit = () =>
    !loading() && !!warehouse() && !!capacity() && !preview().invalidField && !overLimit();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setLoading(true);
    setError("");

    const f = fields();
    const payload = {
      warehouse: warehouse(),
      capacity: Number(capacity()),
      notes: notes(),
      aislePrefix: f.aisle.prefix, aisleFrom: f.aisle.from, aisleTo: f.aisle.to,
      rackPrefix: f.rack.prefix, rackFrom: f.rack.from, rackTo: f.rack.to,
      levelPrefix: f.level.prefix, levelFrom: f.level.from, levelTo: f.level.to,
      positionPrefix: f.position.prefix, positionFrom: f.position.from, positionTo: f.position.to,
    };

    try {
      const result = await locationsApi.createBatch(payload);
      showToast.success(
        `Se crearon ${result.createdCount} ubicaciones` +
          (result.skippedCount ? ` (${result.skippedCount} omitidas por ya existir)` : ""),
      );
      props.onSaved();
    } catch (err) {
      setError(err.message);
      showToast.error(err.message);
    }

    setLoading(false);
  };

  return (
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Generar ubicaciones por lote
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Definí un prefijo y un rango numérico por coordenada; el código
              se arma solo a partir de las combinaciones.
            </p>
          </div>
          <button
            onClick={props.onClose}
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} class="p-6 space-y-4 overflow-y-auto">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Almacén *
            </label>
            <Show
              when={!warehouses.loading}
              fallback={
                <div class="input-field bg-gray-100 dark:bg-gray-800">
                  Cargando...
                </div>
              }
            >
              <select
                class="input-field w-full"
                required
                value={warehouse()}
                onChange={(e) => setWarehouse(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <For each={warehouses()?.data}>
                  {(w) => (
                    <option value={w._id}>
                      {w.branch?.name ? `${w.branch.name} - ${w.name}` : w.name}
                    </option>
                  )}
                </For>
              </select>
            </Show>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <For each={COORDINATE_GROUPS}>
              {({ key, label }) => (
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder="Prefijo"
                    class="input-field w-full"
                    value={fields()[key].prefix}
                    onInput={(e) => updateField(key, "prefix", e.target.value)}
                  />
                  <div class="flex gap-1">
                    <input
                      type="number"
                      placeholder="Desde"
                      class="input-field w-full"
                      value={fields()[key].from}
                      onInput={(e) => updateField(key, "from", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Hasta"
                      class="input-field w-full"
                      value={fields()[key].to}
                      onInput={(e) => updateField(key, "to", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </For>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Capacidad *
            </label>
            <input
              type="number"
              min="1"
              step="1"
              required
              class="input-field w-full"
              value={capacity()}
              onInput={(e) => setCapacity(e.target.value)}
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observaciones
            </label>
            <textarea
              rows="2"
              class="input-field w-full"
              value={notes()}
              onInput={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Vista previa */}
          <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md p-4 text-sm">
            <Show
              when={!preview().invalidField}
              fallback={
                <p class="text-red-600 dark:text-red-400">
                  El rango de "
                  {COORDINATE_GROUPS.find((g) => g.key === preview().invalidField)?.label}"
                  no es válido (Desde debe ser menor o igual que Hasta).
                </p>
              }
            >
              <p class={overLimit() ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-700 dark:text-gray-300 font-medium"}>
                Se generarán {total()} ubicaciones
                {overLimit() && ` (máximo permitido: ${MAX_BATCH_LOCATIONS}, reducí los rangos)`}
              </p>
              <Show when={total() > 0 && !overLimit()}>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 break-words">
                  {preview().combinations.slice(0, PREVIEW_LIMIT).join(", ")}
                  {total() > PREVIEW_LIMIT && ` … y ${total() - PREVIEW_LIMIT} más`}
                </p>
              </Show>
            </Show>
          </div>

          <Show when={error()}>
            <div class="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
              {error()}
            </div>
          </Show>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              onClick={props.onClose}
              class="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit()}
              class="btn-primary flex-1 disabled:opacity-50"
            >
              {loading() ? "Generando..." : `Generar ${total() || ""} ubicaciones`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LocationBatchModal;
