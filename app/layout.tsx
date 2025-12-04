import { getLocaleOnServer } from '@/i18n/server'
import { ThemeProvider } from '@/app/context/theme-context'

import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full" data-theme="light">
      <body className="h-full bg-[var(--main-bg)]">
        <ThemeProvider>
          <div className="overflow-x-auto">
            <div className="w-screen h-screen min-w-[300px]">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
