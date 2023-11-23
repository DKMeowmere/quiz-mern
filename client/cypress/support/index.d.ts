declare namespace Cypress {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface Chainable<Subject = any> {
		getBySel(
			dataTestAttribute: string,
			args?: any
		): Chainable<JQuery<HTMLElement>>
		getBySelLike(
			dataTestPrefixAttribute: string,
			args?: any
		): Chainable<JQuery<HTMLElement>>
		serverRequest(
			url: string,
			options: Cypress.RequestBody = {}
		): Cypress.Chainable<any>
		store(): Cypress.Chainable<any>
		dispatch(...args: any[]): void
		createAccount(
			user: Omit<
				import("../../../server/types/client/types/user").User,
				"userQuizes" | "_id"
			>
		): void
		createQuiz(): void
		createFullQuiz(): void
		getQuizGameState(): Chainable<any>
		getQuiz(): Chainable<any>
		addQuestion(): void
		addFullQuestion(): void
		getQuestion(questionIndex: number): Chainable<any>
		addAnswer(): void
		getAnswer(questionIndex: number, answerIndex: number): Chainable<any>

    getUser(): Chainable<any>
	}
}
