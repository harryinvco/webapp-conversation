import { AppConfig, AppType } from '@/types'

export const DIFY_API_URL = process.env.DIFY_API_URL || 'https://api.dify.ai/v1'

export const APP_CONFIGS: Record<AppType, AppConfig> = {
  catalog: {
    id: process.env.CATALOG_APP_ID || '',
    apiKey: process.env.CATALOG_API_KEY || '',
    name: 'Chtisma Product Catalog',
    description: 'Browse and discover our products',
  },
  internal: {
    id: process.env.INTERNAL_APP_ID || '',
    apiKey: process.env.INTERNAL_API_KEY || '',
    name: 'Chtisma Assistant',
    description: 'Internal AI assistant for employees',
  },
  client: {
    id: process.env.CLIENT_APP_ID || '',
    apiKey: process.env.CLIENT_API_KEY || '',
    name: 'Chtisma Support',
    description: 'Customer support assistant',
  },
}

export function getAppConfig(appType: AppType): AppConfig {
  return APP_CONFIGS[appType]
}
