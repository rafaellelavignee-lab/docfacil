import type { DocumentPurchaseRepository } from "@/modules/billing/ports/document-purchase-repository"
import type { PaymentGateway } from "@/modules/billing/ports/payment-gateway"

export class CompanyAccountRequiredError extends Error {
  constructor() {
    super("Apenas contas empresa (com CNPJ cadastrado) podem comprar documentos avulsos.")
  }
}

export function getDocumentPriceCents(): number {
  return Number(process.env.PRICE_PER_DOCUMENT_CENTS ?? "1990")
}

export interface PurchaseDocumentCreditInput {
  userId: string
  userEmail: string
  userCnpj: string | null
}

export interface PurchaseDocumentCreditDeps {
  documentPurchaseRepository: DocumentPurchaseRepository
  paymentGateway: PaymentGateway
}

export async function purchaseDocumentCredit(
  deps: PurchaseDocumentCreditDeps,
  input: PurchaseDocumentCreditInput
): Promise<{ initPoint: string }> {
  if (!input.userCnpj) {
    throw new CompanyAccountRequiredError()
  }

  const amountCents = getDocumentPriceCents()
  const purchase = await deps.documentPurchaseRepository.create({
    userId: input.userId,
    amountCents,
  })

  const preference = await deps.paymentGateway.createPreference({
    externalReference: purchase.id,
    title: "Documento avulso - DocFácil",
    amountCents,
    payerEmail: input.userEmail,
  })

  await deps.documentPurchaseRepository.setPreference(
    purchase.id,
    preference.preferenceId
  )

  return { initPoint: preference.initPoint }
}
