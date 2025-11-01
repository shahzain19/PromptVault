import React, { type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { PromptProvider } from '../features/prompts/PromptContext'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <PromptProvider>
        {children}
      </PromptProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }