import { AppType } from '@/types'
import { APP_CONFIGS, DIFY_API_URL } from './config'

export async function sendMessage(
  appType: AppType,
  query: string,
  conversationId?: string,
  user?: string
) {
  const config = APP_CONFIGS[appType]

  if (!config.apiKey) {
    throw new Error(`API key not configured for ${appType}`)
  }

  const response = await fetch(`${DIFY_API_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {},
      query,
      response_mode: 'streaming',
      conversation_id: conversationId || '',
      user: user || 'default-user',
    }),
  })

  if (!response.ok) {
    throw new Error(`Dify API error: ${response.status}`)
  }

  return response
}

export async function getConversations(appType: AppType, user: string) {
  const config = APP_CONFIGS[appType]

  if (!config.apiKey) {
    throw new Error(`API key not configured for ${appType}`)
  }

  const response = await fetch(
    `${DIFY_API_URL}/conversations?user=${user}&limit=20`,
    {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Dify API error: ${response.status}`)
  }

  return response.json()
}
