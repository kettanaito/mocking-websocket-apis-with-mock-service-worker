import {
  render,
  screen,
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Chat } from './chat.js'
import { server } from '~/mocks/server.js'
import { chat } from '~/mocks/handlers.js'
import { createChatMessage } from '~/utils/message-utils.js'
import { createId } from '~/utils/create-id.js'

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

test('receives messages from other users', async () => {
  server.use(
    chat.addEventListener(
      'connection',
      ({ client }) => {
        client.addEventListener(
          'message',
          (event) => {
            event.stopPropagation()

            client.send(event.data)

            client.send(
              createChatMessage({
                type: 'message',
                data: {
                  id: createId(),
                  author: {
                    id: createId(),
                    name: 'Ashley',
                    avatarUrl: '/public/1.jpg',
                  },
                  sentAt: Date.now(),
                  text: 'Hi, John! How are you?',
                },
              }),
            )
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

  await event.type(messageInput, 'Hi, everyone!')
  await event.click(sendButton)

  expect(
    await screen.findAllByRole('log'),
  ).toEqual([
    expect.toHaveTextContent('Hi, everyone!'),
    expect.toHaveTextContent(
      'Hi, John! How are you?',
    ),
  ])
})
