"use server"

import { auth, signOut } from "@/lib/auth"
import { container } from "@/lib/container"

export async function deleteAccountAction() {
  const session = await auth()
  if (!session?.user) throw new Error("Não autenticado.")

  await container.userRepository.softDelete(session.user.id)
  await signOut({ redirectTo: "/" })
}
