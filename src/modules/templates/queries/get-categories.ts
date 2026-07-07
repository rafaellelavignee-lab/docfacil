import { prisma } from "@/lib/prisma"

export function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { templates: { where: { status: "PUBLISHED" } } } },
    },
  })
}
