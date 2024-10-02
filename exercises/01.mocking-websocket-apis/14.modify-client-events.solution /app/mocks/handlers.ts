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
      // client.addEventListener(
      //   'message',
      //   (event) => {
      //     client.send(event.data)
      //   },
      // )
      server.connect()
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
          server.send(createChatMessage(message))
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
