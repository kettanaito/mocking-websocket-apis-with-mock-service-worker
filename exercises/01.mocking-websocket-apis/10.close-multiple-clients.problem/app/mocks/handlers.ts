import { ws } from 'msw'
import { parseChatMessage } from '~/utils/message-utils'

const chat = ws.link('wss://example.com/chat')

export const handlers = [
  chat.addEventListener(
    'connection',
    async ({ client }) => {
      client.addEventListener('message', (event) => {
        const message = parseChatMessage(event.data)

        if (!message) {
          return
        }

        if (message.data.text === 'close') {
          client.close(1003)
          return
        }

        chat.broadcast(event.data)
      })
    },
  ),
]
