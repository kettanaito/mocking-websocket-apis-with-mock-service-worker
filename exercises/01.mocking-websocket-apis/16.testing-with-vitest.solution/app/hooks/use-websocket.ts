import * as React from 'react'
import { useEffectOnce } from './use-effect-once'

export function useWebSocket(
  url: string,
  options: {
    onOpen?: (event: Event) => void
    onMessage: (event: MessageEvent) => void
    onError?: (event: Event) => void
    onClose?: (event: CloseEvent) => void
  },
) {
  const [isConnectionOpen, setIsConnectionOpen] =
    React.useState(false)
  const webSocketRef = React.useRef<WebSocket>()

  useEffectOnce(() => {
    const ws = new WebSocket(url)
    webSocketRef.current = ws

    const abortConrtoller = new AbortController()

    if (options.onOpen) {
      ws.addEventListener(
        'open',
        options.onOpen,
        { signal: abortConrtoller.signal },
      )
    }

    if (options.onMessage) {
      ws.addEventListener(
        'message',
        options.onMessage,
        { signal: abortConrtoller.signal },
      )
    }

    if (options.onError) {
      ws.addEventListener(
        'error',
        options.onError,
        { signal: abortConrtoller.signal },
      )
    }

    if (options.onClose) {
      ws.addEventListener(
        'close',
        options.onClose,
        { signal: abortConrtoller.signal },
      )
    }

    ws.addEventListener(
      'open',
      () => {
        setIsConnectionOpen(true)
      },
      { signal: abortConrtoller.signal },
    )
    ws.addEventListener(
      'close',
      () => {
        abortConrtoller.abort()
        setIsConnectionOpen(false)
      },
      { signal: abortConrtoller.signal },
    )

    return () => {
      abortConrtoller.abort()
      ws.close()
    }
  })

  return {
    isConnectionOpen,
    getClient() {
      const ws = webSocketRef.current

      if (!ws) {
        throw new Error(
          'WebSocket client not initialized',
        )
      }

      return ws
    },
  }
}
