import { Question } from "../../types/question"
import { falseAnswer, trueAnswer } from "./answer.js"

export const question: Question = {
	title: "question title",
	type: "TEXT",
	fileLocation: null,
	answers: [
		structuredClone(trueAnswer),
		structuredClone(falseAnswer),
		structuredClone(falseAnswer),
	],
}

export const imageQuestion = (fileLocation: string) => ({
	title: "question title",
	type: "IMAGE",
	fileLocation,
	answers: [
		structuredClone(trueAnswer),
		structuredClone(falseAnswer),
		structuredClone(falseAnswer),
	],
})
