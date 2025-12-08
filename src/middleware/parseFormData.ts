import { Request, Response, NextFunction } from 'express';

export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {
    try {
      const parsedData = JSON.parse(req.body.data);
      req.body = { ...req.body, ...parsedData };
      delete req.body.data;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in data field' });
    }
  }
  next();
};