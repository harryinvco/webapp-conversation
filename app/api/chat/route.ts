import { NextRequest } from 'next/server'
import { AppType } from '@/types'
import { APP_CONFIGS, DIFY_API_URL } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appType, query, conversationId, user } = body as {
      appType: AppType
      query: string
      conversationId?: string
      user?: string
    }

    const config = APP_CONFIGS[appType]

    if (!config?.apiKey) {
      return new Response(
        JSON.stringify({ error: `API key not configured for ${appType}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
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
      const error = await response.text()
      return new Response(
        JSON.stringify({ error: `Dify API error: ${error}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Stream the response
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
