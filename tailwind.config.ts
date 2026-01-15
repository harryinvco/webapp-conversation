import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#25d366',
          dark: '#128c7e',
        },
        whatsapp: {
          green: '#25d366',
          teal: '#128c7e',
          dark: '#075e54',
          light: '#dcf8c6',
          bg: '#e5ddd5',
        },
      },
    },
  },
  plugins: [],
}

export default config
