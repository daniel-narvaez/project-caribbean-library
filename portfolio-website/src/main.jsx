import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// import './variables.css'
// import './typography.css'
// import './colors.css'
import './index.css'

import App from './routes/App/App.jsx'

import '@fontsource/libre-baskerville';
import '@fontsource-variable/noto-sans';
import '@fontsource-variable/outfit';

document.documentElement.style.setProperty('--cursor-style', import.meta.env.DEV ? 'auto' : 'none');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
