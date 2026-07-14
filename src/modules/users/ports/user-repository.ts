import type { User } from "@/generated/prisma/client"

export interface CreateUserInput {
  name: string
  email: string
  passwordHash: string
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(input: CreateUserInput): Promise<User>
  updateName(id: string, name: string): Promise<User>
  updateCnpj(id: string, cnpj: string): Promise<User>
  softDelete(id: string): Promise<void>
}
