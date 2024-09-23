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

    ws.onopen = options.onOpen || null
    ws.onmessage = options.onMessage || null
    ws.onerror = options.onError || null
    ws.onclose = options.onClose || null

    const abortConrtoller = new AbortController()
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
        throw new Error('WebSocket client not initialized')
      }

      return ws
    },
  }
}
