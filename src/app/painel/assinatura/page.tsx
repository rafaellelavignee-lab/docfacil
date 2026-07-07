import Link from "next/link"
import { Check } from "lucide-react"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { getUserActivePlan } from "@/modules/billing/queries/get-user-plan"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default async function AssinaturaPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const [plan, documentsThisMonth] = await Promise.all([
    getUserActivePlan(session.user.id),
    container.userDocumentRepository.countThisMonthByUser(session.user.id),
  ])

  const features = Array.isArray(plan.features) ? (plan.features as string[]) : []
  const isFree = plan.documentLimitPerMonth != null
  const usagePercent = isFree
    ? Math.min(100, (documentsThisMonth / (plan.documentLimitPerMonth ?? 1)) * 100)
    : 0

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assinatura</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gerencie seu plano e acompanhe seu uso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            {!isFree && <Badge>Ativo</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="text-primary mt-0.5 size-4 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {isFree && (
            <div className="space-y-2 pt-2">
              <div className="text-muted-foreground flex justify-between text-sm">
                <span>Documentos este mês</span>
                <span>
                  {documentsThisMonth} / {plan.documentLimitPerMonth}
                </span>
              </div>
              <Progress value={usagePercent} />
            </div>
          )}
        </CardContent>
        {isFree && (
          <CardFooter>
            <Button className="w-full" render={<Link href="/#precos" />}>
              Fazer upgrade para o Premium
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
