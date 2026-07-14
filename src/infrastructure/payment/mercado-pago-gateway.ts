import type {
  CreatePreferenceInput,
  GatewayPayment,
  PaymentGateway,
  PaymentPreference,
} from "@/modules/billing/ports/payment-gateway"

const API_BASE = "https://api.mercadopago.com"

const STATUS_MAP: Record<string, GatewayPayment["status"]> = {
  approved: "approved",
  rejected: "rejected",
  cancelled: "rejected",
  refunded: "refunded",
  charged_back: "refunded",
  pending: "pending",
  in_process: "pending",
  in_mediation: "pending",
}

export class MercadoPagoGateway implements PaymentGateway {
  private get accessToken() {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN
    if (!token) throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.")
    return token
  }

  private get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  }

  async createPreference(input: CreatePreferenceInput): Promise<PaymentPreference> {
    const response = await fetch(`${API_BASE}/checkout/preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: input.title,
            quantity: 1,
            currency_id: "BRL",
            unit_price: input.amountCents / 100,
          },
        ],
        payer: { email: input.payerEmail },
        external_reference: input.externalReference,
        notification_url: `${this.appUrl}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${this.appUrl}/painel/documentos/avulso/retorno`,
          pending: `${this.appUrl}/painel/documentos/avulso/retorno`,
          failure: `${this.appUrl}/painel/documentos/avulso/retorno`,
        },
        auto_return: "approved",
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Falha ao criar preferência no Mercado Pago: ${await response.text()}`
      )
    }

    const data = await response.json()
    return { preferenceId: data.id, initPoint: data.init_point }
  }

  async getPayment(paymentId: string): Promise<GatewayPayment> {
    const response = await fetch(`${API_BASE}/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    })

    if (!response.ok) {
      throw new Error(
        `Falha ao consultar pagamento no Mercado Pago: ${await response.text()}`
      )
    }

    const data = await response.json()
    return {
      id: String(data.id),
      status: STATUS_MAP[data.status] ?? "pending",
      externalReference: data.external_reference ?? null,
    }
  }
}
