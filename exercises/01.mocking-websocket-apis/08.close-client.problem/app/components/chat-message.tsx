import * as React from 'react'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { cn } from '~/lib/utils'

export interface User {
  id: string
  name: string
  avatarUrl: string
}

export interface ChatMessage {
  id: string
  author: User
  text: string
  sentAt: number
  media?: {
    base64Url: string
    altText: string
  }
}

export interface ChatMessageProps extends ChatMessage {
  activeUser: User
}

export function ChatMessage({
  author,
  activeUser,
  text,
  sentAt,
  media,
}: ChatMessageProps) {
  const type =
    activeUser.id && author.id === activeUser.id
      ? 'outgoing'
      : 'incoming'

  const sentLabel = React.useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short',
    }).format(sentAt)
  }, [sentAt])

  return (
    <article
      className={cn(
        'max-w-[50%]',
        type === 'outgoing' && 'justify-self-end',
      )}
    >
      {media ? (
        <img
          src={media.base64Url}
          alt={media.altText}
          className="mb-4 rounded-xl"
        />
      ) : null}
      <div
        className={cn(
          'flex gap-4',
          type === 'outgoing' && 'justify-end',
        )}
      >
        <Avatar
          className={cn(type === 'outgoing' && 'order-1')}
        >
          <AvatarImage
            src={author.avatarUrl}
            alt={author.name}
          />
        </Avatar>
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              'chat-bubble px-3 py-2 rounded-xl text-white',
              type === 'outgoing'
                ? 'chat-bubble-outgoing bg-blue-500'
                : 'bg-green-500',
            )}
          >
            <p
              className={cn(
                'my-1 text-xs font-bold text-white',
              )}
            >
              {author.name}
            </p>
            <p>{text}</p>
          </div>
          <p
            className={cn(
              'text-xs text-primary/40',
              type === 'outgoing'
                ? 'pr-3 text-right'
                : 'pl-3',
            )}
          >
            {sentLabel}
          </p>
        </div>
      </div>
    </article>
  )
}
