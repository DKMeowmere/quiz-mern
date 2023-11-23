/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

import { addAnswer } from "./utils/addAnswer"
import { addFullQuestion } from "./utils/addFullQuestion"
import { addQuestion } from "./utils/addQuestion"
import { createAccount } from "./utils/createAccount"
import { createFullQuiz } from "./utils/createFullQuiz"
import { createQuiz } from "./utils/createQuiz"

Cypress.Commands.add("getBySel", (selector, ...args) => {
	return cy.get(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
	return cy.get(`[data-cy*=${selector}]`, ...args)
})

Cypress.Commands.add("serverRequest", (url, options) =>
	cy.request({
		url: `${Cypress.env("SERVER_URL")}${url}`,
		...(options as Record<string, unknown>),
	})
)

Cypress.Commands.add("store", () => cy.window().its("store").invoke("getState"))
Cypress.Commands.add("dispatch", (...args) =>
	cy
		.window()
		.its("store")
		.invoke("dispatch", ...args)
)

Cypress.Commands.add("createAccount", createAccount)

Cypress.Commands.add("createQuiz", createQuiz)
Cypress.Commands.add("createFullQuiz", createFullQuiz)
Cypress.Commands.add("getQuizGameState", () => cy.store().its("quizGame"))
Cypress.Commands.add("getQuiz", () => cy.getQuizGameState().its("quiz"))

Cypress.Commands.add("addQuestion", addQuestion)
Cypress.Commands.add("addFullQuestion", addFullQuestion)
Cypress.Commands.add("getQuestion", questionIndex =>
	cy.getQuiz().its("questions").its(questionIndex)
)

Cypress.Commands.add("addAnswer", addAnswer)
Cypress.Commands.add("getAnswer", (questionIndex, answerIndex) =>
	cy.getQuestion(questionIndex).its("answers").its(answerIndex)
)

Cypress.Commands.add("getUser", () => cy.store().its("app").its("user"))
