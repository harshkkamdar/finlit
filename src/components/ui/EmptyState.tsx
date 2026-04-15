import type { LucideIcon } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      {/* Muted icon */}
      <div className="w-16 h-16 rounded-2xl bg-fill-muted flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-muted/50" />
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-semibold text-dark mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="font-body text-sm text-muted max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* CTA */}
      {action && (
        action.href ? (
          <a href={action.href}>
            <Button variant="primary" size="md">
              {action.label}
            </Button>
          </a>
        ) : (
          <Button variant="primary" size="md" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
