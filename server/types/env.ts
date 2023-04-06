import { z } from "zod"

export const envSchema = z.object({
	PORT: z.string(),
	MONGO_URI: z.string(),
	TOKEN_SECRET: z.string(),
	CLIENT_APP_URL: z.string(),
})

export type Env = z.infer<typeof envSchema>
