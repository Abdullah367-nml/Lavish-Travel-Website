import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form primitives.
 *
 * Deliberately built on native <select>, <input> and <textarea> rather than
 * custom listbox widgets. On a mid-range Android — the majority of South
 * African traffic — a native select opens the OS picker, which is more
 * thumb-friendly than anything we would build, needs no JavaScript, and is
 * keyboard- and screen-reader-accessible without any aria work.
 *
 * Every control is at least 44px tall per Section 7.
 */

const controlBase =
  "w-full min-h-[44px] rounded-sm border border-border bg-surface px-3.5 py-2.5 text-body-sm text-foreground " +
  "placeholder:text-muted-foreground/70 transition-colors " +
  "hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-destructive";

export function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<"label"> & { required?: boolean }) {
  return (
    <label
      className={cn(
        "block text-caption font-medium uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden className="ml-1 text-accent">
          *
        </span>
      )}
    </label>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(controlBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea className={cn(controlBase, "min-h-[110px]", className)} {...props} />
  );
}

/**
 * Native select with our own chevron. `appearance-none` removes the OS
 * arrow on desktop; the picker behaviour on touch devices is untouched.
 */
export function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(controlBase, "appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-accent"
      />
    </div>
  );
}

/**
 * Field wrapper. The error is wired to the control with aria-describedby by
 * the caller, and rendered in a live region so screen readers announce it
 * when validation fails — Section 7 requires form errors to be announced.
 */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-caption text-muted-foreground">{hint}</p>
      )}
      <p
        id={`${htmlFor}-error`}
        role="alert"
        aria-live="polite"
        className={cn(
          "text-caption text-destructive",
          error ? "" : "sr-only",
        )}
      >
        {error ?? ""}
      </p>
    </div>
  );
}
