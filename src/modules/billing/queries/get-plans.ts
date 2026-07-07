import { prisma } from "@/lib/prisma"

export function getActivePlans() {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceCents: "asc" },
  })
}
