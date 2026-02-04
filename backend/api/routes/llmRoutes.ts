import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateDiagramFromPrompt } from '../controllers/llmController';

const router = Router();

/**
 * POST /api/llm/generate-diagram
 * Body: { prompt: string }
 * Returns: { diagram: { nodes, edges, viewport } }
 */
router.post('/generate-diagram', asyncHandler(generateDiagramFromPrompt));

export default router;
