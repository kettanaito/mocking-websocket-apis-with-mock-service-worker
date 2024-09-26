import { Plugin } from 'vite'
import { WebSocketServer } from 'ws'
import { parseChatMessage } from './app/utils/message-utils'

export function webSocketServer(): Plugin {
  return {
    name: 'websocket-server-plugin',
    enforce: 'pre',
    async configureServer() {
      try {
        const wss = new WebSocketServer({
          port: 56789,
        })

        wss.on('connection', (client) => {
          client.addEventListener('message', (event) => {
            if (event.data instanceof Array) {
              return
            }

            const message = parseChatMessage(event.data)
            if (!message) {
              return
            }

            switch (message.type) {
              case 'message': {
                client.send(event.data)
                break
              }
            }
          })
        })

        await new Promise<void>((resolve, reject) => {
          wss.once('listening', () => resolve())
          wss.once('error', (error) => reject(error))
        })
      } catch {
        return
      }
    },
  }
}
