import { z } from "zod"
import { QuestionClientSchema, questionSchema } from "./question.js"

export const quizOnlySchema = z.object({
	_id: z.string().nullish(),
	title: z
		.string()
		.min(4, { message: "Tytuł musi składać się minimum z 4 znaków" }),
	description: z.string().default("").catch(""),
	fileLocation: z.string().nullish().catch(undefined),
	creatorId: z.string().catch("unknown"),
})

export const quizSchema = quizOnlySchema.extend({
	questions: z
		.array(questionSchema)
		.nonempty({ message: "Musisz podać przynajmniej jedno pytanie" }),
})

export const quizClientSchema = quizSchema.extend({
	_id: z.string(),
	originalFileName: z.string().optional().catch(undefined),
	questions: z
		.array(QuestionClientSchema)
		.min(1, { message: "Musisz podać przynajmniej jedno pytanie" }),
	createdAt: z.date().or(z.string()).optional(),
	updatedAt: z.date().or(z.string()).optional(),
})

export type Quiz = z.infer<typeof quizSchema>
export type Quizes = Quiz[]
export type QuizClient = z.infer<typeof quizClientSchema>
export type QuizesClient = QuizClient[]
