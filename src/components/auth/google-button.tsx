"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function GoogleButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => signIn("google", { redirectTo: "/painel" })}
    >
      <svg viewBox="0 0 24 24" className="size-4">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.82-.07-1.42-.22-2.05H12v3.72h6.53c-.13 1.03-.84 2.6-2.42 3.65l-.02.15 3.52 2.63.24.02c2.24-2 3.64-4.96 3.64-8.12z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.05 7.93-2.86l-3.78-2.8c-1.01.68-2.37 1.16-4.15 1.16-3.17 0-5.86-2.04-6.82-4.87l-.14.01-3.66 2.74-.05.13C3.3 21.3 7.35 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.18 14.63A7.2 7.2 0 0 1 4.77 12c0-.91.16-1.79.4-2.63l-.01-.17-3.7-2.79-.12.06A11.98 11.98 0 0 0 0 12c0 1.93.47 3.76 1.34 5.36l3.84-2.73z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c2.25 0 3.77.97 4.64 1.78l3.39-3.3C17.94 1.19 15.24 0 12 0 7.35 0 3.3 2.7 1.34 6.64l3.83 2.73C6.14 6.79 8.83 4.75 12 4.75z"
        />
      </svg>
      Continuar com o Google
    </Button>
  )
}
