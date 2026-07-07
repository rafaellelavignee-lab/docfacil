"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GoogleButton } from "@/components/auth/google-button"
import { registerAction, type RegisterState } from "./actions"

const initialState: RegisterState = {}

export default function RegistroPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Crie sua conta</CardTitle>
        <CardDescription>
          Gere seus primeiros documentos gratuitamente, sem cartão de crédito.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleButton />
        <div className="text-muted-foreground after:bg-border relative text-center text-xs after:absolute after:inset-x-0 after:top-1/2 after:h-px">
          <span className="bg-card relative px-2">ou com e-mail</span>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" name="name" placeholder="Maria da Silva" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="voce@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" minLength={8} required />
            <p className="text-muted-foreground text-xs">Mínimo de 8 caracteres.</p>
          </div>
          {state.error && (
            <p className="text-destructive text-sm" role="alert">
              {state.error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Criar conta
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
