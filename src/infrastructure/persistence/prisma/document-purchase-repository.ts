import type { PrismaClient, PaymentStatus } from "@/generated/prisma/client"
import type {
  CreateDocumentPurchaseInput,
  DocumentPurchaseRepository,
} from "@/modules/billing/ports/document-purchase-repository"

export class PrismaDocumentPurchaseRepository implements DocumentPurchaseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(input: CreateDocumentPurchaseInput) {
    return this.prisma.documentPurchase.create({
      data: {
        userId: input.userId,
        amountCents: input.amountCents,
      },
    })
  }

  setPreference(id: string, preferenceId: string) {
    return this.prisma.documentPurchase.update({
      where: { id },
      data: { preferenceId },
    })
  }

  findById(id: string) {
    return this.prisma.documentPurchase.findUnique({ where: { id } })
  }

  findAvailableCreditByUser(userId: string) {
    return this.prisma.documentPurchase.findFirst({
      where: { userId, status: "APPROVED", consumedByDocumentId: null },
      orderBy: { paidAt: "asc" },
    })
  }

  markConsumed(id: string, userDocumentId: string) {
    return this.prisma.documentPurchase.update({
      where: { id },
      data: { consumedByDocumentId: userDocumentId },
    })
  }

  updateStatus(
    id: string,
    input: { status: PaymentStatus; providerPaymentId?: string; paidAt?: Date }
  ) {
    return this.prisma.documentPurchase.update({
      where: { id },
      data: {
        status: input.status,
        providerPaymentId: input.providerPaymentId,
        paidAt: input.paidAt,
      },
    })
  }
}
