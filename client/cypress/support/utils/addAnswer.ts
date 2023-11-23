/// <reference types="cypress"/>

export function addAnswer() {
	//to run this function, make sure the quiz creation or update page and question modal is open

	cy.getBySel("add-answer-btn").click()
	cy.getBySel("answer-title-input").eq(-1).type("answer title")
}
