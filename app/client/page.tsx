'use client'

import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Message } from '@/types'
import { ChatHeader, MessageList, ChatInput } from '@/components/chat'

export default function ClientPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! Welcome to Chtisma Support. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [conversationId, setConversationId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const assistantId = uuidv4()
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appType: 'client',
          query: content,
          conversationId,
          user: 'client-user',
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.conversation_id && !conversationId) {
                  setConversationId(data.conversation_id)
                }
                if (data.answer) {
                  fullContent += data.answer
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId ? { ...msg, content: fullContent } : msg
                    )
                  )
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, isStreaming: false, content: fullContent || 'Sorry, I could not process your request.' }
            : msg
        )
      )
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, isStreaming: false, content: 'Sorry, something went wrong. Please try again.' }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl">
      {/* Messenger-style header */}
      <ChatHeader
        title="Chtisma Support"
        subtitle="Usually responds instantly"
      />

      <MessageList messages={messages} />

      <ChatInput
        onSend={handleSendMessage}
        disabled={isLoading}
        placeholder="Type your message..."
      />

      {/* Messenger branding footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Powered by Chtisma AI
        </p>
      </div>
    </div>
  )
}
