import { createSignal, createEffect, createResource, Show, For } from "solid-js";
import { subCategoriesApi } from "../../services/subCategories.api";
import { categoriesApi } from "../../services/categories.api";
import { showToast } from "../../utils/toast";

// category llega poblada desde el backend (subdocumento Mongoose) o como id
// crudo; aquí normalizamos a un id de string.
const extractId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

function SubCategoryFormModal(props) {
  const isEditing = () => !!props.subCategory;

  const [category, setCategory] = createSignal("");
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  // Solo categorías activas: una categoría inactiva no debería recibir nuevas sub-categorías.
  const [categories] = createResource(() =>
    categoriesApi.getAll({ isActive: true, limit: 1000 }),
  );

  // Precargar el formulario al abrir en modo edición (o limpiarlo en modo creación)
  createEffect(() => {
    const subCategory = props.subCategory;
    setCategory(extractId(subCategory?.category));
    setName(subCategory?.name || "");
    setDescription(subCategory?.description || "");
    setError("");
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      category: category(),
      name: name(),
      description: description(),
    };

    try {
      if (isEditing()) {
        // category no es editable una vez creada la sub-categoría; el backend la ignora si se envía
        await subCategoriesApi.update(props.subCategory._id, payload);
        showToast.success("Sub-categoría actualizada correctamente");
      } else {
        await subCategoriesApi.create(payload);
        showToast.success("Sub-categoría creada exitosamente");
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
            {isEditing() ? "Editar sub-categoría" : "Nueva sub-categoría"}
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
                class="input-field w-full disabled:opacity-60"
                required
                disabled={isEditing()}
                value={category()}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Selecciona...</option>
                <For each={categories()?.data}>
                  {(c) => <option value={c._id}>{c.name}</option>}
                </For>
              </select>
            </Show>
            <Show when={isEditing()}>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                La categoría de una sub-categoría no puede modificarse.
              </p>
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

export default SubCategoryFormModal;
