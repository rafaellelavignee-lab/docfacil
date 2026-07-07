"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Menu } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_LINKS = [
  { href: "/documentos", label: "Documentos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#precos", label: "Preços" },
  { href: "/#faq", label: "FAQ" },
]

export function SiteHeader() {
  const { status } = useSession()

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            {status === "authenticated" ? (
              <Button render={<Link href="/painel" />}>Ir para o painel</Button>
            ) : (
              <>
                <Button variant="ghost" render={<Link href="/login" />}>
                  Entrar
                </Button>
                <Button render={<Link href="/registro" />}>Gerar documento</Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:bg-muted rounded-md px-3 py-2 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 px-4">
                {status === "authenticated" ? (
                  <Button render={<Link href="/painel" />}>Ir para o painel</Button>
                ) : (
                  <>
                    <Button variant="outline" render={<Link href="/login" />}>
                      Entrar
                    </Button>
                    <Button render={<Link href="/registro" />}>Gerar documento</Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
