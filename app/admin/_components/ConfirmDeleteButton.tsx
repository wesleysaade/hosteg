'use client'

interface Props {
  message: string
  className?: string
  children: React.ReactNode
}

export function ConfirmDeleteButton({ message, className, children }: Props) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </button>
  )
}
