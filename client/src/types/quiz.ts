import { z } from "zod"
import { questionSchema } from "./question.js"

export const quizSchema = z.object({
	_id: z.string(),
	title: z.string(),
	fileLocation: z.string().nullish().catch(undefined),
	questions: z
		.array(questionSchema)
		.nonempty({ message: "Musisz podać przynajmniej jedno pytanie" }),
	creatorId: z.string().catch("unknown"),
})

export type Quiz = z.infer<typeof quizSchema>
