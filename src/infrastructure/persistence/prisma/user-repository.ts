import type { PrismaClient } from "@/generated/prisma/client"
import type {
  CreateUserInput,
  UserRepository,
} from "@/modules/users/ports/user-repository"

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  create(input: CreateUserInput) {
    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        consentAt: new Date(),
      },
    })
  }

  updateName(id: string, name: string) {
    return this.prisma.user.update({ where: { id }, data: { name } })
  }

  updateCnpj(id: string, cnpj: string) {
    return this.prisma.user.update({ where: { id }, data: { cnpj } })
  }

  async softDelete(id: string) {
    await this.prisma.user.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
