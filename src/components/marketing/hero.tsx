"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, FileCheck2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="from-primary/10 pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b to-transparent"
      />
      <div className="mx-auto max-w-4xl px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="size-3.5" />
            Mais de 15 modelos prontos para usar
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
        >
          Documentos profissionais em minutos, não em horas.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg text-balance"
        >
          Preencha um formulário simples e gere declarações, contratos, recibos e
          procurações em PDF — bem formatados e prontos para assinar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg" render={<Link href="/registro" />}>
            Gerar Documento
            <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/documentos" />}>
            Ver documentos
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="border-border/60 bg-card mx-auto mt-16 flex max-w-md items-center gap-4 rounded-xl border p-4 text-left shadow-xl"
        >
          <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
            <FileCheck2 className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              Contrato de Prestação de Serviço.pdf
            </p>
            <p className="text-muted-foreground text-xs">
              Gerado agora · pronto para baixar
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
