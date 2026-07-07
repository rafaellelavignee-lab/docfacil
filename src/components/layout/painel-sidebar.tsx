"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, FileText, LayoutDashboard, Settings, Star } from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/painel", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/painel/documentos", label: "Meus documentos", icon: FileText },
  { href: "/painel/favoritos", label: "Favoritos", icon: Star },
  { href: "/painel/assinatura", label: "Assinatura", icon: CreditCard },
  { href: "/painel/configuracoes", label: "Configurações", icon: Settings },
]

export function PainelSidebar() {
  const pathname = usePathname()

  return (
    <nav className="hidden w-56 shrink-0 flex-col gap-1 border-r px-3 py-6 md:flex">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
