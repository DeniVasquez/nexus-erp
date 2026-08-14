import { createEffect, onCleanup } from "solid-js";

const APP_NAME = "Nexus ERP";

export function useDocumentTitle(title) {
  const previous = document.title;

  createEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  });

  onCleanup(() => {
    document.title = previous;
  });
}
