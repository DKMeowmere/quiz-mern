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
		serverRequest(url: string): Cypress.Chainable<any>
		createAccount(
			user: Omit<
				import("../../../server/types/client/types/user").User,
				"userQuizes" | "_id"
			>
		): void
		deleteAccount(): void
	}
}
