/**
 * LLM controller: generate WAM diagram JSON from a natural-language prompt.
 * Uses OpenAI Chat Completions with a strict system prompt and optional
 * validation-retry so output respects WAM rules and draws accurately.
 */

import type { Request, Response } from 'express';
import OpenAI from 'openai';
import { validate } from './validationController';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const NODE_DEFAULT_SIZE: Record<string, { width: number; height: number }> = {
  applicationNode: { width: 87, height: 88 },
  dataProviderNode: { width: 77, height: 88 },
  datasetNode: { width: 77, height: 88 },
  identityProviderNode: { width: 76, height: 77 },
  processUnitNode: { width: 87, height: 87 },
  aiProcessNode: { width: 87, height: 87 },
  securityRealmNode: { width: 280, height: 220 },
  serviceNode: { width: 87, height: 77 },
};

const VALID_NODE_TYPES = new Set(Object.keys(NODE_DEFAULT_SIZE));
const VALID_EDGE_TYPES = new Set(['invocation', 'trust', 'legacy']);

const EXAMPLE_JSON = `{
  "nodes": [
    { "id": "realm1", "type": "securityRealmNode", "position": { "x": 0, "y": 0 }, "data": { "label": "Realm A" }, "width": 280, "height": 220 },
    { "id": "app1", "type": "applicationNode", "position": { "x": 20, "y": 30 }, "data": { "label": "Web App" }, "width": 87, "height": 88, "parentId": "realm1" },
    { "id": "svc1", "type": "serviceNode", "position": { "x": 130, "y": 30 }, "data": { "label": "API" }, "width": 87, "height": 77, "parentId": "realm1" },
    { "id": "ds1", "type": "datasetNode", "position": { "x": 70, "y": 120 }, "data": { "label": "DB" }, "width": 77, "height": 88, "parentId": "realm1" },
    { "id": "realm2", "type": "securityRealmNode", "position": { "x": 350, "y": 0 }, "data": { "label": "Realm B" }, "width": 280, "height": 220 },
    { "id": "svc2", "type": "serviceNode", "position": { "x": 90, "y": 70 }, "data": { "label": "Backend" }, "width": 87, "height": 77, "parentId": "realm2" }
  ],
  "edges": [
    { "id": "trust1", "source": "realm1", "target": "realm2", "type": "trust" },
    { "id": "inv1", "source": "app1", "target": "svc1", "type": "invocation" },
    { "id": "leg1", "source": "svc1", "target": "ds1", "type": "legacy" }
  ],
  "viewport": { "x": 0, "y": 0, "zoom": 1 }
}`;

const WAM_SYSTEM_PROMPT = `You are an expert at creating WAM (Workflow and Access Model) diagrams. You output ONLY valid JSON that passes WAM validation rules. No markdown, no explanation—just the JSON object.

## CRITICAL RULES (diagram will be validated; violations cause errors)

1. **Node types** – use EXACTLY these strings:
   applicationNode, serviceNode, dataProviderNode, datasetNode, processUnitNode, aiProcessNode, securityRealmNode, identityProviderNode

2. **Trust edges** – ONLY from securityRealmNode to securityRealmNode. No other node type can have a trust edge.

3. **Invocation edges** – ONLY:
   - applicationNode → serviceNode
   - serviceNode → serviceNode

4. **Legacy edges** – ONLY from applicationNode or serviceNode TO: dataProviderNode, datasetNode, processUnitNode, or aiProcessNode.

5. **Identity providers** – identityProviderNode must have ZERO edges (no source, no target).

6. **Security realms** – Every securityRealmNode MUST contain at least one other node. Put contained nodes INSIDE the realm by:
   - Setting "parentId" on the child node to the realm's "id".
   - Giving the child a "position" relative to the realm (e.g. small x,y like 20,30).
   - Realm nodes must have "width" and "height" (e.g. 280 and 220).

7. **Layout** – List security realm nodes FIRST, then their children (nodes with parentId). Use clear spacing: realms ~300 apart, nodes inside realm with positions like 20–150 for x,y.

## Exact JSON shape

- "nodes": array of node objects. Each node: "id" (string), "type" (one of the types above), "position" ({"x": number, "y": number}), "data" ({"label": "Display text"}), and for correct display add "width" and "height" from this table:
  applicationNode 87x88, serviceNode 87x77, dataProviderNode 77x88, datasetNode 77x88, processUnitNode 87x87, aiProcessNode 87x87, identityProviderNode 76x77, securityRealmNode 280x220.
  Children of a realm must have "parentId" set to that realm's id.
- "edges": array of edge objects. Each edge: "id" (string), "source" (node id), "target" (node id), "type" ("invocation" | "trust" | "legacy").
- "viewport": { "x": 0, "y": 0, "zoom": 1 }

## CRITICAL: Trust between two realms

When the user says two (or more) realms "trust each other", "connect the realms", "trust edge between realms", or similar, you MUST include in the "edges" array an edge with:
- "type": "trust"
- "source": the id of the first securityRealmNode
- "target": the id of the second securityRealmNode
Never omit the trust edge when the user asks for realms to be connected or to trust each other.

## Example of a valid diagram (two realms that trust each other; one has app invoking service, service has legacy to dataset)

${EXAMPLE_JSON}

Output ONLY the JSON object for the user's requested diagram.`;

function parseAndNormalize(raw: string): {
  nodes: any[];
  edges: any[];
  viewport: { x: number; y: number; zoom: number };
} {
  let jsonStr = raw.trim();
  const codeMatch = jsonStr.match(/^```(?:json)?\s*([\s\S]*?)```$/);
  if (codeMatch) jsonStr = codeMatch[1].trim();

  const parsed = JSON.parse(jsonStr) as {
    nodes?: any[];
    edges?: any[];
    viewport?: { x?: number; y?: number; zoom?: number };
  };
  const rawNodes = Array.isArray(parsed.nodes) ? parsed.nodes : [];
  const rawEdges = Array.isArray(parsed.edges) ? parsed.edges : [];

  const sizeFor = (type: string) =>
    NODE_DEFAULT_SIZE[type] ?? { width: 87, height: 88 };
  const typeMap: Record<string, string> = {
    securityRealm: 'securityRealmNode',
    application: 'applicationNode',
    service: 'serviceNode',
    dataset: 'datasetNode',
    dataProvider: 'dataProviderNode',
    processUnit: 'processUnitNode',
    aiProcess: 'aiProcessNode',
    identityProvider: 'identityProviderNode',
  };
  const validType = (t: string) => {
    if (VALID_NODE_TYPES.has(t)) return t;
    const mapped = typeMap[t];
    return mapped && VALID_NODE_TYPES.has(mapped) ? mapped : 'processUnitNode';
  };

  const nodes = rawNodes
    .map((n, i) => {
      const type = validType(String(n?.type || 'processUnitNode'));
      const size = sizeFor(type);
      return {
        id: n?.id ?? `n${i + 1}`,
        type,
        position:
          n?.position &&
          typeof n.position.x === 'number' &&
          typeof n.position.y === 'number'
            ? { x: n.position.x, y: n.position.y }
            : { x: 100 + i * 180, y: 100 },
        data:
          n?.data && typeof n.data === 'object'
            ? { ...n.data, label: n.data.label ?? 'Node' }
            : { label: n?.label ?? 'Node' },
        width: n?.width != null ? Number(n.width) : size.width,
        height: n?.height != null ? Number(n.height) : size.height,
        ...(n?.parentId != null && { parentId: String(n.parentId), extent: 'parent' }),
      };
    })
    .filter((n) => n.id);

  // React Flow: parents must appear before children
  const sortedNodes: any[] = [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const added = new Set<string>();
  const add = (n: any) => {
    if (added.has(n.id)) return;
    if (n.parentId && byId.has(n.parentId)) {
      add(byId.get(n.parentId)!);
    }
    sortedNodes.push(n);
    added.add(n.id);
  };
  nodes.forEach(add);

  const edges = rawEdges
    .map((e, i) => ({
      id: e?.id ?? `e${i + 1}`,
      source: e?.source ?? '',
      target: e?.target ?? '',
      type: VALID_EDGE_TYPES.has(e?.type) ? e.type : 'invocation',
    }))
    .filter((e) => e.source && e.target);

  const vp = parsed.viewport;
  const viewport = {
    x: typeof vp?.x === 'number' ? vp.x : 0,
    y: typeof vp?.y === 'number' ? vp.y : 0,
    zoom: typeof vp?.zoom === 'number' ? vp.zoom : 1,
  };

  return { nodes: sortedNodes, edges, viewport };
}

/** If the user asked for trust between realms but the diagram has no trust edge, add one between the first two realm nodes. */
function ensureTrustBetweenRealmsWhenRequested(
  prompt: string,
  nodes: any[],
  edges: any[]
): any[] {
  const lower = prompt.toLowerCase();
  const wantsTrust =
    /\btrust\b/.test(lower) &&
    (/\b(two|2|both)(\s+\w+)*\s*realms?|realm.*realm|connect.*realm|realms?\s*(trust|connect)|trust\s*(each other|between)|connect the two realms/.test(lower));
  if (!wantsTrust) return edges;

  const realmIds = nodes.filter((n) => n.type === 'securityRealmNode').map((n) => n.id);
  const hasTrustEdge = edges.some((e) => e.type === 'trust');
  if (realmIds.length >= 2 && !hasTrustEdge) {
    const trustEdge = {
      id: `trust-${realmIds[0]}-${realmIds[1]}`,
      source: realmIds[0],
      target: realmIds[1],
      type: 'trust',
    };
    return [...edges, trustEdge];
  }
  return edges;
}

export async function generateDiagramFromPrompt(
  req: Request,
  res: Response
): Promise<void> {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) {
    res.status(400).json({ error: 'Missing or empty "prompt" in request body.' });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({
      error: 'Diagram generation is not configured. Set OPENAI_API_KEY on the server.',
    });
    return;
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o';
  const temperature = 0.1;

  async function callLlm(userMessage: string): Promise<string> {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: WAM_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature,
      max_tokens: 4096,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw || typeof raw !== 'string') {
      throw new Error('No content in LLM response.');
    }
    return raw;
  }

  try {
    let raw = await callLlm(prompt);
    let diagram = parseAndNormalize(raw);
    diagram.edges = ensureTrustBetweenRealmsWhenRequested(prompt, diagram.nodes, diagram.edges);
    let diagramJson = { nodes: diagram.nodes, edges: diagram.edges, };
    let validation = await validate(diagramJson);

    if (validation.errors.length > 0) {
      const errorText = validation.errors.join('\n');
      const retryUser = `Your previous diagram had validation errors. Fix them and output ONLY the corrected JSON, no other text.\n\nValidation errors:\n${errorText}\n\nInvalid diagram to fix:\n${diagramJson}`;
      try {
        raw = await callLlm(retryUser);
        diagram = parseAndNormalize(raw);
        diagram.edges = ensureTrustBetweenRealmsWhenRequested(prompt, diagram.nodes, diagram.edges);
        diagramJson = {
          nodes: diagram.nodes,
          edges: diagram.edges,
        };
        validation = await validate(diagramJson);
      } catch (_) {
        // If retry fails, send first result anyway; client can still show it
      }
    }

    res.status(200).json({
      diagram: {
        nodes: diagram.nodes,
        edges: diagram.edges,
        viewport: diagram.viewport,
      },
      validationErrors:
        validation.errors.length > 0 ? validation.errors : undefined,
    });
  } catch (err: any) {
    if (err?.status === 401) {
      res.status(401).json({ error: 'Invalid or missing OpenAI API key.' });
      return;
    }
    if (err?.code === 'ENOTFOUND' || err?.message?.includes('fetch')) {
      res.status(502).json({ error: 'Could not reach the AI service.' });
      return;
    }
    if (err instanceof SyntaxError) {
      res.status(502).json({
        error: 'AI returned invalid JSON. Try rephrasing your request.',
      });
      return;
    }
    console.error('LLM generate diagram error:', err);
    res.status(500).json({
      error: err?.message ?? 'Failed to generate diagram from prompt.',
    });
  }
}
