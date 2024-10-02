import { z } from 'zod'
import { WebSocketData } from 'msw'

const chatMessageSchema = z.object({
  type: z.literal('message'),
  data: z.object({
    id: z.string(),
    author: z.object({
      id: z.string(),
      name: z.string(),
      avatarUrl: z.string(),
    }),
    text: z.string(),
    sentAt: z.number(),
    media: z.any(),
  }),
})

export function parseChatMessage(
  data: WebSocketData,
) {
  if (typeof data !== 'string') {
    return
  }

  const message = JSON.parse(data)
  const result =
    chatMessageSchema.safeParse(message)

  if (result.error) {
    return
  }

  return result.data
}

export function createChatMessage(
  input: Partial<
    z.infer<typeof chatMessageSchema>
  >,
) {
  chatMessageSchema.parse(input)
  return JSON.stringify(input)
}
