import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const document = await container.userDocumentRepository.findById(id)
  if (!document || document.userId !== session.user.id || !document.pdfBlobUrl) {
    return NextResponse.redirect(new URL("/painel/documentos", request.url))
  }

  await prisma.documentDownloadLog.create({
    data: { userDocumentId: id, userId: session.user.id, format: "pdf" },
  })

  return NextResponse.redirect(new URL(document.pdfBlobUrl, request.url))
}
