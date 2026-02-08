import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateDiagramFromPrompt, explainDiagram } from '../controllers/llmController';

const router = Router();

/**
 * POST /api/llm/generate-diagram
 * Body: { prompt: string }
 * Returns: { diagram: { nodes, edges, viewport } }
 */
router.post('/generate-diagram', asyncHandler(generateDiagramFromPrompt));

/**
 * POST /api/llm/explain-diagram
 * Body: { diagram: { nodes, edges, viewport } }
 * Returns: { explanation: string, validation: { valid, errors[] }, cost: {...} }
 */
router.post('/explain-diagram', asyncHandler(explainDiagram));

export default router;
