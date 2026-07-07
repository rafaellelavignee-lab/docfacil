import { prisma } from "@/lib/prisma"
import { PrismaUserRepository } from "@/infrastructure/persistence/prisma/user-repository"
import { PrismaUserDocumentRepository } from "@/infrastructure/persistence/prisma/user-document-repository"
import { LocalStorage } from "@/infrastructure/storage/local-storage"
import { VercelBlobStorage } from "@/infrastructure/storage/vercel-blob-storage"
import { renderDocumentPdf } from "@/infrastructure/pdf/render-document-pdf"

/**
 * Composition root: única fronteira onde módulos de domínio são
 * conectados às implementações de infraestrutura. Use-cases nunca
 * importam Prisma diretamente — recebem as ports resolvidas aqui.
 */
export const container = {
  userRepository: new PrismaUserRepository(prisma),
  userDocumentRepository: new PrismaUserDocumentRepository(prisma),
  storage: process.env.BLOB_READ_WRITE_TOKEN
    ? new VercelBlobStorage()
    : new LocalStorage(),
  renderPdf: renderDocumentPdf,
}
