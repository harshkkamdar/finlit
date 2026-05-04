"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-primary/20 focus-visible:ring-primary/50",
  secondary:
    "bg-surface text-dark border border-border hover:bg-fill-subtle hover:-translate-y-[1px] hover:shadow-md focus-visible:ring-border",
  accent:
    "bg-accent text-dark hover:bg-accent/90 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-accent/20 focus-visible:ring-accent/50",
  danger:
    "bg-error text-white hover:bg-error/90 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-error/20 focus-visible:ring-error/50",
  ghost:
    "bg-transparent text-dark hover:bg-fill-muted hover:-translate-y-[1px] focus-visible:ring-border",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 min-h-[36px] text-sm rounded-md gap-1.5",
  md: "px-5 py-2.5 min-h-[44px] text-sm rounded-lg gap-2",
  lg: "px-7 py-3 min-h-[48px] text-base rounded-lg gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-body font-semibold
          transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
          active:scale-[0.98] active:translate-y-0
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
