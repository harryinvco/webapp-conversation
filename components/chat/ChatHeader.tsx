'use client'

interface ChatHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  rightAction?: React.ReactNode
}

export function ChatHeader({ title, subtitle, onBack, rightAction }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#075e54] text-white">
      {onBack && (
        <button
          onClick={onBack}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
      </div>
      {rightAction}
    </div>
  )
}
