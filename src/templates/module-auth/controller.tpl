import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
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
