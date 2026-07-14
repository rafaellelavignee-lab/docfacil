import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"
import { CompanyForm } from "./company-form"

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await container.userRepository.findById(session.user.id)
  if (!user) redirect("/login")

  const initials = (user.name ?? user.email)
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gerencie suas informações pessoais.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>

      <ProfileForm defaultName={user.name ?? ""} />

      <Separator />

      <CompanyForm defaultCnpj={user.cnpj} />
    </div>
  )
}
