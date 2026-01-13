import { Router, Request, Response } from 'express';

export class IndexController {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.index);
  }

  private index = (req: Request, res: Response) => {
    try {
      res.status(200).json({ message: 'Welcome to CODENUB Express Modular' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
