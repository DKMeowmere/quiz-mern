import { answerSchema } from "./answer.js"
import { z } from "zod"

export const questionTypeEnum = ["TEXT", "IMAGE", "AUDIO"] as const

export const questionSchema = z.object({
	_id: z.string().nullish(),
	title: z.string(),
	type: z.enum(["TEXT", "IMAGE", "AUDIO"]),
	fileDescription: z.string().optional(),
	fileLocation: z.string().nullish().catch(undefined),
	answers: z
		.array(answerSchema)
		.nonempty({ message: "Musisz podać przynajmniej 2 odpowiedzi w pytaniu" })
		.max(4, { message: "Pytanie może składać się z maksymalnie 4 odpowiedzi" }),
})

export type Question = z.infer<typeof questionSchema>
