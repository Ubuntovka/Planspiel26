import { Router, Request, Response } from 'express';

import exampleHandler from '../controllers/exampleController';

const router: Router = Router();

router.get('/example', (req: Request, res: Response) => {
  exampleHandler(req, res);
});

export default router;