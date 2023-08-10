import { z } from "zod"

export const answerTypeEnum = ["TEXT", "IMAGE", "AUDIO"] as const
export const answerTypeSet = new Set(answerTypeEnum)

export const answerSchema = z.object({
	_id: z.string().nullish(),
	title: z.string(),
	type: z.enum(answerTypeEnum),
	fileLocation: z.string().nullable().catch(null),
	isTrue: z.boolean(),
})

export type Answer = z.infer<typeof answerSchema>
export type Answers = Answer[]
