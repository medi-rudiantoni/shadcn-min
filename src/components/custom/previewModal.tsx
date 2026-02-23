import { useEffect, useState } from "react"

interface PreviewModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  duration?: number
}

export function PreviewModal({
  open,
  onClose,
  children,
  duration = 200,
}: PreviewModalProps) {
  const [mounted, setMounted] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)

      requestAnimationFrame(() => {
        setAnimate(true)
      })
    } else {
      setAnimate(false)

      const timeout = setTimeout(() => {
        setMounted(false)
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [open, duration])

  if (!mounted) return null

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[999] overflow-y-auto py-20
        transition-colors duration-${duration}
        ${animate ? "bg-neutral-900/40" : "bg-neutral-900/0"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl mx-auto bg-white h-fit
          transform transition-all ease-out
          duration-${duration}
          ${animate
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
          }`}
      >
        {children}
      </div>
    </div>
  )
}
