import jwt from "jsonwebtoken"
import env from "../config/envVariables.js"

export function createToken(payload: object) {
	const token = jwt.sign({ payload }, env.TOKEN_SECRET, {
		expiresIn: "7d",
	})

	return token
}
