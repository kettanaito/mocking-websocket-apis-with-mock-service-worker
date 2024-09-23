import { ws, delay } from 'msw'
import { User } from '~/components/chat-message'
import { createId } from '~/utils/create-id'
import { createChatMessage } from '~/utils/message-utils'

const chat = ws.link('wss://example.com/chat')

const john = {
  id: createId(),
  name: 'John',
  avatarUrl: '/public/avatars/1.jpg',
} satisfies User

const emily = {
  id: createId(),
  name: 'Emily',
  avatarUrl: '/public/avatars/7.jpg',
} satisfies User

const johnMessages: Array<string> = [
  'Hello',
  'I am fine, how are you?',
]

const emilyMessages: Array<string> = [
  'Oh, hi! How are you?',
  'Me too, thanks.',
]

export const handlers = [
  chat.addEventListener(
    'connection',
    async ({ client }) => {
      for (let i = 0; i < johnMessages.length; i++) {
        const johnMessage = johnMessages[i]

        await delay(500)
        client.send(
          createChatMessage({
            type: 'message',
            data: {
              id: createId(),
              author: john,
              text: johnMessage,
              sentAt: Date.now(),
            },
          }),
        )
        await delay(1000)

        const emilyMessage = emilyMessages[i]

        if (emilyMessage) {
          client.send(
            createChatMessage({
              type: 'message',
              data: {
                id: createId(),
                author: emily,
                text: emilyMessage,
                sentAt: Date.now(),
              },
            }),
          )
          await delay(1000)
        }
      }

      client.addEventListener('message', (event) => {
        if (typeof event.data !== 'string') {
          return
        }

        chat.broadcast(event.data)
      })
    },
  ),
]
