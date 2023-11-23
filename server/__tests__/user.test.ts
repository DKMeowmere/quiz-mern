import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import {
	describe,
	it,
	expect,
	beforeAll,
	beforeEach,
	afterAll,
} from "@jest/globals"
import path from "path"
import request from "supertest"
import { userSchemaWithoutPassword } from "../types/user"
import { User } from "../models/user"
import { Quiz } from "../models/quiz"
import { createServer } from "../utils/createServer"
import { createToken } from "../utils/createToken"
import { doFileExists } from "../utils/doFileExists"
import { userPayload } from "./fixtures/user"
import { quizPayload } from "./fixtures/quiz"

const app = createServer()

describe("USER /api/user", () => {
	beforeAll(async () => {
		const mongodb = await MongoMemoryServer.create()
		const uri = mongodb.getUri()
		await mongoose.connect(uri)
	})

	beforeEach(async () => {
		await request(app).get("/reset")
	})

	afterAll(async () => {
		await request(app).get("/reset")

		await mongoose.disconnect()
		await mongoose.connection.close()
	})

	describe("GET /:id getUser", () => {
		beforeEach(async () => {
			const user = await User.create(userPayload)
			const quiz1 = await Quiz.create(quizPayload)
			const quiz2 = await Quiz.create(quizPayload)
			quiz1.creatorId = user._id!
			await quiz1.save()
			quiz2.creatorId = user._id!
			await quiz2.save()
		})
		describe("given the user id", () => {
			it("should return 200 and user with quizes", async () => {
				const { _id } = Array.from(await User.find())[0]

				const { statusCode, body: user } = await request(app).get(
					`/api/user/${_id}`
				)
				const { success } = userSchemaWithoutPassword.safeParse(user)

				expect(success).toBeTruthy()
				expect(statusCode).toBe(200)
				expect(user.password).toBe("")
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

	describe("GET / getUsers", () => {
		beforeEach(async () => {
			await User.create({ ...userPayload, email: "email1@email.com" })
			await User.create({ ...userPayload, email: "email2@email.com" })
			await User.create({ ...userPayload, email: "email3@email.com" })
		})
		describe("given the 3 documents", () => {
			it("should return 200 and 3 users", async () => {
				const { statusCode, body } = await request(app).get("/api/user")

				expect(statusCode).toBe(200)
				expect(body).toHaveLength(3)
				expect(body[0].password).toBe("")
			})
		})
		describe("given the 3 documents with limit 2", () => {
			it("should return 200 and 2 users", async () => {
				const { statusCode, body } = await request(app).get("/api/user?limit=2")
				expect(statusCode).toBe(200)
				expect(body).toHaveLength(2)
			})
		})
	})

	describe("POST / signUp", () => {
		describe("given the user payload and file with invalid extension", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/user")
					.set("content-type", "multipart/form-data")
					.field("name", userPayload.name)
					.field("email", userPayload.email)
					.field("biography", userPayload.biography)
					.field("password", userPayload.password)
					.attach("avatar", "__tests__/fixtures/files/note.txt")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the user payload without name", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/user")
					.set("content-type", "multipart/form-data")
					.field("email", userPayload.email)
					.field("biography", userPayload.biography)
					.field("password", userPayload.password)
					.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the user payload without email", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/user")
					.set("content-type", "multipart/form-data")
					.field("name", userPayload.name)
					.field("biography", userPayload.biography)
					.field("password", userPayload.password)
					.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the user payload without password", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/user")
					.set("content-type", "multipart/form-data")
					.field("name", userPayload.name)
					.field("email", userPayload.email)
					.field("biography", userPayload.biography)
					.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

				expect(statusCode).toBe(400)
			})
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
					.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

				const { success } = userSchemaWithoutPassword.safeParse(body.user)

				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				expect(body.token).toBeDefined()
				expect(body.user.avatarLocation).toBeDefined()
				expect(body.user.password).toBe("")
			})
		})
		describe("given the user payload with too short password", () => {
			it("should return 400 because 8 chars is min for password", async () => {
				const { statusCode } = await request(app)
					.post("/api/user")
					.set("content-type", "multipart/form-data")
					.field("name", userPayload.name)
					.field("email", userPayload.email)
					.field("biography", userPayload.biography)
					.field("password", "short")
					.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the user payload without file", () => {
			it("should return 201, user payload and token, set defautl avatar", async () => {
				const { body, statusCode } = await request(app)
					.post("/api/user")
					.set("content-type", "multipart/form-data")
					.field("name", userPayload.name)
					.field("email", userPayload.email)
					.field("biography", userPayload.biography)
					.field("password", userPayload.password)

				const { success } = userSchemaWithoutPassword.safeParse(body.user)

				expect(statusCode).toBe(201)
				expect(success).toBeTruthy()
				expect(body.token).toBeDefined()
				expect(body.user.avatarLocation).toContain("defaultAvatar")
				expect(body.user.password).toBe("")
			})
		})
	})

	describe("POST /login login", () => {
		const email = "email@test.com"
		const password = "password"
		let token = ""
		beforeEach(async () => {
			const { body } = await request(app)
				.post("/api/user")
				.set("content-type", "multipart/form-data")
				.field("name", "name")
				.field("email", email)
				.field("password", password)
				.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

			token = `Bearer ${body.token}`

			const quiz = await Quiz.create(quizPayload)
			quiz.creatorId = body.user._id.toString()
			await quiz.save()
		})
		describe("given the token", () => {
			it("should return 200, token and user", async () => {
				const { body, statusCode } = await request(app)
					.post("/api/user/login")
					.set("Authorization", token)

				const { success } = userSchemaWithoutPassword.safeParse(body.user)
				const { user, token: newToken } = body

				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(newToken).toBeDefined()
				//quizes array should be empty,
				expect(user.userQuizes).toHaveLength(0)
				expect(user.password).toBe("")
			})
		})
		describe("given the token of non existing user", () => {
			it("should return 404", async () => {
				await User.deleteMany({})

				const { statusCode } = await request(app)
					.post("/api/user/login")
					.set("Authorization", token)

				expect(statusCode).toBe(404)
			})
		})
		describe("given the email without password", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/user/login")
					.send({ email })

				expect(statusCode).toBe(400)
			})
		})
		describe("given the password without email", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.post("/api/user/login")
					.send({ password })

				expect(statusCode).toBe(400)
			})
		})
		describe("given the email and password", () => {
			it("should return 200", async () => {
				const { statusCode, body } = await request(app)
					.post("/api/user/login")
					.send({ email, password })
				const { user, token: newToken } = body

				expect(statusCode).toBe(200)
				expect(user.password).toBe("")
        //quizes array should be empty,
				expect(user.userQuizes).toHaveLength(0)
				expect(newToken).toBeDefined()
			})
		})
	})

	describe("PATCH /:id updateUser", () => {
		let userId = ""
		let token = ""
		beforeEach(async () => {
			const { body } = await request(app)
				.post("/api/user")
				.set("content-type", "multipart/form-data")
				.field("name", userPayload.name)
				.field("email", userPayload.email)
				.field("password", userPayload.password)
				.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

			token = `Bearer ${body.token}`
			userId = body.user._id

			const quiz = await Quiz.create(quizPayload)
			quiz.creatorId = body.user._id.toString()
			await quiz.save()
		})
		describe("given the user payload with file with wrong extension", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/user/${userId}`)
					.set("Authorization", token)
					.set("content-type", "multipart/form-data")
					.field("name", userPayload.name)
					.field("biography", userPayload.biography)
					.attach("avatar", "__tests__/fixtures/files/note.txt")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the user payload without token", () => {
			it("should return 401", async () => {
				const { statusCode } = await request(app)
					.patch(`/api/user/${userId}`)
					.set("content-type", "multipart/form-data")
					.field("name", userPayload.name)
					.field("biography", userPayload.biography)

				expect(statusCode).toBe(401)
			})
		})
		describe("given the user with invalid id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.patch("/api/user/invalid id")
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("name", userPayload.name)
					.field("biography", userPayload.biography)
					.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

				expect(statusCode).toBe(400)
			})
		})
		describe("given the user with another user's token", () => {
			it("should return 403", async () => {
				const user2 = await User.create({
					...userPayload,
					email: "test@403.com",
					_id: undefined,
				})
				const token2 = `Bearer ${createToken(user2)}`

				const { statusCode } = await request(app)
					.patch(`/api/user/${userId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token2)
					.field("name", userPayload.name)
					.field("biography", userPayload.biography)
					.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

				expect(statusCode).toBe(403)
			})
		})
		describe("given the user payload", () => {
			it("should return 200 and user", async () => {
				const { statusCode, body: user } = await request(app)
					.patch(`/api/user/${userId}`)
					.set("content-type", "multipart/form-data")
					.set("Authorization", token)
					.field("name", "UPDATED NAME")
					.field("biography", "UPDATED BIOGRAPHY")
					.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

				const { success } = await userSchemaWithoutPassword.safeParse(user)

				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(user.password).toBe("")
				expect(user.name).toBe("UPDATED NAME")
				expect(user.biography).toBe("UPDATED BIOGRAPHY")
				expect(user.userQuizes).toHaveLength(1)
				expect(
					await doFileExists(path.resolve(`.${user.avatarLocation}`))
				).toBeTruthy()
			})
		})
	})

	describe("DELETE /:id deleteUser", () => {
		let userId = ""
		let token = ""
		beforeEach(async () => {
			const { body } = await request(app)
				.post("/api/user")
				.set("content-type", "multipart/form-data")
				.field("name", userPayload.name)
				.field("email", userPayload.email)
				.field("password", userPayload.password)
				.attach("avatar", "__tests__/fixtures/files/ronaldReagan.jpg")

			token = `Bearer ${body.token}`

			userId = body.user._id
			const quiz = await Quiz.create(quizPayload)
			quiz.creatorId = body.user._id.toString()
			await quiz.save()
		})
		describe("given the invalid id", () => {
			it("should return 400", async () => {
				const { statusCode } = await request(app)
					.delete("/api/user/invalid id")
					.set("Authorization", token)

				expect(statusCode).toBe(400)
			})
		})
		describe("given the id without token", () => {
			it("should return 401", async () => {
				const { statusCode } = await request(app).delete(`/api/user/${userId}`)

				expect(statusCode).toBe(401)
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
					.delete(`/api/user/${userId}`)
					.set("Authorization", token2)

				expect(statusCode).toBe(403)
			})
		})
		describe("given the id", () => {
			it("should return 200, user and remove file", async () => {
				const { body: user, statusCode } = await request(app)
					.delete(`/api/user/${userId}`)
					.set("Authorization", token)

				const success = userSchemaWithoutPassword.safeParse(user)

				expect(statusCode).toBe(200)
				expect(success).toBeTruthy()
				expect(
					await doFileExists(path.resolve(`.${user.avatarLocation}`))
				).toBeFalsy()
				expect(user.password).toBe("")
			})
		})
	})
})
