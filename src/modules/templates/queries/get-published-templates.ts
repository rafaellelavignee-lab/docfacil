import { prisma } from "@/lib/prisma"

export function getPublishedTemplates() {
  return prisma.documentTemplate.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: { name: "asc" },
  })
}
