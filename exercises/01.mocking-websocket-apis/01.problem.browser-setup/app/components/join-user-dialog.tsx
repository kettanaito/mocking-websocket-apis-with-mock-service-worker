import * as React from 'react'
import { faker } from '@faker-js/faker'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from '~/components/ui/alert-dialog'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import type { User } from '~/components/chat-message'

interface JoinUserDialogProps {
  open?: boolean
  onJoin: (user: User) => void
}

export function JoinUserDialog({ open, onJoin }: JoinUserDialogProps) {
  const [name, setName] = React.useState<string>('')
  const [avatarUrl, setAvatarUrl] = React.useState<string>('')

  const randomizeInputs = () => {
    const avatarIndex = faker.number.int({ min: 1, max: 8 })
    setName(faker.person.firstName(avatarIndex <= 4 ? 'male' : 'female'))
    setAvatarUrl(`/avatars/${avatarIndex}.jpg`)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const name = fields.get('name') as string
    const userId = Math.random().toString(36).slice(2)

    onJoin({
      id: userId,
      name,
      avatarUrl,
    })
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a user</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex items-center gap-6 mb-4">
            <Avatar className="bg-slate-800 size-14">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                <UserCircleIcon className="size-[32px] stroke-slate-500" />
              </AvatarFallback>
            </Avatar>
            <Input
              name="name"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              required
            />
          </fieldset>
          <AlertDialogFooter className="flex gap-2">
            <Button variant="outline" type="button" onClick={randomizeInputs}>
              Randomize
            </Button>
            <AlertDialogAction type="submit">Join chat</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
