'use client'
import type { FC } from 'react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem } from '@/types/app'

interface VirtualizedChatListProps {
  chatList: ChatItem[]
  feedbackDisabled?: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  useCurrentUserAvatar?: boolean
  suggestionClick?: (suggestion: string) => void
}

// Memoized chat item component to prevent unnecessary re-renders
const ChatItemRenderer: FC<{
  item: ChatItem
  isLast: boolean
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  useCurrentUserAvatar?: boolean
  suggestionClick?: (suggestion: string) => void
}> = React.memo(({
  item,
  isLast,
  feedbackDisabled,
  onFeedback,
  isResponding,
  useCurrentUserAvatar,
  suggestionClick,
}) => {
  if (item.isAnswer) {
    return (
      <Answer
        item={item}
        feedbackDisabled={feedbackDisabled}
        onFeedback={onFeedback}
        isResponding={isResponding && isLast}
        suggestionClick={suggestionClick}
      />
    )
  }

  return (
    <Question
      id={item.id}
      content={item.content}
      useCurrentUserAvatar={useCurrentUserAvatar}
      imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(f => f.url) : []}
    />
  )
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.item.id === nextProps.item.id
    && prevProps.item.content === nextProps.item.content
    && prevProps.item.feedback?.rating === nextProps.item.feedback?.rating
    && prevProps.isLast === nextProps.isLast
    && prevProps.isResponding === nextProps.isResponding
    && prevProps.feedbackDisabled === nextProps.feedbackDisabled
  )
})

// Virtual scrolling threshold - use windowing for large lists
const VIRTUALIZATION_THRESHOLD = 50
const VISIBLE_BUFFER = 10

const VirtualizedChatList: FC<VirtualizedChatListProps> = ({
  chatList,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  useCurrentUserAvatar,
  suggestionClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: chatList.length })

  // For lists under threshold, render all items (optimized with memoization)
  const shouldVirtualize = chatList.length > VIRTUALIZATION_THRESHOLD

  // Simple windowing for very large lists
  useEffect(() => {
    if (!shouldVirtualize || !containerRef.current) { return }

    const handleScroll = () => {
      if (!containerRef.current) { return }

      const { scrollTop, clientHeight } = containerRef.current
      const estimatedItemHeight = 150
      const startIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - VISIBLE_BUFFER)
      const endIndex = Math.min(
        chatList.length,
        Math.ceil((scrollTop + clientHeight) / estimatedItemHeight) + VISIBLE_BUFFER,
      )

      setVisibleRange({ start: startIndex, end: endIndex })
    }

    const container = containerRef.current
    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll)
  }, [chatList.length, shouldVirtualize])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current && chatList.length > 0) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: isResponding ? 'auto' : 'smooth',
        })
      })
    }
  }, [chatList.length, isResponding])

  const renderItems = useCallback(() => {
    if (!shouldVirtualize) {
      // Render all items with memoization
      return chatList.map((item, index) => (
        <div key={item.id} className="py-[15px]">
          <ChatItemRenderer
            item={item}
            isLast={index === chatList.length - 1}
            feedbackDisabled={feedbackDisabled}
            onFeedback={onFeedback}
            isResponding={isResponding}
            useCurrentUserAvatar={useCurrentUserAvatar}
            suggestionClick={suggestionClick}
          />
        </div>
      ))
    }

    // Virtual rendering for large lists
    const items = []
    const { start, end } = visibleRange

    // Add spacer for items before visible range
    if (start > 0) {
      items.push(
        <div key="spacer-top" style={{ height: start * 150 }} />,
      )
    }

    // Render visible items
    for (let i = start; i < end && i < chatList.length; i++) {
      const item = chatList[i]
      items.push(
        <div key={item.id} className="py-[15px]">
          <ChatItemRenderer
            item={item}
            isLast={i === chatList.length - 1}
            feedbackDisabled={feedbackDisabled}
            onFeedback={onFeedback}
            isResponding={isResponding}
            useCurrentUserAvatar={useCurrentUserAvatar}
            suggestionClick={suggestionClick}
          />
        </div>,
      )
    }

    // Add spacer for items after visible range
    if (end < chatList.length) {
      items.push(
        <div key="spacer-bottom" style={{ height: (chatList.length - end) * 150 }} />,
      )
    }

    return items
  }, [chatList, visibleRange, shouldVirtualize, feedbackDisabled, onFeedback, isResponding, useCurrentUserAvatar, suggestionClick])

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto"
      style={{ contain: 'layout style paint' }}
    >
      <div className="space-y-[30px]">
        {renderItems()}
      </div>
    </div>
  )
}

export default React.memo(VirtualizedChatList)
