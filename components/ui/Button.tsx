import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonStatus = "idle" | "loading" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  status?: ButtonStatus;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#1A1A1A] text-white hover:bg-[#333] h-14 text-[15px] uppercase font-semibold rounded-none",
  secondary: "bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]",
  outline: "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg)]",
};

function MagneticPrimary({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (isTouch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / 8;
    const dy = (e.clientY - cy) / 8;
    x.set(dx);
    y.set(dy);
  }, [isTouch, x, y]);

  const handlePointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleTouchStart = useCallback(() => {
    setIsTouch(true);
  }, []);

  return (
    <motion.button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors",
        variantStyles.primary,
        className
      )}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", status = "idle", children, disabled, ...props }, ref) => {
    if (variant === "primary") {
      return (
        <MagneticPrimary className={className} disabled={disabled || status !== "idle"} {...(props as any)}>
          {status === "loading" && <Loader2 size={16} className="mr-2 animate-spin" />}
          {status === "success" && <Check size={16} className="mr-2" />}
          {children}
        </MagneticPrimary>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors",
          variantStyles[variant],
          (disabled || status !== "idle") && "opacity-60 cursor-not-allowed",
          className
        )}
        disabled={disabled || status !== "idle"}
        {...props}
      >
        {status === "loading" && <Loader2 size={16} className="mr-2 animate-spin" />}
        {status === "success" && <Check size={16} className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
