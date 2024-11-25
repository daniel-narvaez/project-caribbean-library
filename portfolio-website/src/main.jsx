import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import "@fontsource/baskervville-sc"
import '@fontsource/libre-baskerville';
import "@fontsource-variable/noto-sans"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
