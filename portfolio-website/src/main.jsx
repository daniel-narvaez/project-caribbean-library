import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './routes/App/App.jsx'

import '@fontsource-variable/outfit';
import '@fontsource/baskervville-sc';
import '@fontsource/libre-baskerville';
import '@fontsource-variable/noto-sans';

document.documentElement.style.setProperty('--cursor-style', import.meta.env.DEV ? 'auto' : 'none');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
