"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"

async function assertOwnership(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Não autenticado.")

  const document = await container.userDocumentRepository.findById(id)
  if (!document || document.userId !== session.user.id) {
    throw new Error("Documento não encontrado.")
  }
  return document
}

export async function duplicateDocumentAction(id: string) {
  await assertOwnership(id)
  const duplicate = await container.userDocumentRepository.duplicate(id)
  redirect(`/painel/documentos/${duplicate.id}`)
}

export async function toggleFavoriteAction(id: string) {
  const document = await assertOwnership(id)
  await container.userDocumentRepository.update(id, { isFavorite: !document.isFavorite })
  revalidatePath(`/painel/documentos/${id}`)
  revalidatePath("/painel/documentos")
  revalidatePath("/painel/favoritos")
}

export async function deleteDocumentAction(id: string) {
  await assertOwnership(id)
  await container.userDocumentRepository.delete(id)
  redirect("/painel/documentos")
}
