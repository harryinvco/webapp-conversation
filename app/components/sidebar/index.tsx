import React, { useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleLeftIcon,
  MoonIcon,
  PencilSquareIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import type { ConversationItem } from '@/types/app'
import { useTheme } from '@/app/context/theme-context'

const MAX_CONVERSATION_LENTH = 20

// ChatGPT-style conversation item component
const ConversationListItem: FC<{
  item: ConversationItem
  isCurrent: boolean
  onClick: () => void
}> = React.memo(({ item, isCurrent, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
        isCurrent
          ? 'bg-[var(--sidebar-hover)] text-[var(--text-primary)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
      }`}
    >
      <ChatBubbleLeftIcon className="w-4 h-4 flex-shrink-0 opacity-70" />
      <span className="truncate flex-1 text-[13px]">{item.name}</span>
    </div>
  )
})

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
}) => {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  // Memoize handlers to prevent unnecessary re-renders
  const handleNewChat = useCallback(() => {
    onCurrentIdChange('-1')
  }, [onCurrentIdChange])

  // Memoize the current year
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  // Create stable click handlers for each item
  const createItemClickHandler = useCallback((id: string) => () => {
    onCurrentIdChange(id)
  }, [onCurrentIdChange])

  return (
    <div className="shrink-0 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] pc:w-[260px] tablet:w-[260px] mobile:w-[280px] tablet:h-[calc(100vh_-_3rem)] mobile:h-screen">
      {/* Logo and Brand */}
      <div className="flex-shrink-0 p-4 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <img
            src="/chtisma-logo.png"
            alt="Chtisma"
            className="w-9 h-9 rounded-lg object-contain"
          />
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-[var(--text-primary)]">Chtisma</div>
            <div className="text-xs text-[var(--text-muted)]">AI Assistant</div>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="flex-shrink-0 p-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[var(--sidebar-border)] text-[var(--text-primary)] hover:bg-[var(--sidebar-hover)] transition-all duration-200 text-sm font-medium"
        >
          <PencilSquareIcon className="w-4 h-4" />
          <span>{t('app.chat.newChat')}</span>
        </button>
      </div>

      {/* Conversations List */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {list.length > 0 && (
          <div className="mb-2">
            <h3 className="px-3 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {list.map(item => (
                <ConversationListItem
                  key={item.id}
                  item={item}
                  isCurrent={item.id === currentId}
                  onClick={createItemClickHandler(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="flex-shrink-0 p-3 border-t border-[var(--sidebar-border)]">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)] transition-all duration-200 text-sm"
        >
          {theme === 'light'
            ? (
              <>
                <MoonIcon className="w-4 h-4" />
                <span>Dark mode</span>
              </>
            )
            : (
              <>
                <SunIcon className="w-4 h-4" />
                <span>Light mode</span>
              </>
            )}
        </button>

        {/* Copyright */}
        <div className="mt-3 px-3 text-[var(--text-muted)] text-[10px]">
          © {copyRight} {currentYear}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
