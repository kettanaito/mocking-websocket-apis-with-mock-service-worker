import { ws } from 'msw'

const chat = ws.link('wss://example.com/chat')

export const handlers = [
  chat.addEventListener('connection', () => {
    console.log('New connection!')
  }),
]
