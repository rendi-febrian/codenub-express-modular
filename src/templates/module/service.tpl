import { {{PascalName}}Repository } from './{{kebabName}}.repository';
import { Create{{PascalName}}Dto, Update{{PascalName}}Dto } from './dto/{{kebabName}}.dto';

export class {{PascalName}}Service {
  private repository: {{PascalName}}Repository;

  constructor() {
    this.repository = new {{PascalName}}Repository();
  }

  public async findAll() {
    return await this.repository.findAll();
  }

  public async findById(id: string) {
    return await this.repository.findById(id);
  }

  public async create(data: Create{{PascalName}}Dto) {
    return await this.repository.create(data);
  }

  public async update(id: string, data: Update{{PascalName}}Dto) {
    return await this.repository.update(id, data);
  }

  public async delete(id: string) {
    return await this.repository.delete(id);
  }
}
