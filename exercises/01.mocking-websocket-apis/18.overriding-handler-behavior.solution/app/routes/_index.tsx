import type { MetaFunction } from '@remix-run/node'
import { useRouteLoaderData } from '@remix-run/react'
import { ChatMessage } from '~/components/chat-message'
import { JoinUserDialog } from '~/components/join-user-dialog'
import type { loader } from '~/root'
import { Chat } from '~/components/chat'

export interface ChatMessagePayload {
  type: 'message'
  data: ChatMessage
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Chat App' },
    {
      name: 'description',
      content:
        'Chat App using Remix, WebSockets, and MSW',
    },
  ]
}

export default function Homepage() {
  const { user } =
    useRouteLoaderData<typeof loader>('root') ||
    {}

  if (!user) {
    return <JoinUserDialog open={true} />
  }

  return <Chat user={user} />
}
