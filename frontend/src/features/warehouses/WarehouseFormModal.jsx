import { createSignal, createResource, createEffect, Show, For } from "solid-js";
import { warehousesApi } from "../../services/warehouses.api";
import { branchesApi } from "../../services/branches.api";
import { warehouseCategoriesApi } from "../../services/warehouseCategories.api";
import { showToast } from "../../utils/toast";

// branch/warehouseCategory llegan poblados desde el backend (subdocumento
// Mongoose) o como id crudo; aquí normalizamos a un id de string.
const extractId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

function WarehouseFormModal(props) {
  const isEditing = () => !!props.warehouse;

  const [branch, setBranch] = createSignal("");
  const [warehouseCategory, setWarehouseCategory] = createSignal("");
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  // Solo sucursales/categorías activas: una sucursal inactiva no puede
  // generar nuevas transacciones (RN-BRA-004), igual criterio para categorías.
  const [branches] = createResource(() =>
    branchesApi.getAll({ isActive: true, limit: 1000 }),
  );
  const [categories] = createResource(() =>
    warehouseCategoriesApi.getAll({ isActive: true, limit: 1000 }),
  );

  // Precargar el formulario al abrir en modo edición (o limpiarlo en modo creación)
  createEffect(() => {
    const warehouse = props.warehouse;
    setBranch(extractId(warehouse?.branch));
    setWarehouseCategory(extractId(warehouse?.warehouseCategory));
    setName(warehouse?.name || "");
    setDescription(warehouse?.description || "");
    setError("");
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      branch: branch(),
      warehouseCategory: warehouseCategory(),
      name: name(),
      description: description(),
    };

    try {
      if (isEditing()) {
        // branch no es editable una vez creado el almacén; el backend la ignora si se envía
        await warehousesApi.update(props.warehouse._id, payload);
        showToast.success("Almacén actualizado correctamente");
      } else {
        await warehousesApi.create(payload);
        showToast.success("Almacén creado exitosamente");
      }
      props.onSaved();
    } catch (err) {
      setError(err.message);
      showToast.error(err.message);
    }

    setLoading(false);
  };

  return (
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing() ? "Editar almacén" : "Nuevo almacén"}
          </h2>
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
              Sucursal *
            </label>
            <Show
              when={!branches.loading}
              fallback={
                <div class="input-field bg-gray-100 dark:bg-gray-800">
                  Cargando...
                </div>
              }
            >
              <select
                class="input-field w-full disabled:opacity-60"
                required
                disabled={isEditing()}
                value={branch()}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <For each={branches()?.data}>
                  {(b) => (
                    <option value={b._id}>
                      {b.company?.commercialName
                        ? `${b.company.commercialName} - ${b.name}`
                        : b.name}
                    </option>
                  )}
                </For>
              </select>
            </Show>
            <Show when={isEditing()}>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                La sucursal de un almacén no puede modificarse.
              </p>
            </Show>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría *
            </label>
            <Show
              when={!categories.loading}
              fallback={
                <div class="input-field bg-gray-100 dark:bg-gray-800">
                  Cargando...
                </div>
              }
            >
              <select
                class="input-field w-full"
                required
                value={warehouseCategory()}
                onChange={(e) => setWarehouseCategory(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <For each={categories()?.data}>
                  {(c) => <option value={c._id}>{c.name}</option>}
                </For>
              </select>
            </Show>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              required
              class="input-field w-full"
              value={name()}
              onInput={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              rows="3"
              class="input-field w-full"
              value={description()}
              onInput={(e) => setDescription(e.target.value)}
            />
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
              disabled={loading()}
              class="btn-primary flex-1 disabled:opacity-50"
            >
              {loading() ? "Guardando..." : isEditing() ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WarehouseFormModal;
