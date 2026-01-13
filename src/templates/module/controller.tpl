import { Router, Request, Response } from 'express';
import { {{PascalName}}Service } from './{{kebabName}}.service';

/**
 * @swagger
 * tags:
 *   name: {{PascalName}}
 *   description: {{PascalName}} management
 */
export class {{PascalName}}Controller {
  public path = '/{{kebabName}}';
  public router = Router();
  private service: {{PascalName}}Service;

  constructor() {
    this.service = new {{PascalName}}Service();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.post(`${this.path}`, this.create);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  /**
   * @swagger
   * /{{kebabName}}:
   *   get:
   *     summary: Get all {{kebabName}}s
   *     tags: [{{PascalName}}]
   *     responses:
   *       200:
   *         description: List of {{kebabName}}s
   */
  public getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.service.findAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  /**
   * @swagger
   * /{{kebabName}}/{id}:
   *   get:
   *     summary: Get {{kebabName}} by ID
   *     tags: [{{PascalName}}]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: {{PascalName}} details
   */
  public getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  /**
   * @swagger
   * /{{kebabName}}:
   *   post:
   *     summary: Create new {{kebabName}}
   *     tags: [{{PascalName}}]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Create{{PascalName}}Dto'
   *     responses:
   *       201:
   *         description: {{PascalName}} created
   */
  public create = async (req: Request, res: Response) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  /**
   * @swagger
   * /{{kebabName}}/{id}:
   *   put:
   *     summary: Update {{kebabName}}
   *     tags: [{{PascalName}}]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Update{{PascalName}}Dto'
   *     responses:
   *       200:
   *         description: {{PascalName}} updated
   */
  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  /**
   * @swagger
   * /{{kebabName}}/{id}:
   *   delete:
   *     summary: Delete {{kebabName}}
   *     tags: [{{PascalName}}]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: {{PascalName}} deleted
   */
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
