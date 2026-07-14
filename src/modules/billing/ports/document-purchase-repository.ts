import type { DocumentPurchase, PaymentStatus } from "@/generated/prisma/client"

export interface CreateDocumentPurchaseInput {
  userId: string
  amountCents: number
}

export interface DocumentPurchaseRepository {
  create(input: CreateDocumentPurchaseInput): Promise<DocumentPurchase>
  setPreference(id: string, preferenceId: string): Promise<DocumentPurchase>
  findById(id: string): Promise<DocumentPurchase | null>
  findAvailableCreditByUser(userId: string): Promise<DocumentPurchase | null>
  markConsumed(id: string, userDocumentId: string): Promise<DocumentPurchase>
  updateStatus(
    id: string,
    input: { status: PaymentStatus; providerPaymentId?: string; paidAt?: Date }
  ): Promise<DocumentPurchase>
}
