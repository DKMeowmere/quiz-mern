import { user } from "../fixtures/user"

context("quiz", () => {
	describe("quiz form", () => {
		//create form
		describe("given the quiz info", () => {
			it("should update quiz title and create a url containing the file", () => {
				cy.createAccount(user)

				cy.visit("/quiz/create")
				cy.getBySel("quiz-title-input").type("quiz title")
				cy.getBySel("quiz-description-input").type("quiz description")
				cy.getBySel("quiz-main-image-input").selectFile(
					"cypress/fixtures/files/hercegBosna.png"
				)

				cy.getQuiz().its("title").should("equal", "quiz title")
				cy.getQuiz().its("description").should("equal", "quiz description")
				cy.getQuiz().its("fileLocation").should("be.a", "string")
			})
		})

		describe("given the question info", () => {
			it("should edit question title, type and create a url containing the file", () => {
				cy.createQuiz()

				cy.getBySel("add-question-btn").click()
				cy.getBySel("question-title-input").type("question title")

				cy.getQuestion(0).its("title").should("equal", "question title")

				cy.getBySel("toggle-question-type-to-audio-btn").click()

				cy.store().getQuestion(0).its("type").should("equal", "AUDIO")

				cy.getBySel("toggle-question-type-to-image-btn").click()

				cy.getQuestion(0).its("type").should("equal", "IMAGE")

				cy.getBySel("question-file-input").selectFile(
					"cypress/fixtures/files/hercegBosna.png"
				)

				cy.getQuestion(0).its("fileLocation").should("be.a", "string")

				cy.getBySel("close-question-modal-btn").click()

				cy.getBySel("question-modal").should("not.exist")

				cy.getQuiz().its("questions").should("have.length", 1)
			})
		})

		describe("given the question info", () => {
			it("should create a question, close the modal, open the question, then delete it", () => {
				cy.createQuiz()
				cy.addQuestion()

				cy.getBySel("close-modal-btn").click()
				cy.getBySel("open-question-btn").click()
				cy.getBySel("remove-question-btn").click()

				cy.getQuiz().its("questions").should("have.length", 0)
			})
		})

		describe("given the answers info", () => {
			it("should create answers, edit title and type, change their truthfulness, create a urls containing a file", () => {
				cy.createQuiz()
				cy.addQuestion()

				cy.getBySel("add-answer-btn").click()

				cy.getBySel("answer-title-input").type("answer title")
				cy.getAnswer(0, 0).its("title").should("equal", "answer title")

				//the truth ot the answer should be set to true by default
				cy.getAnswer(0, 0).its("isTrue").should("be.true")
				cy.getBySel("answer-toggle-is-true-btn").click()
				cy.getAnswer(0, 0).its("isTrue").should("not.be.true")
				cy.getBySel("answer-toggle-is-true-btn").click()
				cy.getAnswer(0, 0).its("isTrue").should("be.true")

				cy.getBySel("toggle-answer-type-to-image-btn").click()
				cy.getAnswer(0, 0).its("type").should("equal", "IMAGE")
				cy.getBySel("toggle-answer-type-to-image-btn").click()
				cy.getAnswer(0, 0).its("type").should("equal", "TEXT")
				cy.getBySel("toggle-answer-type-to-audio-btn").click()
				cy.getAnswer(0, 0).its("type").should("equal", "AUDIO")
				cy.getBySel("answer-file-input").selectFile(
					"cypress/fixtures/files/windowsShutdown.mp3"
				)
				cy.getAnswer(0, 0).its("fileLocation").should("be.a", "string")

				cy.addAnswer()
				//only the first answer should be true by default
				cy.getAnswer(0, 1).its("isTrue").should("not.be.true")
				cy.getBySel("toggle-answer-type-to-image-btn").eq(1).click()
				cy.getAnswer(0, 1).its("type").should("equal", "IMAGE")
				cy.getBySel("answer-file-input")
					.eq(1)
					.selectFile("cypress/fixtures/files/hercegBosna.png")
				cy.getAnswer(0, 1).its("fileLocation").should("be.a", "string")
			})
		})

		describe("given the full quiz info", () => {
			it("should create quiz on server, then deletes it", () => {
				cy.createFullQuiz()
				cy.getBySel("submit-quiz-creation").click()

				cy.wait(1000)
				cy.getQuiz()
					.its("_id")
					.then(id => {
						cy.serverRequest(`/api/quiz/${id}`).then(res => {
							expect(res.status).to.equal(200)
							expect(res.body.title).to.equal("quiz title")
						})

						cy.visit(`/quiz/${id}/edit`)
						cy.getBySel("delete-quiz-btn").click()

						cy.wait(1000)
						cy.serverRequest(`/api/quiz/${id}`, {
							failOnStatusCode: false,
						}).then(res => {
							expect(res.status).to.equal(404)
						})
					})
			})
		})

		//update form
		describe("given the full quiz info", () => {
			it("should create quiz and then update its properties", () => {
				cy.createFullQuiz()
				cy.getBySel("submit-quiz-creation").click()

				cy.wait(1000)
				cy.url().then(url => {
					cy.visit(`${url}/edit`)
				})

				cy.getBySel("quiz-title-input").clear().type("updated title")
				cy.getBySel("quiz-description-input")
					.clear()
					.type("updated description")
				cy.getBySel("quiz-main-image-input").selectFile(
					"cypress/fixtures/files/rsFlag.png"
				)
				cy.addFullQuestion()

				cy.getQuiz().its("questions").should("have.length", 2)
				cy.getBySel("delete-question-btn").eq(0).click()
				cy.getQuiz().its("questions").should("have.length", 1)

				cy.getBySel("submit-quiz-update").click()

				cy.reload()
				cy.wait(1000)

				cy.getQuiz().its("title").should("equal", "updated title")
				cy.getQuiz().its("description").should("equal", "updated description")
				cy.getQuiz().its("fileLocation").should("be.a", "string")
			})
		})

		describe("given the full quiz info", () => {
			it("should create quiz and then delete it", () => {
				cy.createFullQuiz()
				cy.getBySel("submit-quiz-creation").click()

				cy.wait(1000)
				cy.url().then(url => {
					cy.visit(`${url}/edit`)
				})

				cy.getQuiz()
					.its("_id")
					.then(id => {
						cy.getBySel("delete-quiz-btn").click()

						cy.wait(1000)
						cy.serverRequest(`/api/quiz/${id}`, {
							failOnStatusCode: false,
						}).then(res => {
							expect(res.status).to.equal(404)
						})
					})
			})
		})
	})
	describe("quiz game", () => {
		describe("given the quiz info", () => {
			it("should create quiz, then solve quiz and ensure state is updated correctly", () => {
				cy.createFullQuiz()
				cy.addFullQuestion()
				cy.getBySel("submit-quiz-creation").click()
				cy.wait(1000)

				//should redirect to quiz page
				cy.getQuiz()
					.its("_id")
					.then(id => {
						cy.url().should("contain", `quiz/${id}`)
					})

				cy.getQuizGameState().its("timer").should("equal", 0)
				cy.getQuizGameState().its("userPoints").should("equal", 0)
				cy.getQuizGameState().its("currentQuestionIndex").should("equal", 0)
				cy.getQuizGameState().its("isGameStarted").should("be.false")
				cy.getQuizGameState().its("isGameEnded").should("be.false")
				cy.getQuizGameState().its("answeredQuestions").should("be.empty")

				cy.getBySel("start-game-btn").click()

				cy.getQuizGameState().its("isGameStarted").should("be.true")

				cy.getBySel("select-answer-true-btn").click()
				cy.getBySel("submit-answer-btn").click()

				cy.getQuizGameState().its("userPoints").should("equal", 1)
				cy.getQuizGameState().its("currentQuestionIndex").should("equal", 1)
				cy.getQuizGameState().its("answeredQuestions").should("have.length", 1)

				cy.getBySel("select-answer-false-btn").click()
				cy.getBySel("submit-answer-btn").click()

				cy.getQuizGameState().its("userPoints").should("equal", 1)
				cy.getQuizGameState().its("currentQuestionIndex").should("equal", 2)
				cy.getQuizGameState().its("answeredQuestions").should("have.length", 2)
				cy.getQuizGameState().its("isGameStarted").should("be.false")
				cy.getQuizGameState().its("isGameEnded").should("be.true")

				cy.getBySel("reset-btn").click()
				cy.getQuizGameState().its("timer").should("equal", 0)
				cy.getQuizGameState().its("userPoints").should("equal", 0)
				cy.getQuizGameState().its("currentQuestionIndex").should("equal", 0)
				cy.getQuizGameState().its("isGameStarted").should("be.false")
				cy.getQuizGameState().its("isGameEnded").should("be.false")
				cy.getQuizGameState().its("answeredQuestions").should("be.empty")
			})
		})
	})
})
