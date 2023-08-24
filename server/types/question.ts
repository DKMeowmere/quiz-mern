import { answerSchema } from "./answer.js"
import { z } from "zod"

export const questionTypeEnum = ["TEXT", "IMAGE", "AUDIO"] as const
export const questionTypeSet = new Set(questionTypeEnum)

export const questionSchema = z.object({
	_id: z.string().nullish(),
	title: z.string(),
	type: z.enum(["TEXT", "IMAGE", "AUDIO"]),
	fileLocation: z.string().nullable().catch(null),
	answers: z
		.array(answerSchema)
		.min(2, { message: "Musisz podać przynajmniej 2 odpowiedzi w pytaniu" })
		.max(4, { message: "Pytanie może składać się z maksymalnie 4 odpowiedzi" }),
})

export type Question = z.infer<typeof questionSchema>
