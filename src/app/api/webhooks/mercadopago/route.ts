import { createHmac, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"

import { container } from "@/lib/container"
import { confirmDocumentPurchase } from "@/modules/billing/use-cases/confirm-document-purchase"

function isValidSignature(request: Request, dataId: string): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET
  if (!secret) return true // sem secret configurado (ex: dev local), pula a verificação

  const signatureHeader = request.headers.get("x-signature")
  const requestId = request.headers.get("x-request-id")
  if (!signatureHeader || !requestId) return false

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=")
      return [key?.trim(), value?.trim()]
    })
  )
  const ts = parts.ts
  const receivedHash = parts.v1
  if (!ts || !receivedHash) return false

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`
  const expectedHash = createHmac("sha256", secret).update(manifest).digest("hex")

  const expected = Buffer.from(expectedHash)
  const received = Buffer.from(receivedHash)
  if (expected.length !== received.length) return false

  return timingSafeEqual(expected, received)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const type = body?.type ?? new URL(request.url).searchParams.get("type")
  const dataId = body?.data?.id ?? new URL(request.url).searchParams.get("data.id")

  if (type !== "payment" || !dataId) {
    return NextResponse.json({ received: true })
  }

  if (!isValidSignature(request, String(dataId))) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 })
  }

  await confirmDocumentPurchase(
    {
      documentPurchaseRepository: container.documentPurchaseRepository,
      paymentGateway: container.paymentGateway,
    },
    String(dataId)
  )

  return NextResponse.json({ received: true })
}
