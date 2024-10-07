import { ws } from 'msw'
import {
  createChatMessage,
  parseChatMessage,
} from '~/utils/message-utils'

const chat = ws.link('ws://127.0.0.1:56789/')

export const handlers = [
  chat.addEventListener(
    'connection',
    ({ client }) => {
      client.addEventListener(
        'message',
        (event) => {
          event.stopPropagation()
          console.log(1)
        },
      )
    },
  ),
  chat.addEventListener(
    'connection',
    ({ client }) => {
      client.addEventListener(
        'message',
        (event) => {
          console.log(2)
        },
      )
    },
  ),
]
