import bcrypt from "bcryptjs"
import type { UserRepository } from "@/modules/users/ports/user-repository"

export interface RegisterUserInput {
  name: string
  email: string
  password: string
}

export class EmailAlreadyInUseError extends Error {
  constructor() {
    super("Já existe uma conta com este e-mail.")
  }
}

export async function registerUser(
  userRepository: UserRepository,
  input: RegisterUserInput
) {
  const existing = await userRepository.findByEmail(input.email)
  if (existing) {
    throw new EmailAlreadyInUseError()
  }

  const passwordHash = await bcrypt.hash(input.password, 12)

  return userRepository.create({
    name: input.name,
    email: input.email,
    passwordHash,
  })
}
