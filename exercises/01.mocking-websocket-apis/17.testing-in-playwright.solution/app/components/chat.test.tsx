import {
  render,
  screen,
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Chat } from './chat.js'

const event = userEvent.setup()

test('sends a chat message', async () => {
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
