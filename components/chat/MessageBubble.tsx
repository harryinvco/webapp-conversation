'use client'

import { Message } from '@/types'
import clsx from 'clsx'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={clsx(
        'flex w-full mb-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={clsx(
          'max-w-[80%] px-4 py-2 rounded-lg shadow-sm',
          isUser
            ? 'bg-[#dcf8c6] rounded-br-none'
            : 'bg-white rounded-bl-none',
          message.isStreaming && 'animate-pulse'
        )}
      >
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
          )}
        </p>
        <p
          className={clsx(
            'text-[10px] mt-1',
            isUser ? 'text-gray-600 text-right' : 'text-gray-500'
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}
