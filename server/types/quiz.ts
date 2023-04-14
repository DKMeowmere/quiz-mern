import { z } from "zod"
import { questionSchema } from "./question"

export const quizSchema = z.object({
	_id: z.string().nullish(),
	title: z.string(),
	fileLocation: z.string().nullish().catch(undefined),
	questions: z
		.array(questionSchema)
		.nonempty({ message: "Musisz podać przynajmniej jedno pytanie" }),
})

export type Quiz = z.infer<typeof quizSchema>
