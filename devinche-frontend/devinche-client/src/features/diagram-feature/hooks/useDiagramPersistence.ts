// src/features/diagram-feature/hooks/useDiagramPersistence.ts
import { useState, useRef, useEffect, useCallback } from "react";
import type { Viewport } from "@xyflow/react";
import {
  listDiagrams,
  getDiagram,
  createDiagram,
  updateDiagram,
  renameDiagram as apiRenameDiagram,
  type DiagramAccessLevel,
} from "../api";
import type { DiagramNode, DiagramEdge } from "@/types/diagram";
import { initialNodes, initialEdges } from "../data/initialElements";

const STORAGE_KEY = "diagram.flow";
const STORAGE_PTR_KEY = "diagram.flow.ptr";

interface PersistenceProps {
  useBackend: boolean;
  getToken?: () => string | null;
  diagramId?: string | null;
  takeSnapshot: () => any;
  applySnapshot: (snap: any) => void;
  initHistory: (snap: any) => void;
  setNodes: (nodes: DiagramNode[]) => void;
  setEdges: (edges: DiagramEdge[]) => void;
}

export const useDiagramPersistence = ({
  useBackend,
  getToken,
  diagramId,
  takeSnapshot,
  applySnapshot,
  initHistory,
}: PersistenceProps) => {
  const [diagramName, setDiagramName] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<
    DiagramAccessLevel | undefined
  >(undefined);
  const [isDirty, setIsDirty] = useState(false);

  const currentDiagramIdRef = useRef<string | null>(diagramId ?? null);
  const lastChangeAtRef = useRef<number>(Date.now());
  const savingRef = useRef(false);
  const pendingViewportRef = useRef<Viewport | null>(null);

  const clearPendingViewport = useCallback(() => {
    pendingViewportRef.current = null;
  }, []);

  // Helper to mark dirty
  const markDirty = useCallback(() => {
    setIsDirty(true);
    lastChangeAtRef.current = Date.now();
  }, []);

  // Save Logic
  const saveDiagram = useCallback(async (): Promise<boolean> => {
    if (savingRef.current) return false;
    savingRef.current = true;

    const snap = takeSnapshot();
    const { nodes, edges } = snap;
    const viewport = snap.viewport
      ? {
          x: snap.viewport.x ?? 0,
          y: snap.viewport.y ?? 0,
          zoom: snap.viewport.zoom ?? 1,
        }
      : undefined;

    let ok = false;
    try {
      if (useBackend && getToken) {
        const token = getToken();
        if (!token) return false;
        const id = currentDiagramIdRef.current;

        if (id) {
          await updateDiagram(token, id, { nodes, edges, viewport });
        } else {
          const { diagram } = await createDiagram(token, {
            name: diagramName || "Untitled Diagram",
            nodes,
            edges,
            viewport,
          });
          currentDiagramIdRef.current = diagram._id;
          setDiagramName(diagram.name || "Untitled Diagram");
        }
        ok = true;
      } else {
        // LocalStorage fallback
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify([snap]));
          window.localStorage.setItem(STORAGE_PTR_KEY, String(0));
          ok = true;
        }
      }
      return ok;
    } catch (e) {
      console.warn("Failed to save diagram", e);
      return false;
    } finally {
      if (ok) setIsDirty(false);
      savingRef.current = false;
    }
  }, [useBackend, getToken, takeSnapshot, diagramName]);

  const saveDiagramAs = useCallback(
    async (name: string): Promise<string | null> => {
      if (!useBackend || !getToken) return null;
      const token = getToken();
      if (!token) return null;

      const snap = takeSnapshot();
      const trimmed = (name || "").trim() || "Untitled Diagram";

      try {
        const { diagram } = await createDiagram(token, {
          name: trimmed,
          nodes: snap.nodes,
          edges: snap.edges,
          viewport: snap.viewport,
        });
        currentDiagramIdRef.current = diagram._id;
        setDiagramName(trimmed);
        return diagram._id;
      } catch (e) {
        console.warn("Failed to save diagram as", e);
        return null;
      }
    },
    [useBackend, getToken, takeSnapshot],
  );

  const onRenameDiagram = useCallback(
    async (name: string) => {
      if (!useBackend || !getToken) return;
      const id = currentDiagramIdRef.current;
      if (!id) return;
      const token = getToken();
      if (!token) return;
      const trimmed = (name || "").trim() || "Untitled Diagram";
      await apiRenameDiagram(token, id, trimmed);
      setDiagramName(trimmed);
    },
    [useBackend, getToken],
  );

  // Loading Logic
  useEffect(() => {
    if (useBackend && getToken) {
      const token = getToken();
      if (!token) return;
      let cancelled = false;

      const loadById = (id: string) =>
        getDiagram(token, id).then(({ diagram, accessLevel: level }) => {
          if (cancelled) return;
          currentDiagramIdRef.current = id;
          setDiagramName(diagram.name || "Untitled Diagram");
          setAccessLevel(level ?? "owner");

          const vp = diagram.viewport || { x: 0, y: 0, zoom: 1 };
          pendingViewportRef.current = vp;

          const snap = {
            nodes: Array.isArray(diagram.nodes) ? diagram.nodes : [],
            edges: Array.isArray(diagram.edges) ? diagram.edges : [],
            viewport: vp,
          };

          initHistory(snap);
          applySnapshot(snap);
        });

      if (diagramId) {
        currentDiagramIdRef.current = diagramId;
        loadById(diagramId).catch((e) => {
          if (!cancelled) {
            console.warn("Failed to load", e);
            const snap = {
              nodes: [],
              edges: [],
              viewport: { x: 0, y: 0, zoom: 1 },
            };
            initHistory(snap);
            applySnapshot(snap);
          }
        });
      } else {
        // Auto load most recent
        listDiagrams(token)
          .then(({ diagrams: list }) => {
            if (cancelled) return;
            const mostRecent = list?.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )[0];
            if (mostRecent) {
              setAccessLevel((mostRecent as any).accessLevel ?? "owner");
              return loadById(mostRecent._id);
            }
            // New
            const snap = {
              nodes: initialNodes,
              edges: initialEdges,
              viewport: { x: 0, y: 0, zoom: 1 },
            };
            initHistory(snap);
            applySnapshot(snap);
          })
          .catch(() => {
            const snap = {
              nodes: initialNodes,
              edges: initialEdges,
              viewport: { x: 0, y: 0, zoom: 1 },
            };
            initHistory(snap);
            applySnapshot(snap);
          });
      }
      return () => {
        cancelled = true;
      };
    } else {
      // LocalStorage Load
      const loadSaved = () => {
        if (typeof window === "undefined") return null;
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (!raw) return null;
          return JSON.parse(raw);
        } catch {
          return null;
        }
      };

      const saved = loadSaved();
      if (saved) {
        const snap = Array.isArray(saved) ? saved[saved.length - 1] : saved;
        initHistory(snap);
        applySnapshot(snap);
      } else {
        const snap = {
          nodes: initialNodes,
          edges: initialEdges,
          viewport: { x: 0, y: 0, zoom: 1 },
        };
        initHistory(snap);
      }
    }
  }, [useBackend, diagramId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave Effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handlePageHide = () => {
      if (isDirty && useBackend && getToken) {
        const token = getToken();
        const id = currentDiagramIdRef.current;
        if (token && id) {
          const snap = takeSnapshot(); 
          try {
            const body = JSON.stringify({
              nodes: snap.nodes,
              edges: snap.edges,
              viewport: snap.viewport,
            });
            const headers = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            };

            fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/diagrams/${id}`,
              {
                method: "PUT",
                headers,
                body,
                keepalive: true,
              },
            ).catch(() => {});
          } catch (e) {
            // ignore
          }
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [isDirty, useBackend, getToken, takeSnapshot]);

  return {
    diagramName,
    setDiagramName,
    onRenameDiagram,
    saveDiagram,
    saveDiagramAs,
    isDirty,
    markDirty,
    accessLevel,
    pendingViewportRef, // needed to set initial viewport in State hook
    clearPendingViewport,
  };
};
