import type { UserDocument } from "@/generated/prisma/client"

export interface CreateUserDocumentInput {
  userId: string
  templateId: string
  templateVersionId: string
  title: string
  data: Record<string, string>
  pdfBlobUrl: string
}

export interface UpdateUserDocumentInput {
  data?: Record<string, string>
  pdfBlobUrl?: string
  title?: string
  isFavorite?: boolean
}

export type UserDocumentWithTemplate = UserDocument & {
  template: { name: string; slug: string }
  templateVersion: { fieldsSchema: unknown; contentSchema: unknown; version: number }
}

export interface UserDocumentRepository {
  create(input: CreateUserDocumentInput): Promise<UserDocument>
  findById(id: string): Promise<UserDocumentWithTemplate | null>
  findManyByUser(userId: string): Promise<UserDocumentWithTemplate[]>
  countThisMonthByUser(userId: string): Promise<number>
  update(id: string, input: UpdateUserDocumentInput): Promise<UserDocument>
  duplicate(id: string): Promise<UserDocument>
  delete(id: string): Promise<void>
}
