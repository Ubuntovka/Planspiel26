import { Router, Request, Response } from 'express';

import exampleHandler from '../controllers/exampleController';

const router: Router = Router();

/**
 * @openapi
 * /api/example:
 *   get:
 *     tags:
 *       - Example
 *     summary: Example endpoint
 *     description: Returns an example payload for testing API availability.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/example', (req: Request, res: Response) => {
  exampleHandler(req, res);
});

export default router;