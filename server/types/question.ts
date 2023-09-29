import { z } from "zod"
import hasTrueAnswer from "../utils/quiz/hasTrueAnswer.js"
import { answerSchema, AnswerClientSchema } from "./answer.js"

export const questionTypeEnum = ["TEXT", "IMAGE", "AUDIO"] as const
export const questionTypeSet = new Set(questionTypeEnum)

export const questionSchema = z
	.object({
		_id: z.string().nullish(),
		title: z
			.string()
			.min(4, { message: "Tytuł pytania musi składać się minimum z 4 znaków" }),
		type: z.enum(questionTypeEnum),
		fileLocation: z.string().nullable().catch(null),
		answers: z
			.array(answerSchema)
			.min(2, { message: "Musisz podać przynajmniej 2 odpowiedzi w pytaniu" })
			.max(4, {
				message: "Pytanie może składać się z maksymalnie 4 odpowiedzi",
			}),
	})
	.refine(question => hasTrueAnswer(question.answers), {
		message: "Pytanie musi zawierać przynajmniej jedną poprawną odpowiedź",
	})

//cant use extend while using refine
export const QuestionClientSchema = z
	.object({
		_id: z.string(),
		title: z
			.string()
			.min(4, { message: "Tytuł pytania musi składać się minimum z 4 znaków" }),
		type: z.enum(questionTypeEnum),
		originalFileName: z.string().optional().catch(undefined),
		fileLocation: z.string().nullable().catch(null),
		answers: z
			.array(AnswerClientSchema)
			.min(2, { message: "Musisz podać przynajmniej 2 odpowiedzi w pytaniu" })
			.max(4, {
				message: "Pytanie może składać się z maksymalnie 4 odpowiedzi",
			}),
	})
	.refine(question => hasTrueAnswer(question.answers), {
		message: "Pytanie musi zawierać przynajmniej jedną poprawną odpowiedź",
	})

export type QuestionType = "TEXT" | "IMAGE" | "AUDIO"
export type Question = z.infer<typeof questionSchema>
export type Questions = Question[]
export type QuestionClient = z.infer<typeof QuestionClientSchema>
export type QuestionsClient = QuestionClient[]
