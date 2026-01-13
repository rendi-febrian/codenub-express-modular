export class UserRepository {
  // TODO: Inject Prisma Service
  
  public async findAll() {
    // return prisma.user.findMany();
    return [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
  }

  public async findById(id: string) {
    // return prisma.user.findUnique({ where: { id } });
    return { id, name: 'John Doe', email: 'john@example.com' };
  }

  public async create(data: any) {
    // return prisma.user.create({ data });
    return { id: Math.random(), ...data };
  }

  public async update(id: string, data: any) {
    // return prisma.user.update({ where: { id }, data });
    return { id, ...data };
  }

  public async delete(id: string) {
    // return prisma.user.delete({ where: { id } });
    return true;
  }
}
