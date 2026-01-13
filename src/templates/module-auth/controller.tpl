import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  public path = '/auth';
  public router = Router();
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.login);
  }

  public register = async (req: Request, res: Response) => {
    try {
      const result = await this.service.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const result = await this.service.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };
}
