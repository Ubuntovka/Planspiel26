import { useDiagram } from "../hooks";
import { toPng } from "html-to-image";

const { exportToJson } = useDiagram();

/**
 * Exports diagram to JSON, saving to user's machine
 * @returns null
 */
export const exportDiagramToJson = () => {
  try {
    const json = exportToJson();
    if (!json) return;

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.json";
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Problem exporting diagram JSON: ", e);
  }
};

/**
 * Export the diagram to PNG while hiding editor-only UI:
 * - connection handles/dots
 * - resizer controls and edge updaters
 * - any selection/highlight outlines
 * - context menu/controls overlays
 * - neutralize accent/selection colors and focus rings so everything looks "normal"
 * - visually extend edge endpoints so they meet node borders (when handles are hidden)
 */
export async function exportDiagramToPng(
  element: HTMLDivElement,
  filename = "diagram.png",
) {
  // Add a temporary scoped class and stylesheet to hide editor UI during export
  const exportingClass = "__exporting";
  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-export-style", "true");
  styleEl.textContent = `
    /* Hide editor-only UI */
    .${exportingClass} .react-flow__handle,
    .${exportingClass} .react-flow__edgeupdater,
    .${exportingClass} .react-flow__selection,
    .${exportingClass} .react-flow__nodesselection,
    .${exportingClass} .react-flow__node-resizer,
    .${exportingClass} .react-flow__resize-control,
    .${exportingClass} .react-flow__resize-line,
    .${exportingClass} .react-flow__controls,
    .${exportingClass} .react-flow__connection-line,
    .${exportingClass} .context-menu {
      display: none !important;
    }

    /* Remove any visual selection chrome */
    .${exportingClass} .react-flow__node.selected {
      outline: none !important;
      box-shadow: none !important;
    }
    .${exportingClass} .react-flow__edge.selected .react-flow__edge-path {
      stroke-width: 1.5px !important; /* fallback to a normal width */
      filter: none !important;
    }

    /* Neutralize focus rings */
    .${exportingClass} *:focus {
      outline: none !important;
      box-shadow: none !important;
    }

    /* During export, map accent color to normal text color to avoid blue highlights */
    .${exportingClass} {
      --editor-accent: var(--editor-text) !important;
    }
  `;

  // Track and temporarily remove any 'selected' classes so nodes/edges appear normal
  const selectedEls: Element[] = Array.from(
    element.querySelectorAll(".selected"),
  );

  // Track and temporarily remove attributes that can drive selection styling
  const attrCandidates = [
    "aria-selected",
    "data-selected",
    "data-focus",
    "data-focused",
  ];
  const attrState: Array<{
    el: Element;
    attrs: Array<{ name: string; value: string }>;
  }> = [];
  const attrTargets = Array.from(
    element.querySelectorAll(
      '[aria-selected="true"], [data-selected="true"], [data-focus="true"], [data-focused="true"]',
    ),
  );
  attrTargets.forEach((el) => {
    const attrs: Array<{ name: string; value: string }> = [];
    attrCandidates.forEach((name) => {
      if (el.hasAttribute(name)) {
        const value = el.getAttribute(name) ?? "";
        attrs.push({ name, value });
        el.removeAttribute(name);
      }
    });
    if (attrs.length) {
      attrState.push({ el, attrs });
    }
  });

  // Blur any focused element so :focus styles don't leak into the export
  const prevActive = document.activeElement as HTMLElement | null;
  if (prevActive && typeof prevActive.blur === "function") {
    try {
      prevActive.blur();
    } catch {
      /* noop */
    }
  }

  try {
    document.head.appendChild(styleEl);
    element.classList.add(exportingClass);

    // Temporarily strip 'selected' class from nodes/edges/labels, to avoid highlighted look
    selectedEls.forEach((el) => el.classList.remove("selected"));

    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor: "#ffffff",
      skipFonts: true,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } finally {
    // Restore previous DOM state and cleanup
    selectedEls.forEach((el) => el.classList.add("selected"));
    attrState.forEach(({ el, attrs }) => {
      attrs.forEach(({ name, value }) => {
        try {
          if (value === "") {
            el.setAttribute(name, "");
          } else {
            el.setAttribute(name, value);
          }
        } catch {
          /* noop */
        }
      });
    });
    if (prevActive && document.contains(prevActive)) {
      try {
        prevActive.focus();
      } catch {
        /* noop */
      }
    }
    element.classList.remove(exportingClass);
    if (styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }
  }
}

/**
 * Exports diagram to RDF, saving to user's machine
 * @returns null
 */
export const exportDiagramToRdf = async () => {
  try {
    const json = exportToJson();
    if (!json) {
      console.error("No diagram to export");
      return;
    }

    const diagram = JSON.parse(json);
    console.log(diagram);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/rdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: diagram }),
      },
    );

    if (!response.ok) {
      throw new Error(`RDF export failed: ${response.status}`);
    }

    // Backend returns plain Turtle string directly
    const ttlJson = await response.text();
    const ttl = JSON.parse(ttlJson).diagram;

    const blob = new Blob([ttl], { type: "text/turtle;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.ttl";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Problem exporting diagram RDF:", e);
  }
};

/**
 * Exports diagram to XML, saving to user's machine
 * @returns null
 */
export const exportDiagramToXml = async () => {
  try {
    const json = exportToJson();
    if (!json) {
      console.error("No diagram to export");
      return;
    }

    const diagram = JSON.parse(json);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/xml`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: diagram }),
      },
    );

    if (!response.ok) {
      throw new Error(`XML export failed: ${response.status}`);
    }

    const xmlJson = await response.text();
    const xml = JSON.parse(xmlJson).diagram;

    const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Problem exporting diagram XML:", e);
  }
};
