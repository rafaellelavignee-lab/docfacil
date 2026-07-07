import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { PainelSidebar } from "@/components/layout/painel-sidebar"

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={session.user} />
        </div>
      </header>
      <div className="flex flex-1">
        <PainelSidebar />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
