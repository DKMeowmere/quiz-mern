import {
	describe,
	it,
	expect,
	beforeAll,
	beforeEach,
	afterAll,
} from "@jest/globals"
import createServer from "../utils/createServer"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import fs from "fs/promises"
import path from "path"
import User from "../models/user"
import { userPayload } from "./fixtures/user"
import Quiz from "../models/quiz"
import { quizPayload } from "./fixtures/quiz"
import request from "supertest"
import { userSchema } from "../types/user"

const app = createServer()

describe("USER /api/user", () => {
	beforeAll(async () => {
		const mongodb = await MongoMemoryServer.create()
		const uri = mongodb.getUri()
		await mongoose.connect(uri)
	})
	beforeEach(async () => {
		const directory = "./static/uploads/user/"
		for (const file of await fs.readdir(directory)) {
			if (file === ".gitkeep") continue
			await fs.unlink(path.join(directory, file))
		}
	})
	afterAll(async () => {
		const directory = "./static/uploads/user/"

		for (const file of await fs.readdir(directory)) {
			if (file === ".gitkeep") continue
			await fs.unlink(path.join(directory, file))
		}

		await mongoose.disconnect()
		await mongoose.connection.close()
	})
	describe("GET /:id", () => {
		beforeAll(async () => {
			const user = await User.create(userPayload)
			const quiz1 = await Quiz.create(quizPayload)
			const quiz2 = await Quiz.create(quizPayload)
			quiz1.creatorId = user._id || ""
			await quiz1.save()
			quiz2.creatorId = user._id || ""
			await quiz2.save()
		})
		describe("given the user payload", () => {
			it("should return 200 and user with quizes", async () => {
				const { _id } = Array.from(await User.find())[0]

				const { statusCode, body: user } = await request(app).get(
					`/api/user/${_id}`
				)
				const { success } = userSchema.safeParse(user)

				expect(success).toBeTruthy()
				expect(statusCode).toBe(200)
				expect(user.userQuizes).toHaveLength(2)
			})
		})
		describe("given the invalid id", () => {
			it("should return 400", async () => {
				const id = "invalid id"
				const { statusCode } = await request(app).get(`/api/user/${id}`)
				expect(statusCode).toBe(400)
			})
		})
		describe("given the id of non existing user", () => {
			it("should return 404", async () => {
				const id = "644c34ccfa6d83e3476c4ecc"
				const { statusCode } = await request(app).get(`/api/user/${id}`)
				expect(statusCode).toBe(404)
			})
		})
	})
	describe("GET /", () => {
		beforeAll(async () => {
			await User.deleteMany({})
			await User.create({ ...userPayload, email: "email1@email.com" })
			await User.create({ ...userPayload, email: "email2@email.com" })
			await User.create({ ...userPayload, email: "email3@email.com" })
		})
		describe("given the 3 documents", () => {
			it("should return 200 and 3 users", async () => {
				const { statusCode, body } = await request(app).get("/api/user")
				expect(statusCode).toBe(200)
				expect(body).toHaveLength(3)
			})
			describe("given the 3 documents with limit 2", () => {
				it("should return 200 and 2 users", async () => {
					const { statusCode, body } = await request(app).get(
						"/api/user?limit=2"
					)
					expect(statusCode).toBe(200)
					expect(body).toHaveLength(2)
				})
			})
		})
	})
	describe("POST /", () => {
		beforeAll(async () => {
			User.deleteMany({})
		})
		describe("given the user payload", () => {
			it("should return 201, user payload and token", async () => {
				const { body, statusCode } = await request(app)
					.post("/api/user")
					.set("content-type", "multipart/form-data")
					.field("name", userPayload.name)
					.field("email", userPayload.email)
					.field("biography", userPayload.biography)
					.field("password", userPayload.password)
					.attach("avatar", "__tests__/fixtures/files/ronald_reagan.jpg")

				const { success } = userSchema.safeParse(body.user)
				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				expect(body.token).toBeDefined()
			})
		})
	})
})
