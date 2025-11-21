import type { Request, Response } from 'express';

export default function exampleHandler(req: Request, res: Response): void {
  res.status(200).json({ message: 'Success' });
}

