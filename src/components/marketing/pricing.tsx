import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PlanItem {
  id: string
  name: string
  slug: string
  priceCents: number
  interval: string
  features: unknown
}

function formatPrice(cents: number) {
  if (cents === 0) return "Grátis"
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function Pricing({ plans }: { plans: PlanItem[] }) {
  return (
    <section id="precos" className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Preços simples e transparentes
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Comece de graça. Faça upgrade quando precisar de mais.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {plans.map((plan) => {
          const isPremium = plan.slug === "premium"
          const features = Array.isArray(plan.features) ? (plan.features as string[]) : []

          return (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col",
                isPremium && "border-primary ring-primary/20 shadow-lg ring-2"
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {isPremium && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                      Mais popular
                    </span>
                  )}
                </div>
                <p className="mt-2">
                  <span className="text-3xl font-semibold tracking-tight">
                    {formatPrice(plan.priceCents)}
                  </span>
                  {plan.priceCents > 0 && (
                    <span className="text-muted-foreground text-sm">/mês</span>
                  )}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isPremium ? "default" : "outline"}
                  render={<Link href="/registro" />}
                >
                  {isPremium ? "Assinar Premium" : "Começar grátis"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
