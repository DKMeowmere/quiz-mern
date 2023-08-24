import { Quiz as QuizType } from "../../types/quiz"
import { question } from "./question"

export const quizPayload: QuizType = {
	title: "quiz title",
	creatorId: "no id",
	fileLocation: null,
	questions: [structuredClone(question), structuredClone(question)],
}
