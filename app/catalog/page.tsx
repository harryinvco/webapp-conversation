'use client'

import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Message } from '@/types'
import { CatalogDrawer } from '@/components/catalog'
import { PRODUCTS, CATEGORIES, Product } from '@/data/products'

export default function CatalogPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Chtisma Products! I can help you find the perfect solution for your business. Ask me anything or browse our catalog by tapping the products button.',
      timestamp: new Date(),
    },
  ])
  const [conversationId, setConversationId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [input, setInput] = useState('')

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setInput('')

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
          appType: 'catalog',
          query: content,
          conversationId,
          user: 'catalog-user',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

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
                      msg.id === assistantId
                        ? { ...msg, content: fullContent }
                        : msg
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

  const handleSelectProduct = useCallback((product: Product) => {
    setIsCatalogOpen(false)
    handleSendMessage(`Tell me more about ${product.name}`)
  }, [handleSendMessage])

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Chtisma Products</h1>
          <p className="text-xs text-white/80">AI Product Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full px-4 py-2 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
              } ${message.isStreaming ? 'animate-pulse' : ''}`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse rounded" />
                )}
              </p>
              <p
                className={`text-[10px] mt-1 ${
                  message.role === 'user' ? 'text-white/70 text-right' : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2">
          {/* Products Button */}
          <button
            onClick={() => setIsCatalogOpen(true)}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors flex items-center justify-center"
            title="Browse Products"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(input)
                }
              }}
              placeholder="Type a message..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-full text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              style={{ maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>

      <CatalogDrawer
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        products={PRODUCTS}
        categories={CATEGORIES}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  )
}
