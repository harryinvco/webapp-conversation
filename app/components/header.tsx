import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  ChevronDownIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 bg-[var(--main-bg)] border-b border-[var(--sidebar-border)]">
      {/* Left side - Menu button (mobile) or empty */}
      <div className="flex items-center gap-2 min-w-[60px]">
        {isMobile && (
          <button
            className="flex items-center justify-center h-9 w-9 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] transition-colors"
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Center - Model selector style title */}
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors">
        <SparklesIcon className="h-4 w-4 text-[var(--accent-color)]" />
        <span className="text-sm font-medium text-[var(--text-primary)]">{title}</span>
        <ChevronDownIcon className="h-3 w-3 text-[var(--text-muted)]" />
      </button>

      {/* Right side - New chat button */}
      <div className="flex items-center gap-2 min-w-[60px] justify-end">
        <button
          className="flex items-center justify-center h-9 w-9 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] transition-colors"
          onClick={() => onCreateNewChat?.()}
          title="New chat"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default React.memo(Header)
