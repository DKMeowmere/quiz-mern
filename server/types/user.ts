import { z } from "zod"
import { quizClientSchema, quizSchema } from "./quiz.js"

export const userSchema = z.object({
	_id: z.string().nullish(),
	name: z
		.string()
		.max(20, { message: "maksymalna długość nazwy to 20 znaków" }),
	email: z.string().email({ message: "Nie prawidłowy email" }),
	password: z
		.string()
		.min(8, { message: "Minimalna długość hasła to 8 znaków" }),
	biography: z.string().default("").catch(""),
	userQuizes: z.array(quizSchema).catch([]),
	avatarLocation: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
})

export const UserClientSchema = userSchema.extend({
	_id: z.string(),
  userQuizes: z.array(quizClientSchema).catch([]),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
})

export const userSchemaWithoutPassword = userSchema.extend({
	password: z.string().default("").catch(""),
})

export type User = z.infer<typeof userSchema>
export type Users = User[]
export type UserClient = z.infer<typeof UserClientSchema>
export type UsersClient = UserClient[]
