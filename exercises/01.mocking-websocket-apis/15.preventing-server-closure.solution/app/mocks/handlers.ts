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
        'close',
        (event) => {
          event.preventDefault()
        },
      )

      client.addEventListener(
        'message',
        (event) => {
          event.preventDefault()

          const message = parseChatMessage(
            event.data,
          )

          if (!message) {
            return
          }

          message.data.author.name = 'MSW'

          if (
            server.socket.readyState >
            WebSocket.OPEN
          ) {
            client.send(
              createChatMessage(message),
            )
          } else {
            server.send(
              createChatMessage(message),
            )
          }
        },
      )

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
