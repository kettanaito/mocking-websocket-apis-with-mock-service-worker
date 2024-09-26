import { ws } from 'msw'
import {
  createChatMessage,
  parseChatMessage,
} from '~/utils/message-utils'

const chat = ws.link('ws://127.0.0.1:56789/')

export const handlers = [
  chat.addEventListener(
    'connection',
    ({ server, client }) => {
      server.connect()

      server.addEventListener(
        'message',
        (event) => {
          const message = parseChatMessage(
            event.data,
          )

          if (!message) {
            return
          }

          event.preventDefault()

          message.data.text =
            message.data.text.toUpperCase()
          client.send(createChatMessage(message))
        },
      )
    },
  ),
]
