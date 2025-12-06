import { cn } from "@/lib/utils"

type StatusType = "pending" | "under-review" | "accepted" | "completed" | "rejected" | "active" | "upcoming"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: "Изчакващ",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
  },
  "under-review": {
    label: "В преглед",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  accepted: {
    label: "Приет",
    className: "bg-success/15 text-success border-success/30",
  },
  completed: {
    label: "Завършен",
    className: "bg-accent/15 text-accent-foreground border-accent/30",
  },
  rejected: {
    label: "Отхвърлен",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  active: {
    label: "Активен",
    className: "bg-success/15 text-success border-success/30",
  },
  upcoming: {
    label: "Предстоящ",
    className: "bg-primary/15 text-primary border-primary/30",
  },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  if (!config) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground border-border",
          className,
        )}
      >
        {status}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
