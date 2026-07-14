import type { DocumentPurchaseRepository } from "@/modules/billing/ports/document-purchase-repository"
import type { PaymentGateway } from "@/modules/billing/ports/payment-gateway"

const GATEWAY_TO_PAYMENT_STATUS = {
  approved: "APPROVED",
  rejected: "REJECTED",
  refunded: "REFUNDED",
  pending: "PENDING",
} as const

export interface ConfirmDocumentPurchaseDeps {
  documentPurchaseRepository: DocumentPurchaseRepository
  paymentGateway: PaymentGateway
}

export async function confirmDocumentPurchase(
  deps: ConfirmDocumentPurchaseDeps,
  paymentId: string
): Promise<void> {
  const payment = await deps.paymentGateway.getPayment(paymentId)
  if (!payment.externalReference) return

  const purchase = await deps.documentPurchaseRepository.findById(
    payment.externalReference
  )
  if (!purchase) return

  await deps.documentPurchaseRepository.updateStatus(purchase.id, {
    status: GATEWAY_TO_PAYMENT_STATUS[payment.status],
    providerPaymentId: payment.id,
    paidAt: payment.status === "approved" ? new Date() : undefined,
  })
}
