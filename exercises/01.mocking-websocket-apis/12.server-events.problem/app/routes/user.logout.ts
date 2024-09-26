import { redirect } from '@remix-run/node'
import { activeUserCookie } from './user.join'

export async function action() {
  return redirect('/', {
    headers: {
      'set-cookie': await activeUserCookie.serialize(null, {
        expires: new Date(),
      }),
    },
  })
}
