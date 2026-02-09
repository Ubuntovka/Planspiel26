import { DiagramState, validate } from "../controllers/validationController";
import { Router, Request, Response } from 'express';

const router: Router = Router();

// interface ValidationRequest extends Request {
//   body: {
//     data: DiagramState;
//   };
// }

router.post('/', async (req: Request, res: Response) => {
  try {
    const data:DiagramState = req.body;

    const errors = await validate(data); 
    return res.status(200).json({ errors });
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ 
      errors: ['Internal server error during validation'] 
    });
  }
});


export default router;