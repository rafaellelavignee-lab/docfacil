import type { Prisma, PrismaClient } from "@/generated/prisma/client"
import type {
  CreateUserDocumentInput,
  UpdateUserDocumentInput,
  UserDocumentRepository,
} from "@/modules/documents/ports/user-document-repository"

const WITH_TEMPLATE_INCLUDE = {
  template: { select: { name: true, slug: true } },
  templateVersion: { select: { fieldsSchema: true, contentSchema: true, version: true } },
} satisfies Prisma.UserDocumentInclude

export class PrismaUserDocumentRepository implements UserDocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(input: CreateUserDocumentInput) {
    return this.prisma.userDocument.create({
      data: {
        userId: input.userId,
        templateId: input.templateId,
        templateVersionId: input.templateVersionId,
        title: input.title,
        data: input.data,
        pdfBlobUrl: input.pdfBlobUrl,
        status: "COMPLETED",
        lastGeneratedAt: new Date(),
      },
    })
  }

  findById(id: string) {
    return this.prisma.userDocument.findUnique({
      where: { id },
      include: WITH_TEMPLATE_INCLUDE,
    })
  }

  findManyByUser(userId: string) {
    return this.prisma.userDocument.findMany({
      where: { userId },
      include: WITH_TEMPLATE_INCLUDE,
      orderBy: { updatedAt: "desc" },
    })
  }

  async countThisMonthByUser(userId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return this.prisma.userDocument.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    })
  }

  update(id: string, input: UpdateUserDocumentInput) {
    return this.prisma.userDocument.update({
      where: { id },
      data: {
        ...(input.data ? { data: input.data } : {}),
        ...(input.pdfBlobUrl
          ? { pdfBlobUrl: input.pdfBlobUrl, lastGeneratedAt: new Date() }
          : {}),
        ...(input.title ? { title: input.title } : {}),
        ...(input.isFavorite !== undefined ? { isFavorite: input.isFavorite } : {}),
      },
    })
  }

  async duplicate(id: string) {
    const original = await this.prisma.userDocument.findUniqueOrThrow({ where: { id } })
    return this.prisma.userDocument.create({
      data: {
        userId: original.userId,
        templateId: original.templateId,
        templateVersionId: original.templateVersionId,
        title: `${original.title} (cópia)`,
        data: original.data as Prisma.InputJsonValue,
        pdfBlobUrl: original.pdfBlobUrl,
        status: original.status,
      },
    })
  }

  async delete(id: string) {
    await this.prisma.userDocument.delete({ where: { id } })
  }
}
