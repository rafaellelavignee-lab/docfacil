import {
  Banknote,
  Briefcase,
  Building2,
  Car,
  FileSignature,
  GraduationCap,
  Home,
  User,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  user: User,
  banknote: Banknote,
  "file-signature": FileSignature,
  "building-2": Building2,
  users: Users,
  home: Home,
  car: Car,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
}

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string | null
  className?: string
}) {
  const Icon = (icon && ICONS[icon]) || FileText
  return <Icon className={className} />
}
