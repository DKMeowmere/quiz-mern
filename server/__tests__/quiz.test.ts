import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import request from "supertest"
import path from "path"
import {
	describe,
	it,
	beforeAll,
	beforeEach,
	afterAll,
	expect,
} from "@jest/globals"
import { questionSchema } from "../types/question"
import { answerSchema } from "../types/answer"
import { Quiz as QuizType, quizSchema } from "../types/quiz"
import { Quiz } from "../models/quiz"
import { User } from "../models/user"
import { createServer } from "../utils/createServer"
import { doFileExists } from "../utils/doFileExists"
import { createToken } from "../utils/createToken"
import { quizPayload } from "./fixtures/quiz"
import { userPayload } from "./fixtures/user"
import {
	imageQuestion as imageQuestionPayload,
	question as questionPayload,
} from "./fixtures/question"
import {
	falseAnswer as falseAnswerPayload,
	trueAnswer as trueAnswerPayload,
} from "./fixtures/answer"

const app = createServer()
let token: string

describe("QUIZ /api/quiz", () => {
	beforeAll(async () => {
		const mongodb = await MongoMemoryServer.create()
		const dbUri = mongodb.getUri()
		await mongoose.connect(dbUri)
	})
	beforeEach(async () => {
		await request(app).get("/reset")
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await mongoose.connection.close()
	})

	describe("GET /:id getQuiz", () => {
		describe("given the invalid id", () => {
			it("should return 400", async () => {
				const id = "invalid id"
				const { statusCode } = await request(app).get(`/api/quiz/${id}`)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the id of non existing quiz", () => {
			it("should return 404", async () => {
				const id = "64387d35aca9a0c4a719b0cc"
				const { statusCode } = await request(app).get(`/api/quiz/${id}`)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the quiz with text questions and answers", () => {
			it("should return 200 and quiz data", async () => {
				const quiz = await Quiz.create(quizPayload)
				const { statusCode, body } = await request(app).get(
					`/api/quiz/${quiz._id}`
				)

				const { success } = quizSchema.safeParse(body)
				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
			})
		})
	})

	describe("GET /  getQuizes", () => {
		beforeEach(async () => {
			await Quiz.insertMany([quizPayload, quizPayload, quizPayload])
		})

		describe("given the 3 documents", () => {
			it("should return 200 and array of 3 documents", async () => {
				const { body, statusCode } = await request(app).get("/api/quiz")
				expect(statusCode).toBe(200)
				expect(body).toHaveLength(3)
			})
		})

		describe("given the 3 documents with limit 2", () => {
			it("should return 200 and array of 2 documents", async () => {
				const { body, statusCode } = await request(app).get("/api/quiz?limit=2")
				expect(statusCode).toBe(200)
				expect(body).toHaveLength(2)
			})
		})
	})

	describe("POST / createQuiz", () => {
		beforeEach(async () => {
			const user = await User.create(userPayload)

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`
		})
		describe("given the valid quiz payload", () => {
			it("should return 201 and quiz", async () => {
				const { body, statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", quizPayload.title)
					.field("description", quizPayload.description)
					.field("questions", JSON.stringify(quizPayload.questions))
					.field("fileLocation", "rsFlag.png")
					.attach("files", "__tests__/fixtures/files/rsFlag.png")

				const { success } = quizSchema.safeParse(body)
				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				expect(body.creatorId).toBe(userPayload._id)
				const absolutePath = `./static/uploads/quiz/${body._id}.png`
				expect(doFileExists(path.resolve(absolutePath))).toBeTruthy()
			})
		})
		describe("given the quiz payload with file with forbidden extension", () => {
			it("should return 201 and set main file location to quizDefault.jpg", async () => {
				const quiz = structuredClone(quizPayload)

				const { statusCode, body } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", quiz.title)
					.field("questions", JSON.stringify(quiz.questions))
					.field("fileLocation", "windowsShutdown.mp3")
					.attach("files", "__tests__/fixtures/files/windowsShutdown.mp3")

				const { success } = quizSchema.safeParse(body)
				expect(statusCode).toBe(201)
				expect(body.fileLocation).toContain("defaultQuiz.jpg")
				expect(success).toBeTruthy()
			})
		})
		describe("given the quiz payload with question and answer file", () => {
			it("should return 201, quiz and rename files", async () => {
				const quiz = structuredClone(quizPayload)
				quiz.fileLocation = "rsFlag.png"
				quiz.questions[1].type = "IMAGE"
				quiz.questions[1].fileLocation = "hercegBosna.png"
				quiz.questions[0].answers[1].type = "IMAGE"
				quiz.questions[0].answers[1].fileLocation = "krajinaFlag.png"
				quiz.questions[1].answers[1].type = "IMAGE"
				quiz.questions[1].answers[1].fileLocation = "bosanskaZastava.png"

				const { body, statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", quiz.title)
					.field("questions", JSON.stringify(quiz.questions))
					.field("fileLocation", "rsFlag.png")
					.attach("files", "__tests__/fixtures/files/rsFlag.png")
					.attach("files", "__tests__/fixtures/files/hercegBosna.png")
					.attach("files", "__tests__/fixtures/files/krajinaFlag.png")
					.attach("files", "__tests__/fixtures/files/bosanskaZastava.png")

				const { success } = quizSchema.safeParse(body)

				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				expect(body.creatorId).toBe(userPayload._id)

				const absolutePaths = [
					`./static/uploads/quiz/${body._id}.png`,
					`./static/uploads/quiz/${body.questions[1]._id}.png`,
					`./static/uploads/quiz/${body.questions[0].answers[1]._id}.png`,
					`./static/uploads/quiz/${body.questions[1].answers[1]._id}.png`,
				]
				absolutePaths.forEach(async absolutePath => {
					expect(await doFileExists(path.resolve(absolutePath))).toBeTruthy()
				})
			})
		})
		describe("given the quiz payload with question file and without answer file", () => {
			it("should return 201, and set answer file location to null", async () => {
				const quiz = structuredClone(quizPayload)
				quiz.fileLocation = "rsFlag.png"
				quiz.questions[1].type = "IMAGE"
				quiz.questions[1].fileLocation = "hercegBosna.png"
				quiz.questions[0].answers[1].type = "IMAGE"
				quiz.questions[0].answers[1].fileLocation = "krajinaFlag"
				quiz.questions[1].answers[1].type = "IMAGE"
				quiz.questions[1].answers[1].fileLocation = "zastavaBosanska.png"

				const { statusCode, body } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", quiz.title)
					.field("questions", JSON.stringify(quiz.questions))
					.field("fileLocation", "rsFlag.png")
					.attach("files", "__tests__/fixtures/files/rsFlag.png")
					.attach("files", "__tests__/fixtures/files/hercegBosna.png")
					.attach("files", "__tests__/fixtures/files/krajinaFlag.png")
				//quiz.questions[1].answers[1] file missinng

				const { success } = quizSchema.safeParse(body)
				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				expect(body.questions[1].answers[1].fileLocation).toBeNull()
			})
		})
		describe("given the quiz payload without main file", () => {
			it("should return 201, and set main file location to quizDefault.jpg", async () => {
				const quiz = structuredClone(quizPayload)
				quiz.fileLocation = "rsFlag.png"

				const { statusCode, body } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", quiz.title)
					.field("questions", JSON.stringify(quiz.questions))
					.field("fileLocation", "rsFlag.png")

				const { success } = quizSchema.safeParse(body)
				expect(statusCode).toBe(201)
				expect(body.fileLocation).toContain("defaultQuiz.jpg")
				expect(success).toBeTruthy()
			})
		})
		describe("given the quiz payload without token", () => {
			it("should return 401", async () => {
				const quiz = structuredClone(quizPayload)
				quiz.fileLocation = "rsFlag.png"

				const { statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.field("title", quiz.title)
					.field("questions", JSON.stringify(quiz.questions))
					.field("fileLocation", "rsFlag.png")

				expect(statusCode).toBe(401)
			})
		})
		describe("given the invalid quiz payload", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("questions", JSON.stringify(quizPayload.questions))
					.field("fileLocation", "rsFlag.png")
					.attach("files", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the quiz payload without questions", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("questions", JSON.stringify(quizPayload.questions))
					.field("fileLocation", "rsFlag.png")
					.attach("files", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the quiz payload with question with only false answers", () => {
			it("should return 400", async () => {
				const question = structuredClone(questionPayload)
				question.answers = [falseAnswerPayload, falseAnswerPayload]

				const { statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("questions", JSON.stringify([question]))
					.field("fileLocation", "rsFlag.png")
					.attach("files", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
	})

	describe("PATCH /:id updateQuiz", () => {
		let quiz: QuizType
		beforeEach(async () => {
			const user = await User.create(userPayload)

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`

			const { body } = await request(app)
				.post("/api/quiz")
				.set("content-type", "multipart/form-data")
				.set("Authorization", token)
				.field("title", quizPayload.title)
				.field("questions", JSON.stringify(quizPayload.questions))
				.field("fileLocation", "rsFlag.png")
				.attach("files", "__tests__/fixtures/files/rsFlag.png")

			quiz = body
		})
		describe("given the quiz payload and file with forbidden extension", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quiz._id}`)
					.set("Authorization", token)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")
					.attach("file", "__tests__/fixtures/files/note.txt")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the quiz payload without token", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quiz._id}`)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")

				expect(statusCode).toBe(401)
			})
		})
		describe("given the quiz payload without title", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quiz._id}`)
					.set("Authorization", token)
					.set("content-type", "multipart/form-data")
					.attach("file", "__tests__/fixtures/files/hercegBosna.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the quiz payload with invalid id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/invalid id`)
					.set("Authorization", token)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")
					.attach("file", "__tests__/fixtures/files/hercegBosna.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the quiz payload with non existing quiz id", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${id}`)
					.set("Authorization", token)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")
					.attach("file", "__tests__/fixtures/files/hercegBosna.png")

				expect(statusCode).toBe(404)
			})
		})
		describe("given the quiz payload with other user token", () => {
			it("should return 403", async () => {
				const user2 = await User.create({
					...userPayload,
					email: "test@403.com",
					_id: undefined,
				})
				const token2 = `Bearer ${createToken(user2)}`

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quiz._id}`)
					.set("Authorization", token2)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")
					.attach("file", "__tests__/fixtures/files/hercegBosna.png")

				expect(statusCode).toBe(403)
			})
		})
		describe("given the quiz payload", () => {
			it("should update quiz, return 200", async () => {
				const { body, statusCode } = await request(app)
					.patch(`/api/quiz/${quiz._id}`)
					.set("Authorization", token)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")
					.field("description", "UPDATED DESCRIPTION")
					.attach("file", "__tests__/fixtures/files/hercegBosna.png")

				const { success } = quizSchema.safeParse(body)
				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(body.title).toBe("UPDATED TITLE")
				expect(body.description).toBe("UPDATED DESCRIPTION")
				expect(
					await doFileExists(path.resolve(`.${body.fileLocation}`))
				).toBeTruthy()
			})
		})
	})

	describe("DELETE /:id deleteQuiz", () => {
		let quiz: QuizType
		beforeEach(async () => {
			const user = await User.create(userPayload)

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`

			const question = structuredClone(questionPayload)
			question.fileLocation = "hercegBosna.png"
			question.type = "IMAGE"
			question.answers[0].fileLocation = "bosanskaZastava.png"
			question.answers[0].type = "IMAGE"

			const { body } = await request(app)
				.post("/api/quiz")
				.set("content-type", "multipart/form-data")
				.set("Authorization", token)
				.field("title", quizPayload.title)
				.field("fileLocation", "rsFlag.png")
				.field("questions", JSON.stringify([question]))
				.attach("files", "__tests__/fixtures/files/rsFlag.png")
				.attach("files", "__tests__/fixtures/files/hercegBosna.png")
				.attach("files", "__tests__/fixtures/files/bosanskaZastava.png")
			quiz = body
		})
		describe("given the quiz id", () => {
			it("should remove quiz and return 200", async () => {
				const data = await request(app)
					.delete(`/api/quiz/${quiz._id}`)
					.set("Authorization", token)

				expect(data.statusCode).toBe(200)
				expect(
					await doFileExists(path.resolve(`.${quiz.fileLocation}`))
				).toBeFalsy()
				expect(
					await doFileExists(path.resolve(`.${quiz.questions[0].fileLocation}`))
				).toBeFalsy()
				expect(
					await doFileExists(
						path.resolve(`.${quiz.questions[0].answers[0].fileLocation}`)
					)
				).toBeFalsy()
			})
		})
		describe("given the quiz id without token", () => {
			it("should remove quiz and return 401", async () => {
				const { statusCode } = await request(app).delete(
					`/api/quiz/${quiz._id}`
				)
				expect(statusCode).toBe(401)
			})
		})
		describe("given the invalid quiz id ", () => {
			it("should remove quiz and return 400", async () => {
				const { statusCode } = await request(app)
					.delete("/api/quiz/invalid id")
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the id of non existing quiz ", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${id}`)
					.set("Authorization", token)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the quiz and other user's token", () => {
			it("should remove quiz and return 403", async () => {
				const user2 = await User.create({
					...userPayload,
					_id: undefined,
					email: `${crypto.randomUUID()}@email.com`,
				})
				const token2 = `Bearer ${createToken(user2)}`
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quiz._id}`)
					.set("Authorization", token2)

				expect(statusCode).toBe(403)
			})
		})
	})

	describe("POST /:id createQuestion", () => {
		let quiz: QuizType
		beforeEach(async () => {
			const user = await User.create(userPayload)

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`

			const { body } = await request(app)
				.post("/api/quiz")
				.set("content-type", "multipart/form-data")
				.set("Authorization", token)
				.field("title", quizPayload.title)
				.field("questions", JSON.stringify(quizPayload.questions))
				.field("fileLocation", "rsFlag.png")
				.attach("files", "__tests__/fixtures/files/rsFlag.png")

			quiz = body
		})
		describe("given the question payload with file with invalid extension", () => {
			it("should return 400, remove file", async () => {
				const imageQuestionClone = structuredClone(
					imageQuestionPayload("note.txt")
				)
				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", imageQuestionClone.title)
					.field("type", imageQuestionClone.type)
					.field("answers", JSON.stringify(questionPayload.answers))
					.field("fileLocation", imageQuestionClone.fileLocation)
					.attach("files", "__tests__/fixtures/files/note.txt")

				expect(statusCode).toBe(400)
				expect(
					await doFileExists(path.resolve("./static/uploads/quiz/note.txt"))
				).toBeFalsy()
			})
		})
		describe("given the question payload without token", () => {
			it("should return 401", async () => {
				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}`)
					.set("content-type", "multipart/form-data")
					.field("title", questionPayload.title)
					.field("type", questionPayload.type)
					.field("answers", JSON.stringify(questionPayload.answers))

				expect(statusCode).toBe(401)
			})
		})
		describe("given the question payload with invalid quiz id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/quiz/INVALID ID")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", questionPayload.title)
					.field("type", questionPayload.type)
					.field("answers", JSON.stringify(questionPayload.answers))

				expect(statusCode).toBe(400)
			})
		})
		describe("given the question payload without title", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("type", questionPayload.type)
					.field("answers", JSON.stringify(questionPayload.answers))

				expect(statusCode).toBe(400)
			})
		})
		describe("given the question payload with only false answers", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", questionPayload.title)
					.field("type", questionPayload.type)
					.field(
						"answers",
						JSON.stringify([falseAnswerPayload, falseAnswerPayload])
					)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the id of not existing quiz", () => {
			it("should return 404", async () => {
				const { statusCode } = await request(app)
					.post(`/api/quiz/${new mongoose.Types.ObjectId()}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", questionPayload.title)
					.field("type", questionPayload.type)
					.field("answers", JSON.stringify(questionPayload.answers))

				expect(statusCode).toBe(404)
			})
		})
		describe("given the question payload and another user's token", () => {
			it("should return 403", async () => {
				const user2 = await User.create({
					...userPayload,
					email: "test@403.com",
					_id: undefined,
				})
				const token2 = `Bearer ${createToken(user2)}`

				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token2)
					.field("title", questionPayload.title)
					.field("type", questionPayload.type)
					.field("answers", JSON.stringify(questionPayload.answers))

				expect(statusCode).toBe(403)
			})
		})
		describe("given the valid question payload", () => {
			it("should return 201, question payload, save files and remove unused files", async () => {
				const answers = structuredClone(questionPayload.answers)
				answers[0].fileLocation = "bosanskaZastava.png"
				answers[0].type = "IMAGE"

				const { statusCode, body: question } = await request(app)
					.post(`/api/quiz/${quiz._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", questionPayload.title)
					.field("type", "IMAGE")
					.field("fileLocation", "rsFlag.png")
					.field("answers", JSON.stringify(answers))
					.attach("files", "__tests__/fixtures/files/rsFlag.png")
					.attach("files", "__tests__/fixtures/files/bosanskaZastava.png")
					.attach("files", "__tests__/fixtures/files/hercegBosna.png")
				//usused hercegBosna.png

				const { success } = questionSchema.safeParse(question)

				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()

				expect(
					await doFileExists(path.resolve(`.${question.fileLocation}`))
				).toBeTruthy()
				expect(
					await doFileExists(
						path.resolve(`.${question.answers[0].fileLocation}`)
					)
				).toBeTruthy()
				expect(
					await doFileExists(
						path.resolve(`./static/uploads/quiz/hercegBosna.png`)
					)
				).toBeFalsy()
			})
		})
	})

	describe("PATCH /:quizId/:questionId updateQuestion", () => {
		let quiz: QuizType
		let quizId = ""
		let imageQuestionId = ""
		let textQuestionId = ""

		beforeEach(async () => {
			const user = await User.create(userPayload)
			const questions = structuredClone([questionPayload, questionPayload])
			questions[0].type = "IMAGE"
			questions[0].fileLocation = "hercegBosna.png"

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`

			const { body } = await request(app)
				.post("/api/quiz")
				.set("content-type", "multipart/form-data")
				.set("Authorization", token)
				.field("title", quizPayload.title)
				.field("questions", JSON.stringify(questions))
				.field("fileLocation", "rsFlag.png")
				.attach("files", "__tests__/fixtures/files/rsFlag.png")
				.attach("files", "__tests__/fixtures/files/hercegBosna.png")

			quiz = body
			quizId = quiz._id!
			imageQuestionId = quiz.questions[0]._id!
			textQuestionId = quiz.questions[1]._id!
		})
		describe("given the question payload and file with wrong extension", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${textQuestionId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.attach("file", "__tests__/fixtures/files/note.txt")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the question payload without token", () => {
			it("should return 401", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${textQuestionId}`)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")

				expect(statusCode).toBe(401)
			})
		})
		describe("given the invalid quiz id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/invalid id/${textQuestionId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the invalid question id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${textQuestionId}/invalid id`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the question payload without title", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${textQuestionId}/${textQuestionId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("type", "TEXT")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the question payload with invalid type", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${textQuestionId}/${textQuestionId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "INVALID TYPE")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the question payload with id of non existing quiz", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId()

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${id}/${textQuestionId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")

				expect(statusCode).toBe(404)
			})
		})
		describe("given the question payload with id of non existing question", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId()

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")

				expect(statusCode).toBe(404)
			})
		})
		describe("given the question payload with id of non existing question", () => {
			it("should return 404", async () => {
				const user2 = await User.create({
					...userPayload,
					email: "test@403.com",
					_id: undefined,
				})
				const token2 = `Bearer ${createToken(user2)}`

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${textQuestionId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token2)
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")

				expect(statusCode).toBe(403)
			})
		})
		describe("given the question payload and changing type from IMAGE to TEXT", () => {
			it("should return 200, remove file", async () => {
				const { statusCode, body: question } = await request(app)
					.patch(`/api/quiz/${quizId}/${imageQuestionId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")

				const { success } = questionSchema.safeParse(question)
				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(question.title).toBe("UPDATED TITLE")
				expect(question.type).toBe("TEXT")
				expect(question.fileLocation).toBe(null)
				//should remove file
				expect(
					await doFileExists(
						path.resolve(`./static/uploads/quiz/${quiz.questions[0]._id}.png`)
					)
				).toBeFalsy()
			})
		})
		describe("given the question payload and changing type from TEXT to IMAGE", () => {
			it("should return 200, save file", async () => {
				const { statusCode, body: question } = await request(app)
					.patch(`/api/quiz/${quizId}/${textQuestionId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.attach("file", "__tests__/fixtures/files/bosanskaZastava.png")

				const { success } = questionSchema.safeParse(question)
				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(question.title).toBe("UPDATED TITLE")
				expect(question.type).toBe("IMAGE")
				expect(
					await doFileExists(path.resolve(`.${question.fileLocation}`))
				).toBeTruthy()
			})
		})
	})

	describe("DELETE :quizId/questionId deleteQuestion", () => {
		let quiz: QuizType
		beforeEach(async () => {
			const user = await User.create(userPayload)

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`

			const question = structuredClone(questionPayload)
			question.fileLocation = "hercegBosna.png"
			question.type = "IMAGE"
			question.answers[0].fileLocation = "bosanskaZastava.png"
			question.answers[0].type = "IMAGE"

			const { body } = await request(app)
				.post("/api/quiz")
				.set("content-type", "multipart/form-data")
				.set("Authorization", token)
				.field("title", quizPayload.title)
				.field("fileLocation", "rsFlag.png")
				.field("questions", JSON.stringify([question, questionPayload]))
				.attach("files", "__tests__/fixtures/files/rsFlag.png")
				.attach("files", "__tests__/fixtures/files/hercegBosna.png")
				.attach("files", "__tests__/fixtures/files/bosanskaZastava.png")
			quiz = body
		})
		describe("given the invalid quiz id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.delete(`/api/quiz/invalid id/${quiz.questions[0]._id}`)
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the invalid question id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quiz._id}/invalid id`)
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the ids without token", () => {
			it("should return 401", async () => {
				const { statusCode } = await request(app).delete(
					`/api/quiz/${quiz._id}/${quiz.questions[0]._id}`
				)

				expect(statusCode).toBe(401)
			})
		})
		describe("given the id of non existing quiz ", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${id}/${quiz.questions[0]._id}`)
					.set("Authorization", token)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the id of non existing question ", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quiz._id}/${id}`)
					.set("Authorization", token)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the id and another user's token", () => {
			it("should return 403", async () => {
				const user2 = await User.create({
					...userPayload,
					email: "test@403.com",
					_id: undefined,
				})
				const token2 = `Bearer ${createToken(user2)}`

				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quiz._id}/${quiz.questions[0]._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token2)

				expect(statusCode).toBe(403)
			})
		})
		describe("given the id", () => {
			it("should return 200 and remove files", async () => {
				const { statusCode, body: question } = await request(app)
					.delete(`/api/quiz/${quiz._id}/${quiz.questions[0]._id}`)
					.set("Authorization", token)

				const { success } = questionSchema.safeParse(question)

				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()

				expect(
					await doFileExists(path.resolve(`.${question.fileLocation}`))
				).toBeFalsy()
				expect(
					await doFileExists(
						path.resolve(`.${question.answers[0].fileLocation}`)
					)
				).toBeFalsy()
			})
		})
	})

	describe("POST /:quizId/:questionId createAnswer", () => {
		let quiz: QuizType
		beforeEach(async () => {
			const user = await User.create(userPayload)

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`

			const { body } = await request(app)
				.post("/api/quiz")
				.set("content-type", "multipart/form-data")
				.set("Authorization", token)
				.field("title", quizPayload.title)
				.field("questions", JSON.stringify(quizPayload.questions))
				.field("fileLocation", "rsFlag.png")
				.attach("files", "__tests__/fixtures/files/rsFlag.png")

			quiz = body
		})
		describe("given the answer payload with file with invalid extension", () => {
			it("should return 400, remove file", async () => {
				const answer = structuredClone(falseAnswerPayload)
				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}/${quiz.questions[0]._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", answer.title)
					.field("type", answer.type)
					.field("isTrue", answer.isTrue)
					.field("fileLocation", "note.txt")
					.attach("file", "__tests__/fixtures/files/note.txt")

				expect(statusCode).toBe(400)
				expect(
					await doFileExists(path.resolve("./static/uploads/quiz/note.txt"))
				).toBeFalsy()
			})
		})
		describe("given the invalid answer payload", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}/${quiz.questions[0]._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("type", "INVALID TYPE")
					.field("isTrue", "NOT BOOLEAN")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the answer payload and invalid quiz id", () => {
			it("should return 400", async () => {
				const answer = structuredClone(falseAnswerPayload)

				const { statusCode } = await request(app)
					.post(`/api/quiz/INVALID ID/${quiz.questions[0]._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", answer.title)
					.field("type", answer.type)
					.field("isTrue", answer.isTrue)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the answer payload and invalid question id", () => {
			it("should return 400", async () => {
				const answer = structuredClone(falseAnswerPayload)

				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}/INVALID ID`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", answer.title)
					.field("type", answer.type)
					.field("isTrue", answer.isTrue)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the answer payload and non existing quiz id", () => {
			it("should return 404", async () => {
				const answer = structuredClone(falseAnswerPayload)
				const nonExistingId = new mongoose.Types.ObjectId().toString()

				const { statusCode } = await request(app)
					.post(`/api/quiz/${nonExistingId}/${quiz.questions[0]._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", answer.title)
					.field("type", answer.type)
					.field("isTrue", answer.isTrue)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the answer payload and non existing question id", () => {
			it("should return 404", async () => {
				const answer = structuredClone(falseAnswerPayload)
				const nonExistingId = new mongoose.Types.ObjectId().toString()

				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id?.toString()}/${nonExistingId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", answer.title)
					.field("type", answer.type)
					.field("isTrue", answer.isTrue)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the answer payload and another user's token", () => {
			it("should return 403", async () => {
				const user2 = await User.create({
					...userPayload,
					email: "test@403.com",
					_id: undefined,
				})
				const token2 = `Bearer ${createToken(user2)}`

				const answer = structuredClone(falseAnswerPayload)

				const { statusCode } = await request(app)
					.post(`/api/quiz/${quiz._id}/${quiz.questions[0]._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token2)
					.field("title", answer.title)
					.field("type", answer.type)
					.field("isTrue", answer.isTrue)

				expect(statusCode).toBe(403)
			})
		})
		describe("given the answer payload and question with 4 answers", () => {
			it("should return 400, because 4 answers is max for question", async () => {
				const questions = JSON.stringify([
					{
						...questionPayload,
						answers: [
							trueAnswerPayload,
							falseAnswerPayload,
							falseAnswerPayload,
							falseAnswerPayload,
						],
					},
				])
				const { body: quizWith4Answers } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", quizPayload.title)
					.field("questions", questions)
					.field("fileLocation", "rsFlag.png")
					.attach("files", "__tests__/fixtures/files/rsFlag.png")

				const answer = structuredClone(falseAnswerPayload)
				const { statusCode } = await request(app)
					.post(
						`/api/quiz/${quizWith4Answers._id}/${quizWith4Answers.questions[0]._id}`
					)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", answer.title)
					.field("type", answer.type)
					.field("isTrue", answer.isTrue)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the valid answer payload", () => {
			it("should return 201, answer payload, and save file", async () => {
				const answer = structuredClone(falseAnswerPayload)
				answer.fileLocation = "bosanskaZastava.png"
				answer.type = "IMAGE"

				const { statusCode, body } = await request(app)
					.post(`/api/quiz/${quiz._id}/${quiz.questions[0]._id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", answer.title)
					.field("type", answer.type)
					.field("isTrue", answer.isTrue)
					.field("fileLocation", "bosanskaZastava.png")
					.attach("file", "__tests__/fixtures/files/bosanskaZastava.png")

				const { success } = answerSchema.safeParse(body)

				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				expect(await doFileExists(path.resolve(`.${answer.fileLocation}`)))
			})
		})
	})

	describe("PATCH /:quizId/:questionId updateAnswer", () => {
		let quiz: QuizType
		let quizId = ""
		let questionId = ""
		let imageFalseAnswerId = ""
		let textFalseAnswerId = ""
		let trueAnswerId = ""
		beforeEach(async () => {
			const user = await User.create(userPayload)

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`

			const question = structuredClone(questionPayload)
			question.answers[1].fileLocation = "bosanskaZastava.png"
			question.answers[1].type = "IMAGE"

			const { body } = await request(app)
				.post("/api/quiz")
				.set("content-type", "multipart/form-data")
				.set("Authorization", token)
				.field("title", quizPayload.title)
				.field("fileLocation", "rsFlag.png")
				.field("questions", JSON.stringify([question, questionPayload]))
				.attach("files", "__tests__/fixtures/files/rsFlag.png")
				.attach("files", "__tests__/fixtures/files/hercegBosna.png")
				.attach("files", "__tests__/fixtures/files/bosanskaZastava.png")

			quiz = body
			quizId = quiz._id!
			questionId = quiz.questions[0]._id!
			trueAnswerId = quiz.questions[0].answers[0]._id!
			imageFalseAnswerId = quiz.questions[0].answers[1]._id!
			textFalseAnswerId = quiz.questions[0].answers[2]._id!
		})
		describe("given the answer payload and file with wrong extension", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/note.txt")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the question payload without token", () => {
			it("should return 401", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${textFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")

				expect(statusCode).toBe(401)
			})
		})
		describe("given the invalid quiz id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/INVALID ID/${questionId}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the invalid question id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/INVALID ID/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the invalid question id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/INVALID ID`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the answer payload without title", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the answer payload with invalid type", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "INVALID TYPE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the answer payload with non boolean isTrue", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "NON BOOLEAN")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the id of non existing quiz", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${id}/${questionId}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(404)
			})
		})
		describe("given the id of non existing question", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${id}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(404)
			})
		})
		describe("given the id of non existing answer", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${id}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(404)
			})
		})
		describe("given the answer payload with other user's token", () => {
			it("should return 403", async () => {
				const user2 = await User.create({
					...userPayload,
					email: "test@403.com",
					_id: undefined,
				})
				const token2 = `Bearer ${createToken(user2)}`

				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token2)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(403)
			})
		})
		describe("given the answer payload and changing only true answer to false", () => {
			it("should return 400 because question must have one true answer", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${trueAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the answer payload and changing IMAGE answer to TEXT", () => {
			it("should return 200,remove file", async () => {
				const { statusCode, body: answer } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${imageFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "TEXT")
					.field("isTrue", "false")

				const { success } = answerSchema.safeParse(answer)

				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(answer.title).toBe("UPDATED TITLE")
				expect(answer.type).toBe("TEXT")
				expect(answer.fileLocation).toBeNull()
				expect(
					await doFileExists(
						path.resolve(`./static/uploads/quiz/${answer._id}.png`)
					)
				).toBeFalsy()
			})
		})
		describe("given the answer payload and changing TEXT answer to IMAGE", () => {
			it("should return 200,remove file", async () => {
				const { statusCode, body: answer } = await request(app)
					.patch(`/api/quiz/${quizId}/${questionId}/${textFalseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("title", "UPDATED TITLE")
					.field("type", "IMAGE")
					.field("isTrue", "false")
					.attach("file", "__tests__/fixtures/files/rsFlag.png")

				const { success } = answerSchema.safeParse(answer)

				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(answer.title).toBe("UPDATED TITLE")
				expect(answer.type).toBe("IMAGE")
				expect(answer.fileLocation).not.toBeNull()
				expect(
					await doFileExists(
						path.resolve(`./static/uploads/quiz/${answer._id}.png`)
					)
				).toBeTruthy()
			})
		})
	})

	describe("DELETE /:quizId/:questionId/:answersId deleteAnswer", () => {
		let quiz: QuizType
		let quizId = ""
		let questionId = ""
		let falseAnswerId = ""
		let secondFalseAnswerId = ""
		let trueAnswerId = ""
		beforeEach(async () => {
			const user = await User.create(userPayload)

			userPayload._id = user._id!.toString()
			token = `Bearer ${createToken(user)}`

			const question = structuredClone(questionPayload)
			question.answers[1].fileLocation = "bosanskaZastava.png"
			question.answers[1].type = "IMAGE"

			const { body } = await request(app)
				.post("/api/quiz")
				.set("content-type", "multipart/form-data")
				.set("Authorization", token)
				.field("title", quizPayload.title)
				.field("fileLocation", "rsFlag.png")
				.field("questions", JSON.stringify([question, questionPayload]))
				.attach("files", "__tests__/fixtures/files/rsFlag.png")
				.attach("files", "__tests__/fixtures/files/hercegBosna.png")
				.attach("files", "__tests__/fixtures/files/bosanskaZastava.png")

			quiz = body
			quizId = quiz._id!
			questionId = quiz.questions[0]._id!
			trueAnswerId = quiz.questions[0].answers[0]._id!
			falseAnswerId = quiz.questions[0].answers[1]._id!
			secondFalseAnswerId = quiz.questions[0].answers[2]._id!
		})
		describe("given the invalid quiz id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.delete(`/api/quiz/invalid id/${questionId}${falseAnswerId}`)
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the invalid question id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quizId}/invalid id/${falseAnswerId}`)
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the invalid answer id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quizId}/${questionId}/invalid id`)
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the ids without token", () => {
			it("should return 401", async () => {
				const { statusCode } = await request(app).delete(
					`/api/quiz/${quizId}/${questionId}/${falseAnswerId}`
				)

				expect(statusCode).toBe(401)
			})
		})
		describe("given the id of non existing quiz ", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${id}/${questionId}/${falseAnswerId}`)
					.set("Authorization", token)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the id of non existing question ", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quizId}/${id}/${falseAnswerId}`)
					.set("Authorization", token)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the id of non existing answer ", () => {
			it("should return 404", async () => {
				const id = new mongoose.Types.ObjectId().toString()
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quizId}/${questionId}/${id}`)
					.set("Authorization", token)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the id and another user's token", () => {
			it("should return 403", async () => {
				const user2 = await User.create({
					...userPayload,
					email: "test@403.com",
					_id: undefined,
				})
				const token2 = `Bearer ${createToken(user2)}`

				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quizId}/${questionId}/${falseAnswerId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token2)

				expect(statusCode).toBe(403)
			})
		})
		describe("given the id of only true answer ", () => {
			it("should return 400 because question must contain one true answer", async () => {
				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quizId}/${questionId}/${trueAnswerId}`)
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the id of one of 2 answers ", () => {
			it("should return 400 because question must contain at least two answers", async () => {
				await request(app)
					.delete(`/api/quiz/${quizId}/${questionId}/${falseAnswerId}`)
					.set("Authorization", token)

				const { statusCode } = await request(app)
					.delete(`/api/quiz/${quizId}/${questionId}/${secondFalseAnswerId}`)
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the ids", () => {
			it("should return 200 and remove file", async () => {
				const { statusCode, body: answer } = await request(app)
					.delete(`/api/quiz/${quizId}/${questionId}/${falseAnswerId}`)
					.set("Authorization", token)

				const { success } = answerSchema.safeParse(answer)

				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(await doFileExists(`.${answer.fileLocation}`)).toBeFalsy()
			})
		})
	})
})
