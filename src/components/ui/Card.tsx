import { HTMLAttributes } from "react";

type CardVariant = "default" | "elevated" | "bordered";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-surface rounded-xl p-6 shadow-sm",
  elevated: "bg-surface rounded-xl p-6 shadow-md",
  bordered: "bg-surface rounded-xl p-6 border border-border",
};

export default function Card({
  variant = "default",
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        ${variantStyles[variant]}
        ${hover ? "transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-md hover:-translate-y-[1px]" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
