import { ws } from 'msw'

const chat = ws.link('wss://example.com/chat')

export const handlers = [
  chat.addEventListener('connection', ({ client }) => {
    client.addEventListener('message', (event) => {
      client.send(event.data)
    })
  }),
]
