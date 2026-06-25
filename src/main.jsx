import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './hooks/useTheme.jsx'
import { IdentityProvider } from './hooks/useIdentity.jsx'

window.history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <IdentityProvider>
          <App />
        </IdentityProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
