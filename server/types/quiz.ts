import { z } from "zod"
import { questionSchema } from "./question"

export const quizSchema = z.object({
	title: z.string(),
	fileLocation: z.string(),
	questions: z
		.array(questionSchema)
		.nonempty({ message: "Musisz podać przynajmniej jedno pytanie" }),
})

export type Quiz = z.infer<typeof quizSchema>
