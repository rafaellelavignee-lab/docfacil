"use client"

import { useTransition } from "react"
import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteAccountAction } from "./actions"

export function DeleteAccountDialog() {
  const [isPending, startTransition] = useTransition()

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        <Trash2 /> Excluir minha conta
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir sua conta</DialogTitle>
          <DialogDescription>
            Esta ação desativa permanentemente sua conta e você perderá o acesso aos seus
            documentos. Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => startTransition(() => deleteAccountAction())}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Sim, excluir minha conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
