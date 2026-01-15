'use client'

import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Message } from '@/types'

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  conversationId: string
  createdAt: string
}

const STORAGE_KEY = 'chtisma-internal-chats'

export default function InternalPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSessions(parsed)
      } catch {
        // Invalid data
      }
    }
  }, [])

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    }
  }, [sessions])

  // Update session when messages change
  useEffect(() => {
    if (activeSessionId && messages.length > 0) {
      setSessions(prev => prev.map(s =>
        s.id === activeSessionId
          ? { ...s, messages, conversationId, title: s.title || messages[0]?.content.slice(0, 30) + '...' }
          : s
      ))
    }
  }, [messages, activeSessionId, conversationId])

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // Create new session if none active
    if (!activeSessionId) {
      const newSession: ChatSession = {
        id: uuidv4(),
        title: content.slice(0, 30) + '...',
        messages: [],
        conversationId: '',
        createdAt: new Date().toISOString(),
      }
      setSessions(prev => [newSession, ...prev])
      setActiveSessionId(newSession.id)
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
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
    setMessages(prev => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appType: 'internal',
          query: content,
          conversationId,
          user: 'internal-user',
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
                  setMessages(prev =>
                    prev.map(msg =>
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

      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantId
            ? { ...msg, isStreaming: false, content: fullContent || 'Sorry, I could not process your request.' }
            : msg
        )
      )
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantId
            ? { ...msg, isStreaming: false, content: 'Sorry, something went wrong. Please try again.' }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, activeSessionId])

  const handleNewChat = () => {
    setMessages([])
    setConversationId('')
    setActiveSessionId(null)
  }

  const handleSelectSession = (session: ChatSession) => {
    setActiveSessionId(session.id)
    setMessages(session.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })))
    setConversationId(session.conversationId)
  }

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (activeSessionId === sessionId) {
      handleNewChat()
    }
    // Update localStorage
    const updated = sessions.filter(s => s.id !== sessionId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={handleNewChat}
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Recent Chats</p>
          {sessions.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-400 text-center">No conversations yet</p>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer mb-1 transition-all ${
                  activeSessionId === session.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span className="flex-1 text-sm text-gray-700 truncate">{session.title}</span>
                <button
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              C
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Chtisma Internal</p>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-center bg-white">
          <h1 className="text-gray-800 font-semibold">Chtisma Assistant</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
              <p className="text-gray-500 mb-8">Ask me anything about your work.</p>
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {['Write a report summary', 'Help me brainstorm ideas', 'Explain a concept', 'Review my document'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-6 px-4">
              {messages.map((message) => (
                <div key={message.id} className="mb-6">
                  <div className="flex gap-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gray-700'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}
                    >
                      <span className="text-white text-sm font-medium">
                        {message.role === 'user' ? 'U' : 'C'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {message.role === 'user' ? 'You' : 'Chtisma Assistant'}
                      </p>
                      <div className={`prose prose-sm max-w-none ${
                        message.role === 'assistant' ? 'bg-white p-4 rounded-xl border border-gray-100 shadow-sm' : ''
                      }`}>
                        <p className="text-gray-800 whitespace-pre-wrap m-0">
                          {message.content}
                          {message.isStreaming && (
                            <span className="inline-block w-2 h-5 ml-1 bg-blue-500 animate-pulse rounded" />
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(input)
                  }
                }}
                placeholder="Message Chtisma..."
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-4 pr-14 bg-transparent text-gray-800 placeholder-gray-400 resize-none focus:outline-none disabled:opacity-50"
                style={{ maxHeight: '200px' }}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 bottom-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Chtisma Assistant for internal use only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
