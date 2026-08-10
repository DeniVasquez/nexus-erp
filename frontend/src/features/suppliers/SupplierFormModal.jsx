import { createSignal, createEffect, createResource, Show, For } from "solid-js";
import { suppliersApi } from "../../services/suppliers.api";
import { countriesApi } from "../../services/countries.api";
import { showToast } from "../../utils/toast";

// country llega poblado desde el backend (subdocumento Mongoose) o como id
// crudo; aquí normalizamos a un id de string.
const extractId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

function SupplierFormModal(props) {
  const isEditing = () => !!props.supplier;

  const [country, setCountry] = createSignal("");
  const [name, setName] = createSignal("");
  const [address, setAddress] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [email, setEmail] = createSignal("");

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  // Solo países activos: un país inactivo no debería recibir nuevos proveedores.
  const [countries] = createResource(() =>
    countriesApi.getAll({ isActive: true, limit: 1000 }),
  );

  // Precargar el formulario al abrir en modo edición (o limpiarlo en modo creación)
  createEffect(() => {
    const supplier = props.supplier;
    setCountry(extractId(supplier?.country));
    setName(supplier?.name || "");
    setAddress(supplier?.address || "");
    setPhone(supplier?.phone || "");
    setEmail(supplier?.email || "");
    setError("");
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      country: country(),
      name: name(),
      address: address(),
      phone: phone(),
      email: email(),
    };

    try {
      if (isEditing()) {
        await suppliersApi.update(props.supplier._id, payload);
        showToast.success("Proveedor actualizado correctamente");
      } else {
        await suppliersApi.create(payload);
        showToast.success("Proveedor creado exitosamente");
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
            {isEditing() ? "Editar proveedor" : "Nuevo proveedor"}
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
              País *
            </label>
            <Show
              when={!countries.loading}
              fallback={
                <div class="input-field bg-gray-100 dark:bg-gray-800">
                  Cargando...
                </div>
              }
            >
              <select
                class="input-field w-full"
                required
                value={country()}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <For each={countries()?.data}>
                  {(c) => <option value={c._id}>{c.name}</option>}
                </For>
              </select>
            </Show>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                class="input-field w-full"
                value={phone()}
                onInput={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                class="input-field w-full"
                value={email()}
                onInput={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dirección
            </label>
            <textarea
              rows="2"
              class="input-field w-full"
              value={address()}
              onInput={(e) => setAddress(e.target.value)}
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

export default SupplierFormModal;
