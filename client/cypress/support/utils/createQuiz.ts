/// <reference types="cypress" />

import { quiz } from "../../fixtures/quiz"
import { user } from "../../fixtures/user"

export function createQuiz() {
	cy.createAccount(user)

	cy.visit("/quiz/create")
	cy.getBySel("quiz-title-input").type(quiz.title)
	cy.getBySel("quiz-description-input").type(quiz.description)
	cy.getBySel("quiz-main-image-input").selectFile(
		"cypress/fixtures/files/hercegBosna.png"
	)
}
