import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// mantine
import AppMantimeProvider from './providers/Provider/AppMantineProvider.tsx'
import PaymentTimerProvider from './providers/Provider/PaymentTimerProvider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// init i18n
import './config/i18n.ts'
import { ConfigProvider } from 'antd'

// Create a new router instance
const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js').catch((err) => {
    console.error('Service Worker registration failed:', err)
  })
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <AppMantimeProvider>
          <PaymentTimerProvider>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: 'SourceCodePro, monospace',
                  colorPrimary: 'var(--primary-color)',
                },
              }}
            >
              <RouterProvider router={router} />
            </ConfigProvider>
          </PaymentTimerProvider>
        </AppMantimeProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
