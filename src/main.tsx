import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './navigation.css'
import './unitLookup.css'
import './poolTheme.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('عنصر اصلی برنامه پیدا نشد.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
