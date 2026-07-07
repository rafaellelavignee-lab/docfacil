import Link from "next/link"
import { FileCheck2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}
    >
      <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
        <FileCheck2 className="size-4" />
      </span>
      <span>DocFácil</span>
    </Link>
  )
}
