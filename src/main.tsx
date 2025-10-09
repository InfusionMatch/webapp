import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import App from './App.tsx'
import './styles/globals.css'

// Import and configure Amplify
try {
  const outputs = await import('../amplify_outputs.json')
  Amplify.configure(outputs.default || outputs)
  console.log('Amplify configured successfully')
} catch (error) {
  console.error('Failed to configure Amplify:', error)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
