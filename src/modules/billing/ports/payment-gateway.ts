export interface CreatePreferenceInput {
  externalReference: string
  title: string
  amountCents: number
  payerEmail: string
}

export interface PaymentPreference {
  preferenceId: string
  initPoint: string
}

export type GatewayPaymentStatus = "pending" | "approved" | "rejected" | "refunded"

export interface GatewayPayment {
  id: string
  status: GatewayPaymentStatus
  externalReference: string | null
}

export interface PaymentGateway {
  createPreference(input: CreatePreferenceInput): Promise<PaymentPreference>
  getPayment(paymentId: string): Promise<GatewayPayment>
}
