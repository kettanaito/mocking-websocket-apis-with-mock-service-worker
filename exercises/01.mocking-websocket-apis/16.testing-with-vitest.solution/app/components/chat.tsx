import * as React from 'react'
import { toast } from 'sonner'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Input } from './ui/input.js'
import { Button } from './ui/button.js'
import { Badge } from './ui/badge.js'
import { ScrollArea } from './ui/scroll-area.js'
import {
  ChatMessage,
  type User,
} from './chat-message.js'
import {
  createChatMessage,
  parseChatMessage,
} from '~/utils/message-utils.js'
import { createId } from '~/utils/create-id.js'
import { useWebSocket } from '~/hooks/use-websocket.js'

interface ChatProps {
  user: User
}

export function Chat({ user }: ChatProps) {
  const messagesScrollAreaRef =
    React.useRef<HTMLDivElement>(null)
  const mediaInputRef =
    React.useRef<HTMLInputElement>(null)
  const [uploadedMedia, setUploadedMedia] =
    React.useState<File>()
  const [messages, setMessages] = React.useState<
    Array<ChatMessage>
  >([])

  const { isConnectionOpen, getClient } =
    useWebSocket('ws://127.0.0.1:56789/', {
      onMessage(event) {
        const message = parseChatMessage(
          event.data,
        )

        if (!message) {
          return
        }

        switch (message.type) {
          case 'message': {
            setMessages((prevMessages) =>
              prevMessages.concat(message.data),
            )
            break
          }
        }
      },
      onClose(event) {
        if (event.code === 1000) {
          return toast('Disconnected', {
            description: 'Client disconnected.',
            duration: Infinity,
          })
        }

        toast.error('Connection error', {
          description:
            event.reason + `(${event.code})`,
        })
      },
    })

  const uploadMedia = () => {
    const input = mediaInputRef.current
    if (!input) {
      return
    }

    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (file) {
        setUploadedMedia(file)
      }
    })

    input.click()
  }

  const submitMessageForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!user) {
      return
    }

    const form = event.currentTarget
    const fields = new FormData(form)
    const message = fields.get(
      'message',
    ) as string
    const mediaFile = fields.get('media')
    let media: ChatMessage['media'] | undefined

    if (
      mediaFile != null &&
      mediaFile instanceof File &&
      mediaFile.size > 0
    ) {
      const reader = new FileReader()
      reader.readAsDataURL(mediaFile)

      await new Promise<string>(
        (resolve, reject) => {
          reader.onload = () =>
            resolve(reader.result as string)
          reader.onerror = reject
        },
      ).then((base64Url) => {
        media = {
          base64Url,
          altText: mediaFile.name,
        }
      })
    }

    const ws = getClient()
    ws.send(
      createChatMessage({
        type: 'message',
        data: {
          id: createId(),
          author: user,
          sentAt: Date.now(),
          text: message,
          media,
        },
      }),
    )

    form.reset()
    setUploadedMedia(undefined)
  }

  React.useEffect(() => {
    const messagesScrollArea =
      messagesScrollAreaRef.current

    if (messagesScrollArea) {
      messagesScrollArea.scrollTo({
        top: messagesScrollArea.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <header className="grid items-center h-12 grid-cols-3 px-6 text-sm font-bold border-b bg-muted/50">
        <p className="col-start-2 text-center">
          Chat App{' '}
          {user ? <>- {user.name}</> : null}
        </p>
        {user ? (
          <form
            method="post"
            action="/user/logout"
            className="justify-self-end"
          >
            <Button variant="outline" size="sm">
              Log out
            </Button>
          </form>
        ) : null}
      </header>

      <ScrollArea
        viewportRef={messagesScrollAreaRef}
        className="flex-grow p-6"
      >
        <ol className="grid flex-col w-full gap-6">
          {messages.map((message) => (
            <li key={message.id} className="grid">
              <ChatMessage
                {...message}
                activeUser={user}
              />
            </li>
          ))}
        </ol>
      </ScrollArea>

      <form
        onSubmit={submitMessageForm}
        className="p-6 border-t bg-muted/30"
      >
        <fieldset
          className="flex flex-col gap-4"
          disabled={!isConnectionOpen}
        >
          <div className="flex gap-4">
            <Button
              variant="secondary"
              type="button"
              className="px-2.5"
              onClick={uploadMedia}
            >
              <PaperClipIcon className="size-[20px]" />
            </Button>
            <input
              ref={mediaInputRef}
              type="file"
              name="media"
              accept="image/png, image/jpeg"
              hidden
            />
            <Input
              name="message"
              placeholder="Enter message..."
              tabIndex={2}
              aria-label="Chat message"
              required
            />
          </div>
          <footer className="flex items-center self-end gap-6">
            {uploadedMedia ? (
              <Badge variant="secondary">
                {uploadedMedia.name}
              </Badge>
            ) : null}
            <Button
              type="submit"
              className="self-end px-8"
            >
              Send
            </Button>
          </footer>
        </fieldset>
      </form>
    </div>
  )
}
