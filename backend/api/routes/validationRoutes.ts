import { validate } from "../controllers/validationController";
import { Router, Request, Response } from 'express';

const router: Router = Router();

interface ValidationRequest extends Request {
  body: {
    data: string;
  };
}

router.post('/', async (req: ValidationRequest, res: Response) => {
  try {
    const { data } = req.body;

    if (!data || typeof data !== 'string') {
      return res.status(400).json({ 
        errors: ['Invalid input: data must be a JSON string'] 
      });
    }

    const errors = validate(data); 

    return res.status(200).json({ errors });
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ 
      errors: ['Internal server error during validation'] 
    });
  }
});


export default router;