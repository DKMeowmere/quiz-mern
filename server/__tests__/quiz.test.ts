import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import request from "supertest"
import createServer from "../utils/createServer"
import { quizPayload } from "./fixtures/quiz"
import Quiz from "../models/quiz"
import { quizSchema } from "../types/quiz"
import path from "path"
import fs from "fs/promises"
import { doFileExists } from "../utils/doFileExists"

const app = createServer()

describe("QUIZ /api/quiz", () => {
	beforeAll(async () => {
		const mongodb = await MongoMemoryServer.create()
		const dbUri = mongodb.getUri()
		await mongoose.connect(dbUri)
	})
	beforeEach(async () => {
		const directory = "./static/uploads/quiz/"

		for (const file of await fs.readdir(directory)) {
			await fs.unlink(path.join(directory, file))
		}
	})

	afterAll(async () => {
		const directory = "./static/uploads/quiz/"

		for (const file of await fs.readdir(directory)) {
			await fs.unlink(path.join(directory, file))
		}

		await mongoose.disconnect()
		await mongoose.connection.close()
	})

	describe("GET /:id", () => {
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
	describe("GET /", () => {
		beforeAll(async () => {
			await Quiz.deleteMany({})
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
	describe("POST /", () => {
		beforeAll(async () => {
			await Quiz.deleteMany({})
		})
		describe("given the quiz payload", () => {
			it("should return 201 and quiz", async () => {
				const { body, statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.field("title", quizPayload.title)
					.field("questions", JSON.stringify(quizPayload.questions))
					.attach("files", "__tests__/fixtures/files/quiz-main-rs-flag.png")

				const { success } = quizSchema.safeParse(body)
				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				const absolutePath = `./static/uploads/quiz/rs-flag-${body._id}.png`
				expect(doFileExists(path.resolve(absolutePath))).toBeTruthy()
			})
		})
		describe("given the quiz payload with question and answer file", () => {
			it("should return 201, quiz and rename files", async () => {
				const quiz = structuredClone(quizPayload)
				quiz.questions[1].type = "IMAGE"
				quiz.questions[0].answers[1].type = "IMAGE"
				quiz.questions[1].answers[1].type = "IMAGE"

				const { body, statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.field("title", quiz.title)
					.field("questions", JSON.stringify(quiz.questions))
					.attach("files", "__tests__/fixtures/files/quiz-main-rs-flag.png")
					.attach(
						"files",
						"__tests__/fixtures/files/question-1-hercegBosna.png"
					)
					.attach(
						"files",
						"__tests__/fixtures/files/answer-0-1-krajina-flag.png"
					)
					.attach(
						"files",
						"__tests__/fixtures/files/answer-1-1-krajina-flag.png"
					)

				const { success } = quizSchema.safeParse(body)
				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				const absolutePaths = [
					`./static/uploads/quiz/rs-flag-${body._id}.png`,
					`./static/uploads/quiz/hercegBosna-${body.questions[1]._id}.png`,
					`./static/uploads/quiz/krajina-flag-${body.questions[0].answers[1]._id}.png`,
					`./static/uploads/quiz/krajina-flag-${body.questions[1].answers[1]._id}.png`,
				]
				absolutePaths.forEach(absolutePath => {
					expect(doFileExists(path.resolve(absolutePath))).toBeTruthy()
				})
			})
		})
		describe("given the quiz payload with question file and without answer file", () => {
			it("should return 400, and remove all provided files", async () => {
				const quiz = structuredClone(quizPayload)
				quiz.questions[1].type = "IMAGE"
				quiz.questions[0].answers[1].type = "IMAGE"
				quiz.questions[1].answers[1].type = "IMAGE"

				const { statusCode } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.field("title", quiz.title)
					.field("questions", JSON.stringify(quiz.questions))
					.attach("files", "__tests__/fixtures/files/quiz-main-rs-flag.png")
					.attach(
						"files",
						"__tests__/fixtures/files/question-1-hercegBosna.png"
					)
					.attach("files", "__tests__/fixtures/files/rs-flag.png")

				expect(statusCode).toBe(400)
				const absolutePaths = [
					`./static/uploads/quiz/quiz-main-rs-flag.png`,
					`./static/uploads/quiz/question-1-hercegBosna.png`,
					`./static/uploads/quiz/rs-flag.png`,
				]
				absolutePaths.forEach(async absolutePath => {
					expect(await doFileExists(path.resolve(absolutePath))).toBeFalsy()
				})
			})
		})
	})
	describe("PATCH /:id", () => {
		beforeAll(async () => {
			await Quiz.deleteMany({})
		})
		describe("given the quiz payload", () => {
			it("should update quiz, return 200 and replace old main file with new one", async () => {
				const { body: quiz } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.field("title", quizPayload.title)
					.field("questions", JSON.stringify(quizPayload.questions))
					.attach("files", "__tests__/fixtures/files/quiz-main-rs-flag.png")

				const { body, statusCode } = await request(app)
					.patch(`/api/quiz/${quiz._id}`)
					.set("content-type", "multipart/form-data")
					.field("title", "UPDATED TITLE")
					.field("questions", JSON.stringify(quiz.questions))
					.attach("files", "__tests__/fixtures/files/quiz-main-hercegBosna.png")

				const { success } = quizSchema.safeParse(body)
				const pathToFile = path.resolve(
					`./static/uploads/quiz/rs-flag-${body._id}.png`
				)
				const pathToUpdatedFile = path.resolve(
					`./static/uploads/quiz/hercegBosna-${body._id}.png`
				)

				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(body.title).toBe("UPDATED TITLE")
				expect(await doFileExists(pathToUpdatedFile)).toBeTruthy()
				expect(await doFileExists(pathToFile)).toBeFalsy()
			})
		})
	})
	describe("DELETE /:id", () => {
		beforeAll(async () => {
			await Quiz.deleteMany({})
		})
		describe("given the quiz payload", () => {
			it("should remove quiz and main file and return 200", async () => {
				const { body } = await request(app)
					.post("/api/quiz")
					.set("content-type", "multipart/form-data")
					.field("title", quizPayload.title)
					.field("questions", JSON.stringify(quizPayload.questions))
					.attach("files", "__tests__/fixtures/files/quiz-main-rs-flag.png")

				const { statusCode } = await request(app).delete(
					`/api/quiz/${body._id}`
				)
				const absolutePath = `./static/uploads/quiz/rs-flag-${body._id}.png`
				expect(statusCode).toBe(200)
				expect(await doFileExists(absolutePath)).toBe(false)
			})
		})
	})
})
