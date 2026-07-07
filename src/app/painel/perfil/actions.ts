"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"

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
