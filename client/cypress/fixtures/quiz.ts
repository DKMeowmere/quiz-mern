import { Answer } from "@backend/types/answer"
import { Question } from "@backend/types/question"
import { Quiz } from "@backend/types/quiz"

export const trueAnswer: Answer = {
	title: "answer title",
	type: "TEXT",
	isTrue: true,
	fileLocation: null,
}

export const falseAnswer: Answer = {
	title: "answer title",
	type: "TEXT",
	isTrue: true,
	fileLocation: null,
}

export const question: Question = {
	title: "quiz title",
	type: "TEXT",
	answers: [
		structuredClone(trueAnswer),
		structuredClone(falseAnswer),
		structuredClone(falseAnswer),
	],
	fileLocation: null,
}

export const quiz: Omit<Quiz, "_id" | "fileLocation" | "creatorId"> = {
	title: "quiz title",
	description: "quiz description",
	questions: [
		structuredClone(question),
		structuredClone(question),
		structuredClone(question),
	],
}
