import React from 'react'
import type { MetaFunction } from '@remix-run/node'
import { toast } from 'sonner'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import {
  ChatMessage,
  User,
} from '~/components/chat-message'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Badge } from '~/components/ui/badge'
import { useWebSocket } from '~/hooks/use-websocket'
import { Input } from '~/components/ui/input'
import { JoinUserDialog } from '~/components/join-user-dialog'
import { createId } from '~/utils/create-id'
import {
  createChatMessage,
  parseChatMessage,
} from '~/utils/message-utils'

export interface ChatMessagePayload {
  type: 'message'
  data: ChatMessage
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Chat App' },
    {
      name: 'description',
      content: 'Chat App using Remix, WebSockets, and MSW',
    },
  ]
}

const USER_SESSION_KEY = 'activeUser'

export default function Homepage() {
  const [user, setUser] = React.useState<User>(() => {
    /**
     * @fixme @todo Use client hints for this
     * so the user is persisted in cookies and available on initial load.
     */
    if (typeof sessionStorage !== 'undefined') {
      const activeUser = sessionStorage.getItem(
        USER_SESSION_KEY,
      )
      return activeUser ? JSON.parse(activeUser) : undefined
    }
  })
  const messagesScrollAreaRef =
    React.useRef<HTMLDivElement>(null)
  const mediaInputRef = React.useRef<HTMLInputElement>(null)
  const [uploadedMedia, setUploadedMedia] =
    React.useState<File>()
  const [messages, setMessages] = React.useState<
    Array<ChatMessage>
  >([])

  const handleUserJoin = (user: User) => {
    setUser(user)
    sessionStorage.setItem(
      USER_SESSION_KEY,
      JSON.stringify(user),
    )
  }

  const { isConnectionOpen, getClient } = useWebSocket(
    'wss://example.com/chat',
    {
      onMessage(event) {
        const message = parseChatMessage(event.data)

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
          })
        }

        toast.error('Connection error', {
          description: event.reason + `(${event.code})`,
        })
      },
    },
  )

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
    const message = fields.get('message') as string
    const mediaFile = fields.get('media')
    let media: ChatMessage['media'] | undefined

    if (
      mediaFile != null &&
      mediaFile instanceof File &&
      mediaFile.size > 0
    ) {
      const reader = new FileReader()
      reader.readAsDataURL(mediaFile)

      await new Promise<string>((resolve, reject) => {
        reader.onload = () =>
          resolve(reader.result as string)
        reader.onerror = reject
      }).then((base64Url) => {
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
    const messagesScrollArea = messagesScrollAreaRef.current

    if (messagesScrollArea) {
      messagesScrollArea.scrollBy()
      messagesScrollArea.scrollTo({
        top: messagesScrollArea.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <JoinUserDialog
        open={!user}
        onJoin={handleUserJoin}
      />

      <header className="grid items-center h-12 grid-cols-3 px-6 text-sm font-bold border-b bg-muted/50">
        <p className="col-start-2 text-center">
          Chat App {user ? <>- {user.name}</> : null}
        </p>
        {user ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="justify-self-end"
            onClick={() => {
              sessionStorage.removeItem(USER_SESSION_KEY)
              location.reload()
            }}
          >
            Log out
          </Button>
        ) : null}
      </header>

      <ScrollArea
        viewportRef={messagesScrollAreaRef}
        className="flex-grow p-6"
      >
        <ol className="grid flex-col w-full gap-6">
          {messages.map((message) => (
            <li key={message.id} className="grid">
              <ChatMessage {...message} activeUser={user} />
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
              required
            />
          </div>
          <footer className="flex items-center self-end gap-6">
            {uploadedMedia ? (
              <Badge variant="secondary">
                {uploadedMedia.name}
              </Badge>
            ) : null}
            <Button type="submit" className="self-end px-8">
              Send
            </Button>
          </footer>
        </fieldset>
      </form>
    </div>
  )
}
