import { prisma } from "@/lib/prisma"

export async function getUserActivePlan(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  })
  if (subscription) return subscription.plan

  return prisma.plan.findUniqueOrThrow({ where: { slug: "gratuito" } })
}
