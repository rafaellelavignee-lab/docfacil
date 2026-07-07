"use server"

import { z } from "zod"

import { signIn } from "@/lib/auth"
import { container } from "@/lib/container"
import {
  EmailAlreadyInUseError,
  registerUser,
} from "@/modules/users/use-cases/register-user"

const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
})

export interface RegisterState {
  error?: string
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  try {
    await registerUser(container.userRepository, parsed.data)
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return { error: error.message }
    }
    return { error: "Não foi possível criar sua conta. Tente novamente." }
  }

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/painel",
  })

  return {}
}
