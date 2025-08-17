import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FancyForm from './fancy-form'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FancyForm />
  </StrictMode>,
)
