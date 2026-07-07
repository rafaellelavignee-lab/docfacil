import Link from "next/link"
import { Logo } from "@/components/layout/logo"
import { InstagramIcon, LinkedinIcon, XIcon } from "@/components/layout/social-icons"

const FOOTER_COLUMNS = [
  {
    title: "Produto",
    links: [
      { href: "/documentos", label: "Todos os documentos" },
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/#precos", label: "Preços" },
      { href: "/#faq", label: "Perguntas frequentes" },
    ],
  },
  {
    title: "Categorias",
    links: [
      { href: "/documentos?categoria=pessoal", label: "Pessoal" },
      { href: "/documentos?categoria=financeiro", label: "Financeiro" },
      { href: "/documentos?categoria=contratos", label: "Contratos" },
      { href: "/documentos?categoria=trabalho", label: "Trabalho" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/sobre", label: "Sobre o DocFácil" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Política de privacidade" },
      { href: "/lgpd", label: "LGPD" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">
              Gere documentos profissionais em PDF preenchendo formulários simples.
              Rápido, seguro e sem complicação.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground"
              >
                <InstagramIcon className="size-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-foreground"
              >
                <LinkedinIcon className="size-4" />
              </Link>
              <Link
                href="https://twitter.com"
                aria-label="Twitter/X"
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" />
              </Link>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DocFácil. Todos os direitos reservados.</p>
          <p>Feito no Brasil, para o Brasil.</p>
        </div>
      </div>
    </footer>
  )
}
