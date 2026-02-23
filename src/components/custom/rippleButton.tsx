import React, { PropsWithChildren, MouseEvent, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Props extends PropsWithChildren {
  type?: "button" | "reset" | "submit";
  href?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  target?: "_blank" | "_self";
  theme?: "emerald" | "sky" | "none";
  className?: string;
  px?: 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  py?: 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  disabled?: boolean;
  loading?: boolean;
  rippleColor?: string;
  'aria-label'?: string;
}

const RippleButton: React.FC<Props> = ({
  children,
  onClick,
  type = "button",
  href,
  target = "_self",
  className = "",
  theme = "none",
  px,
  py,
  disabled = false,
  loading = false,
  rippleColor,
  'aria-label': ariaLabel,
  ...restProps
}) => {
  const router = useRouter();

  // Memoize padding classes untuk performa
  const paddingClasses = React.useMemo(() => {
    const pxClass = px !== undefined ? `px-${px}` : "px-5";
    const pyClass = py !== undefined ? `py-${py}` : "py-3";
    return `${pxClass} ${pyClass}`;
  }, [px, py]);

  // Memoize theme classes
  const themeClasses = React.useMemo(() => {
    switch (theme) {
      case "sky":
        return "rounded-lg bg-sky-600 text-white hover:bg-sky-700 offset-2";
      case "emerald":
        return "rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 offset-2";
      case "none":
      default:
        return "bg-transparent text-inherit hover:bg-gray-100 2 gray-500 offset-2";
    }
  }, [theme]);

  const createRippleEffect = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Bersihkan ripple sebelumnya
    const existingRipples = button.querySelectorAll('.ripple-effect');
    existingRipples.forEach(ripple => ripple.remove());

    // Buat ripple baru
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    // Hitung posisi relatif terhadap button
    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;

    // Style ripple
    circle.className = "ripple-effect";
    circle.style.cssText = `
      position: absolute;
      width: ${diameter}px;
      height: ${diameter}px;
      left: ${x}px;
      top: ${y}px;
      background: ${rippleColor || (theme === "none" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.3)")};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
      z-index: 0;
    `;

    button.appendChild(circle);

    // Bersihkan setelah animasi selesai
    setTimeout(() => {
      if (circle.parentNode) {
        circle.parentNode.removeChild(circle);
      }
    }, 600);
  }, [theme, rippleColor]);

  const handleClick = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    // Buat ripple effect
    createRippleEffect(e);

    // Handle navigation
    if (href) {
      try {
        if (target === "_blank") {
          window.open(href, "_blank", "noopener,noreferrer");
        } else {
          router.push(href);
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }

    // Call custom onClick handler
    if (onClick) {
      try {
        await onClick(e);
      } catch (error) {
        console.error("onClick handler error:", error);
      }
    }
  }, [disabled, loading, href, target, router, onClick, createRippleEffect]);

  const buttonClasses = `
    ${className}
    ${paddingClasses}
    ${themeClasses}
    relative
    overflow-hidden
    inline-flex
    items-center
    justify-center
    font-medium
    transition-all
    duration-200
    ease-in-out
    focus:outline-none
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-90'}
    ${loading ? 'pointer-events-none' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <>
      <style jsx>{`
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
      <button
        type={type}
        onClick={handleClick}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-disabled={disabled || loading}
        {...restProps}
      >
        <span className="relative z-10 flex items-center justify-center">
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
        </span>
      </button>
    </>
  );
};

export default RippleButton;