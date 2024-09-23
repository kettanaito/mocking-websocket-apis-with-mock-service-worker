import * as React from 'react'
import type {
  LinksFunction,
  LoaderFunctionArgs,
} from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { User } from './components/chat-message'
import { Toaster } from '~/components/ui/sonner'
import stylesUrl from '~/tailwind.css?url'
import { activeUserCookie } from '~/routes/user.join'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl,
    },
  ]
}

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const user: User = await activeUserCookie.parse(
    request.headers.get('cookie'),
  )

  return {
    user,
  }
}

export function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
