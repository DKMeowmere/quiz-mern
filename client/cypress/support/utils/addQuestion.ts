/// <reference types="cypress"/>

export function addQuestion() {
	//to run this function, make sure the quiz creation or update page is open
	cy.getBySel("add-question-btn").click()

	cy.getBySel("question-title-input").type("question title")
}
