import { ws } from 'msw'
import { ChatMessage } from '~/components/chat-message'

const chat = ws.link('wss://example.com/chat')

export const handlers = [
  chat.addEventListener('connection', ({ client }) => {
    client.addEventListener('message', (event) => {
      if (typeof event.data !== 'string') {
        return
      }

      const message = JSON.parse(event.data) as {
        type: 'message'
        data: ChatMessage
      }

      chat.broadcast(
        JSON.stringify({
          ...message,
          data: {
            ...message.data,
            text: message.data.text.toUpperCase(),
          },
        }),
      )
    })
  }),
]
