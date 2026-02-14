import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import "./styles/global.scss"
import { ContextProvider } from "./context/Context";

export const baseUrl = import.meta.env.VITE_BASE_URL;




createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
)
