export type AppType = 'catalog' | 'internal' | 'client'

export interface AppConfig {
  id: string
  apiKey: string
  name: string
  description: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  name: string
  messages: Message[]
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: string
}

export interface ChatResponse {
  event: string
  message_id?: string
  conversation_id?: string
  answer?: string
  created_at?: number
}
