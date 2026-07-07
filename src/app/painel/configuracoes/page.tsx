import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeleteAccountDialog } from "./delete-account-dialog"

export default async function ConfiguracoesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Preferências da conta e privacidade dos seus dados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Meus dados (LGPD)</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Você pode solicitar uma cópia de todos os seus dados armazenados no DocFácil.
          </p>
          <Button variant="outline" disabled>
            Exportar meus dados (em breve)
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <h2 className="text-destructive font-semibold">Zona de risco</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Excluir sua conta desativa o acesso permanentemente. Essa ação não pode ser
            desfeita.
          </p>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  )
}
