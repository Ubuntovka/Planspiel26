/**
 * LLM controller: generate WAM diagram JSON from a natural-language prompt.
 * Uses OpenAI Chat Completions with a strict system prompt and optional
 * validation-retry so output respects WAM rules and draws accurately.
 * 
 * Features:
 * - generateDiagramFromPrompt: Quick diagram from simple prompt
 * - buildDiagramFromSystemDescription: Comprehensive diagram from detailed system description
 * - explainDiagram: Natural language explanation of existing diagram
 */

import type { Request, Response } from 'express';
import OpenAI from 'openai';
import { validate } from './validationController';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const NODE_DEFAULT_SIZE: Record<string, { width: number; height: number }> = {
  applicationNode: { width: 150, height: 150 },
  dataProviderNode: { width: 140, height: 150 },
  datasetNode: { width: 140, height: 150 },
  identityProviderNode: { width: 130, height: 130 },
  processUnitNode: { width: 150, height: 150 },
  aiProcessNode: { width: 150, height: 150 },
  securityRealmNode: { width: 600, height: 600 },
  serviceNode: { width: 150, height: 140 },
};

const VALID_NODE_TYPES = new Set(Object.keys(NODE_DEFAULT_SIZE));
const VALID_EDGE_TYPES = new Set(['invocation', 'trust', 'legacy']);

const EXAMPLE_JSON = `{
  "nodes": [
    { "id": "realm1", "type": "securityRealmNode", "position": { "x": 0, "y": 0 }, "data": { "label": "Realm A", "name": "Security Realm A" }, "width": 600, "height": 600 },
    { "id": "app1", "type": "applicationNode", "position": { "x": 30, "y": 50 }, "data": { "label": "Web App", "name": "Customer Web Application" }, "width": 150, "height": 150, "parentId": "realm1" },
    { "id": "svc1", "type": "serviceNode", "position": { "x": 220, "y": 50 }, "data": { "label": "API", "name": "REST API Service" }, "width": 150, "height": 140, "parentId": "realm1" },
    { "id": "ds1", "type": "datasetNode", "position": { "x": 120, "y": 250 }, "data": { "label": "DB", "name": "Customer Database" }, "width": 140, "height": 150, "parentId": "realm1" },
    { "id": "realm2", "type": "securityRealmNode", "position": { "x": 700, "y": 0 }, "data": { "label": "Realm B", "name": "Security Realm B" }, "width": 600, "height": 600 },
    { "id": "svc2", "type": "serviceNode", "position": { "x": 150, "y": 150 }, "data": { "label": "Backend", "name": "Backend Processing Service" }, "width": 150, "height": 140, "parentId": "realm2" }
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
  applicationNode 150x150, serviceNode 150x140, dataProviderNode 140x150, datasetNode 140x150, processUnitNode 150x150, aiProcessNode 150x150, identityProviderNode 130x130, securityRealmNode 600x600.
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

const WAM_EXPLAIN_SYSTEM_PROMPT = `You are a senior systems analyst. Given a WAM diagram (nodes, edges, viewport) you produce a clear, well-structured, human-readable explanation.

Requirements:
- Output should be Markdown, no code blocks unless quoting a tiny snippet. Keep it readable.
- Cover these sections in order with headings:
  1. Overview
  2. Elements
  3. Connections
  4. Validation
  5. Cost breakdown
  6. Notes & recommendations
- Be concise but specific. Use bullet lists and short paragraphs. Include IDs and labels where helpful.
- Respect the provided validation results if present. Do not invent nodes/edges not in the input.
`;

const WAM_SYSTEM_DESCRIPTION_PROMPT = `You are an expert system architect creating WAM (Workflow and Access Model) diagrams from textual system descriptions. 

## YOUR TASK
Analyze the system description provided by the user and create a comprehensive WAM diagram that accurately models the architecture. Use meaningful, descriptive names for all nodes based on the context.

## WAM MODEL ELEMENTS (use these definitions to identify components)

**a. Services (serviceNode)** - Distributed components from different organizations, typically SOAP Web services. Can be:
   - Atomic services: Basic, reusable operations
   - Composite services: Invoke other services to perform work (use invocation edges)

**b. Applications (applicationNode)** - Web applications/portals that users interact with via browser. Can be internet or intranet applications requiring authentication.

**c. Data Providers (dataProviderNode)** - Underlying data sources (databases, legacy systems) that services wrap. Connect to services/applications with legacy edges.

**d. Process Units (processUnitNode)** - Systems performing functionality beyond data management (computations, external process triggers).

**e. Security Realms (securityRealmNode)** - Organizational zones of control over networks/hardware/software. Group services and applications. Represent:
   - Firewall boundaries
   - Identity/access management contexts
   - Common authorization systems
   - Can be nested for sub-groups with dedicated role systems

**f. Identity Providers (identityProviderNode)** - User registration and authentication systems. Issue tokens for STS authorization. NO edges allowed.

**g. Invocation Links (invocation edges)** - Service/application access patterns:
   - Application → Service
   - Service → Service
   - Indicates the target is called by the source

**h. Trust Relationships (trust edges)** - Federation between realms. ONLY between securityRealmNode instances. Means the trusting realm's STS accepts tokens from the trusted realm.

**i. Legacy Connections (legacy edges)** - Connections to data providers or process units from applications/services.

## CRITICAL VALIDATION RULES

1. **Node types**: applicationNode, serviceNode, dataProviderNode, datasetNode, processUnitNode, aiProcessNode, securityRealmNode, identityProviderNode
2. **Trust edges**: ONLY securityRealmNode → securityRealmNode
3. **Invocation edges**: ONLY applicationNode → serviceNode OR serviceNode → serviceNode
4. **Legacy edges**: ONLY applicationNode/serviceNode → dataProviderNode/datasetNode/processUnitNode/aiProcessNode
5. **Identity providers**: ZERO edges (standalone)
6. **Security realms**: MUST contain at least one node. Use "parentId" to place nodes inside realms.
7. **Naming**: Use descriptive, context-appropriate names (e.g., "Customer Portal", "Order Service", "Legacy CRM Database", "Corporate Network Realm")

## JSON STRUCTURE

CRITICAL: Each node MUST have both "label" AND "name" in the data object.
- "label": Short display text (1-3 words, e.g., "Customer Portal")
- "name": More descriptive name with context (2-5 words, e.g., "Public Customer Web Portal")

{
  "nodes": [
    {
      "id": "unique-id",
      "type": "nodeType",
      "position": {"x": number, "y": number},
      "data": {
        "label": "Short Display Name",
        "name": "Descriptive Contextual Name"
      },
      "width": number,
      "height": number,
      "parentId": "realm-id" (optional, for contained nodes)
    }
  ],
  "edges": [
    {
      "id": "unique-id",
      "source": "node-id",
      "target": "node-id",
      "type": "invocation|trust|legacy"
    }
  ],
  "viewport": {"x": 0, "y": 0, "zoom": 1}
}

## EXAMPLES OF GOOD NAMING
- Service: label="Order Service", name="Order Processing Service"
- Application: label="Customer Portal", name="Public Customer Web Portal"
- Data Provider: label="CRM DB", name="Legacy CRM Database"
- Security Realm: label="DMZ", name="DMZ Network Zone"
- Identity Provider: label="Active Directory", name="Corporate Active Directory"
- Process Unit: label="Batch Processor", name="Nightly Batch Processor"

## SIZING
- applicationNode: 150x150
- serviceNode: 150x140
- dataProviderNode: 140x150
- datasetNode: 140x150
- processUnitNode: 150x150
- aiProcessNode: 150x150
- identityProviderNode: 130x130
- securityRealmNode: 600x600 (or larger if nested/contains many nodes)

## LAYOUT GUIDELINES
1. List parent realms FIRST in nodes array
2. Place children after their parents
3. Use relative positions (30-250 x,y) for nodes inside realms
4. Space top-level realms ~650-800 pixels apart
5. Ensure nested realms fit within parent dimensions

Output ONLY the JSON object - no markdown, no explanation.`;

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
            ? { 
                label: n.data.label ?? 'Node',
                name: n.data.name ?? n.data.label ?? 'Node',
                ...n.data
              }
            : { label: n?.label ?? 'Node', name: n?.label ?? 'Node' },
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
    let diagramJson = JSON.stringify({ nodes: diagram.nodes, edges: diagram.edges, viewport: diagram.viewport });
    let validation = await validate(diagramJson);

    if (validation.errors.length > 0) {
      const errorText = validation.errors.join('\n');
      const retryUser = `Your previous diagram had validation errors. Fix them and output ONLY the corrected JSON, no other text.\n\nValidation errors:\n${errorText}\n\nInvalid diagram to fix:\n${diagramJson}`;
      try {
        raw = await callLlm(retryUser);
        diagram = parseAndNormalize(raw);
        diagram.edges = ensureTrustBetweenRealmsWhenRequested(prompt, diagram.nodes, diagram.edges);
        diagramJson = JSON.stringify({
          nodes: diagram.nodes,
          edges: diagram.edges,
          viewport: diagram.viewport,
        });
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

export async function buildDiagramFromSystemDescription(
  req: Request,
  res: Response
): Promise<void> {
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';
  if (!description) {
    res.status(400).json({ error: 'Missing or empty "description" in request body.' });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({
      error: 'Diagram generation is not configured. Set OPENAI_API_KEY on the server.',
    });
    return;
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o';
  const temperature = 0.15; // Slightly higher for more creative naming

  async function callLlm(userMessage: string): Promise<string> {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: WAM_SYSTEM_DESCRIPTION_PROMPT },
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
    const userMessage = `Analyze this system description and create a comprehensive WAM diagram with descriptive, meaningful node names:\n\n${description}`;
    
    let raw = await callLlm(userMessage);
    let diagram = parseAndNormalize(raw);
    let diagramJson = JSON.stringify({ 
      nodes: diagram.nodes, 
      edges: diagram.edges, 
      viewport: diagram.viewport 
    });
    let validation = await validate(diagramJson);

    // If validation fails, try one retry with error feedback
    if (validation.errors.length > 0) {
      const errorText = validation.errors.join('\n');
      const retryUser = `Your previous WAM diagram had validation errors. Analyze the system description again and create a corrected diagram with proper node relationships and descriptive names.\n\nValidation errors:\n${errorText}\n\nOriginal description:\n${description}\n\nFix the diagram and output ONLY the corrected JSON.`;
      
      try {
        raw = await callLlm(retryUser);
        diagram = parseAndNormalize(raw);
        diagramJson = JSON.stringify({
          nodes: diagram.nodes,
          edges: diagram.edges,
          viewport: diagram.viewport,
        });
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
        error: 'AI returned invalid JSON. Try providing a clearer system description.',
      });
      return;
    }
    console.error('LLM build diagram from description error:', err);
    res.status(500).json({
      error: err?.message ?? 'Failed to build diagram from system description.',
    });
  }
}

export async function explainDiagram(
  req: Request,
  res: Response
): Promise<void> {
  const diagram = req.body?.diagram;
  if (!diagram || typeof diagram !== 'object') {
    res.status(400).json({ error: 'Missing or invalid "diagram" in request body.' });
    return;
  }

  const nodes: any[] = Array.isArray(diagram.nodes) ? diagram.nodes : [];
  const edges: any[] = Array.isArray(diagram.edges) ? diagram.edges : [];
  const viewport = diagram.viewport && typeof diagram.viewport === 'object' ? diagram.viewport : { x: 0, y: 0, zoom: 1 };

  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({ error: 'Explanation is not configured. Set OPENAI_API_KEY on the server.' });
    return;
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const temperature = 0.2;

  // Build a compact factual summary for the LLM
  const elementLines = nodes.map((n) => `- ${n.id} (${n.type}) — label: ${n?.data?.label ?? '—'}${n.parentId ? `, parent: ${n.parentId}` : ''}`);
  const connectionLines = edges.map((e) => `- ${e.id}: ${e.source} → ${e.target} [${e.type}]`);

  // Simple transparent cost model (can be adjusted later)
  const cost = {
    nodes: nodes.length,
    edges: edges.length,
    realms: nodes.filter((n) => n.type === 'securityRealmNode').length,
    aiProcesses: nodes.filter((n) => n.type === 'aiProcessNode').length,
    estimatedMonthlyUsd: (() => {
      const base = 5; // base platform cost
      const perService = 2 * nodes.filter((n) => n.type === 'serviceNode').length;
      const perApp = 1.5 * nodes.filter((n) => n.type === 'applicationNode').length;
      const dataStores = 1 * nodes.filter((n) => n.type === 'datasetNode' || n.type === 'dataProviderNode').length;
      const interServiceHops = 0.2 * edges.filter((e) => e.type === 'invocation').length;
      const legacyIntegrations = 0.5 * edges.filter((e) => e.type === 'legacy').length;
      const realmOverhead = 1 * nodes.filter((n) => n.type === 'securityRealmNode').length;
      return Number((base + perService + perApp + dataStores + interServiceHops + legacyIntegrations + realmOverhead).toFixed(2));
    })(),
  };

  const facts = [
    'DIAGRAM FACTS',
    'Elements:',
    ...elementLines,
    'Connections:',
    ...connectionLines,
    'Viewport:',
    `- x: ${viewport.x ?? 0}, y: ${viewport.y ?? 0}, zoom: ${viewport.zoom ?? 1}`,
    'COST INPUTS (transparent):',
    `- nodes: ${cost.nodes}, edges: ${cost.edges}, realms: ${cost.realms}, aiProcesses: ${cost.aiProcesses}, estimatedMonthlyUsd: ${cost.estimatedMonthlyUsd}`,
  ].join('\n');

  // Validate the diagram server-side and pass findings to the LLM
  const diagramJson = JSON.stringify({ nodes, edges, viewport });
  let validation: { valid: boolean; errors: string[] } = { valid: true, errors: [] } as any;
  try {
    const result = await validate(diagramJson);
    validation = { valid: result.errors.length === 0, errors: result.errors };
  } catch (e) {
    // If validator fails, continue with best-effort explanation
  }

  const userMessage = [
    'Explain the following WAM diagram to a non-expert but technical audience.',
    '',
    facts,
    '',
    'VALIDATION RESULTS:',
    validation.valid ? '- valid: true' : `- valid: false\n- errors:\n${validation.errors.map((x) => `  - ${x}`).join('\n')}`,
  ].join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: WAM_EXPLAIN_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature,
      max_tokens: 1200,
    });

    const explanation = completion.choices[0]?.message?.content ?? '';

    res.status(200).json({
      explanation,
      validation,
      cost,
      summary: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        realmCount: cost.realms,
        estimatedMonthlyUsd: cost.estimatedMonthlyUsd,
      },
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
    console.error('LLM explain diagram error:', err);
    res.status(500).json({ error: err?.message ?? 'Failed to explain diagram.' });
  }
}
