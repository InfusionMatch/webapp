import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import './styles/globals.css'

// CONFIGURE AMPLIFY FIRST - before importing App
Amplify.configure(outputs, { ssr: false })
console.log('Amplify configured successfully')

// Import App AFTER configuration
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
