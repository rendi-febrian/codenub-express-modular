import { Request, Response, NextFunction } from 'express';

export const {{PascalName}}Middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement middleware logic
    console.log('{{PascalName}}Middleware executed');
    next();
  } catch (error) {
    res.status(500).json({ message: 'Middleware error' });
  }
};
