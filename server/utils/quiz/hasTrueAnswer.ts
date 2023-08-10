import { Answers } from "../../types/answer.js"

export default function hasTrueAnswer(answers: Answers) {
	for (let i = 0; i < answers.length; i++) {
		if (answers[i].isTrue) {
			return true
		}
	}

	return false
}
