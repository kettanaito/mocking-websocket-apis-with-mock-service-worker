import {
  render,
  screen,
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Chat } from './chat.js'
import { server } from '~/mocks/server.js'
import { chat } from '~/mocks/handlers.js'

const event = userEvent.setup()

test('sends a chat message', async () => {
  server.use(
    chat.addEventListener(
      'connection',
      ({ client }) => {
        client.addEventListener(
          'message',
          (event) => {
            client.send(event.data)
          },
        )
      },
    ),
  )

  render(
    <Chat
      user={{
        id: 'user-01',
        name: 'John',
        avatarUrl: '/public/avatars/1.jpg',
      }}
    />,
  )

  const messageInput = screen.getByLabelText(
    'Chat message',
  )
  const sendButton = screen.getByRole('button', {
    name: /Send/,
  })

  await event.type(messageInput, 'Hello world')
  await event.click(sendButton)

  expect(
    await screen.findByRole('log'),
  ).toHaveTextContent('Hello world')
})
