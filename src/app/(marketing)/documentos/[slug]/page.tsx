import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowRight, CheckCircle2, HelpCircle, ListChecks } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getPublishedTemplateBySlug } from "@/modules/templates/queries/get-template-by-slug"
import { getPublishedTemplates } from "@/modules/templates/queries/get-published-templates"

export const revalidate = 3600

export async function generateStaticParams() {
  const templates = await getPublishedTemplates()
  return templates.map((template) => ({ slug: template.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const template = await getPublishedTemplateBySlug(slug)
  if (!template) return {}

  return {
    title: template.seoTitle ?? template.name,
    description: template.seoDescription ?? template.description,
  }
}

export default async function DocumentSeoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const template = await getPublishedTemplateBySlug(slug)
  if (!template) notFound()

  const faq = Array.isArray(template.faq)
    ? (template.faq as { question: string; answer: string }[])
    : []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <p className="text-primary text-sm font-medium">{template.category.name}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
        {template.name}
      </h1>

      <div className="mt-8">
        <Button
          size="lg"
          render={<Link href={`/painel/documentos/novo/${template.slug}`} />}
        >
          Gerar este documento agora
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <section className="mt-12 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-primary size-5" />
          <h2 className="text-lg font-semibold">O que é</h2>
        </div>
        <p className="text-muted-foreground">{template.description}</p>
      </section>

      <section className="mt-10 space-y-3">
        <div className="flex items-center gap-2">
          <ListChecks className="text-primary size-5" />
          <h2 className="text-lg font-semibold">Quando usar</h2>
        </div>
        <p className="text-muted-foreground">{template.whenToUse}</p>
      </section>

      <section className="mt-10 space-y-3">
        <div className="flex items-center gap-2">
          <ListChecks className="text-primary size-5" />
          <h2 className="text-lg font-semibold">Como preencher</h2>
        </div>
        <p className="text-muted-foreground">{template.howToUse}</p>
      </section>

      {faq.length > 0 && (
        <section className="mt-10 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-primary size-5" />
            <h2 className="text-lg font-semibold">Perguntas frequentes</h2>
          </div>
          <Accordion className="w-full">
            {faq.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <div className="mt-12 rounded-xl border p-6 text-center">
        <p className="font-medium">Pronto para gerar o seu?</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Leva menos de 2 minutos para preencher e baixar o PDF.
        </p>
        <Button
          className="mt-4"
          render={<Link href={`/painel/documentos/novo/${template.slug}`} />}
        >
          Gerar {template.name}
        </Button>
      </div>
    </div>
  )
}
