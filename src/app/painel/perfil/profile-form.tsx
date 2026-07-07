"use client"

import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfileAction, type UpdateProfileState } from "./actions"

const initialState: UpdateProfileState = {}

export function ProfileForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState)

  useEffect(() => {
    if (state.success) toast.success("Perfil atualizado com sucesso.")
    if (state.error) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" name="name" defaultValue={defaultName} required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Salvar alterações
      </Button>
    </form>
  )
}
