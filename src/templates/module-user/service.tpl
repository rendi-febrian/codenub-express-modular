import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
// import { hash } from 'bcrypt'; // Uncomment if using bcrypt

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public async findAll() {
    return await this.repository.findAll();
  }

  public async findById(id: string) {
    return await this.repository.findById(id);
  }

  public async create(data: CreateUserDto) {
    // const hashedPassword = await hash(data.password, 10);
    // return await this.repository.create({ ...data, password: hashedPassword });
    return await this.repository.create(data);
  }

  public async update(id: string, data: UpdateUserDto) {
    return await this.repository.update(id, data);
  }

  public async delete(id: string) {
    return await this.repository.delete(id);
  }
}
