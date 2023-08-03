import { answerSchema } from "./answer.js"
import { z } from "zod"

export const questionTypeEnum = ["TEXT", "IMAGE", "AUDIO"] as const

export const questionSchema = z.object({
	_id: z.string(),
	title: z.string(),
	type: z.enum(["TEXT", "IMAGE", "AUDIO"]),
	fileDescription: z.string().optional(),
	fileLocation: z.string().nullish().catch(undefined),
	answers: z
		.array(answerSchema)
})

export type Question = z.infer<typeof questionSchema>
