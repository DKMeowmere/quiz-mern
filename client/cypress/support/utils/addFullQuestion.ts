import { addAnswer } from "./addAnswer"
import { addQuestion } from "./addQuestion"

export function addFullQuestion() {
	addQuestion()
	addAnswer()
	addAnswer()

  cy.getBySel("close-question-modal-btn").click()
}
