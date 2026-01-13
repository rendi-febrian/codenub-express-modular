import { Request, Response } from 'express';
import { {{PascalName}}Service } from './{{kebabName}}.service';

export class {{PascalName}}Controller {
  private service: {{PascalName}}Service;

  constructor() {
    this.service = new {{PascalName}}Service();
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.service.findAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
