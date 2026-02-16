import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateDiagramFromPrompt, explainDiagram, buildDiagramFromSystemDescription } from '../controllers/llmController';

const router = Router();

/**
 * POST /api/llm/generate-diagram
 * Body: { prompt: string }
 * Returns: { diagram: { nodes, edges, viewport } }
 */
router.post('/generate-diagram', asyncHandler(generateDiagramFromPrompt));

/**
 * POST /api/llm/build-from-description
 * Body: { description: string }
 * Returns: { diagram: { nodes, edges, viewport }, validationErrors?: string[] }
 */
router.post('/build-from-description', asyncHandler(buildDiagramFromSystemDescription));

/**
 * POST /api/llm/explain-diagram
 * Body: { diagram: { nodes, edges, viewport } }
 * Returns: { explanation: string, validation: { valid, errors[] }, cost: {...} }
 */
router.post('/explain-diagram', asyncHandler(explainDiagram));

export default router;
