import { z } from "zod"

const nodeEnvEnum = ["production", "development", "test"] as const

export const envSchema = z.object({
	PORT: z.string(),
	MONGO_URI: z.string(),
	TOKEN_SECRET: z.string(),
	CLIENT_APP_URL: z.string(),
	NODE_ENV: z.enum(nodeEnvEnum),
	UNIVERSAL_ERROR_MESSAGE: z.string(),
	SALT_ROUNDS: z.number().positive(),
})

export type Env = z.infer<typeof envSchema>
