"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { isValidCNPJ } from "@/lib/validators/cnpj"

export interface UpdateProfileState {
  error?: string
  success?: boolean
}

const profileSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
})

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await auth()
  if (!session?.user) return { error: "Sessão expirada." }

  const parsed = profileSchema.safeParse({ name: formData.get("name") })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  await container.userRepository.updateName(session.user.id, parsed.data.name)
  revalidatePath("/painel/perfil")

  return { success: true }
}

export interface UpdateCnpjState {
  error?: string
  success?: boolean
}

export async function updateCnpjAction(
  _prevState: UpdateCnpjState,
  formData: FormData
): Promise<UpdateCnpjState> {
  const session = await auth()
  if (!session?.user) return { error: "Sessão expirada." }

  const cnpj = String(formData.get("cnpj") ?? "").replace(/\D/g, "")
  if (!isValidCNPJ(cnpj)) {
    return { error: "CNPJ inválido. Confira os números digitados." }
  }

  try {
    await container.userRepository.updateCnpj(session.user.id, cnpj)
  } catch {
    return { error: "Este CNPJ já está cadastrado em outra conta." }
  }

  revalidatePath("/painel/perfil")
  return { success: true }
}
