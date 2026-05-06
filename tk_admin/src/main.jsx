import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import "./styles/global.scss"
import { ContextProvider } from "./context/Context";

const rawBaseUrl = (import.meta.env.VITE_BASE_URL || "").trim().replace(/\/+$/, "");
export const baseUrl = /\/api$/i.test(rawBaseUrl) ? rawBaseUrl : `${rawBaseUrl}/api`;




createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
)
