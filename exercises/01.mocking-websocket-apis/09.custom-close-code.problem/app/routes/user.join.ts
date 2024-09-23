import {
  ActionFunctionArgs,
  createCookie,
  redirect,
} from '@remix-run/node'
import { z } from 'zod'
import type { User } from '~/components/chat-message'

export const activeUserCookie = createCookie('activeUser')

export async function action({
  request,
}: ActionFunctionArgs) {
  const data = await request.formData()
  const id = z.string().parse(data.get('id'))
  const name = z.string().parse(data.get('name'))
  const avatarUrl = z.string().parse(data.get('avatarUrl'))

  const user = {
    id,
    name,
    avatarUrl,
  } satisfies User

  return redirect('/', {
    headers: {
      'set-cookie': await activeUserCookie.serialize(user),
    },
  })
}
