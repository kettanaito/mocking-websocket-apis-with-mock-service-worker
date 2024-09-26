import { ws } from 'msw'

const chat = ws.link(
  'ws://127.0.0.1:56789/',
)

export const handlers = [
  chat.addEventListener(
    'connection',
    ({ server }) => {
      server.connect()
    },
  ),
]
