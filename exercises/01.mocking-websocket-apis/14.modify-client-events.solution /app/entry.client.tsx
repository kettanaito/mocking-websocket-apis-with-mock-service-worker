import { RemixBrowser } from '@remix-run/react'
import {
  startTransition,
  StrictMode,
} from 'react'
import { hydrateRoot } from 'react-dom/client'

async function enableMocking() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import(
      './mocks/browser'
    )
    await worker.start({
      onUnhandledRequest(request, print) {
        if (request.url.endsWith('.jpg')) {
          return
        }

        print.warning()
      },
    })
  }
}

enableMocking().then(() => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    )
  })
})
