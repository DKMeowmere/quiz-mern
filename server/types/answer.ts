import { z } from "zod"

export const answerTypeEnum = ["TEXT", "IMAGE", "AUDIO"] as const

export const answerSchema = z.object({
  title: z.string(),
  type: z.enum(answerTypeEnum),
  fileLocation: z.string().optional(),
  isTrue: z.boolean()
})


export type Answer = z.infer<typeof answerSchema>