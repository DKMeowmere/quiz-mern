import { z } from "zod"
import { quizSchema } from "./quiz"

export const userSchema = z.object({
	_id: z.string().nullish(),
	name: z
		.string()
		.max(20, { message: "maksymalna długość nazwy to 20 znaków" }),
	email: z.string().email({ message: "Nie prawidłowy email" }),
	password: z
		.string()
		.min(8, { message: "Minimalna długość hasła to 8 znaków" }),
	biography: z.string().catch(""),
	userQuizes: z.array(quizSchema).catch([]),
	avatarLocation: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
})

export type User = z.infer<typeof userSchema>
