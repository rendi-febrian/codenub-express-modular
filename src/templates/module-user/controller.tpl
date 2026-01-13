import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const users = await this.service.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const user = await this.service.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const user = await this.service.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const user = await this.service.update(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
