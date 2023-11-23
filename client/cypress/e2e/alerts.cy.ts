import { dequeueAlert, enqueueAlert } from "../../src/app/features/alertSlice"

describe("alerts", () => {
	it("should add and remove alerts properly", () => {
		cy.visit("/")

		cy.dispatch(enqueueAlert({ body: "info alert", type: "INFO" }))
		cy.dispatch(enqueueAlert({ body: "error alert", type: "ERROR" }))
		cy.dispatch(enqueueAlert({ body: "warning alert", type: "WARNING" }))
		cy.dispatch(enqueueAlert({ body: "success alert", type: "SUCCESS" }))

		cy.store().its("alert").its("alertsQueue").should("have.length", 4)

		cy.getBySel("alert").contains("info alert")

		cy.dispatch(dequeueAlert())
		cy.dispatch(dequeueAlert())
		cy.dispatch(dequeueAlert())
		cy.dispatch(dequeueAlert())

		cy.store().its("alert").its("alertsQueue").should("have.length", 0)
	})
})
