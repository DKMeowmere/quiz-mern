import { addFullQuestion } from "./addFullQuestion"
import { createQuiz } from "./createQuiz"

export function createFullQuiz() {
	createQuiz()
	addFullQuestion()
}
