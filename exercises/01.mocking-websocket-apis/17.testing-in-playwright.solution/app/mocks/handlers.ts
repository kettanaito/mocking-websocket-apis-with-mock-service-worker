import { ws } from 'msw'

export const chat = ws.link(
  'ws://127.0.0.1:56789/',
)

export const handlers = [
  chat.addEventListener(
    'connection',
    ({ client }) => {
      client.addEventListener(
        'message',
        (event) => {
          client.send(event.data)
        },
      )
    },
  ),
]
