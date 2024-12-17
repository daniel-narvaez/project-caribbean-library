import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import "@fontsource/baskervville-sc"
import '@fontsource/libre-baskerville';
import "@fontsource-variable/noto-sans"

if (import.meta.env.DEV) {
  document.documentElement.style.setProperty('--cursor-style', 'auto');
} else {
  document.documentElement.style.setProperty('--cursor-style', 'none');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
