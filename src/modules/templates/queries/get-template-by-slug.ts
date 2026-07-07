import { prisma } from "@/lib/prisma"

export function getPublishedTemplateBySlug(slug: string) {
  return prisma.documentTemplate.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { activeVersion: true, category: true },
  })
}
