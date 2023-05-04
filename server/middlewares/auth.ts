import { NextFunction, Response } from "express"
import { CustomRequest } from "../types/customRequest"
import CustomError from "../types/customError"
import env from "../config/envVariables"
import jwt, { JwtPayload } from "jsonwebtoken"
import User from "../models/user"

export async function requireAuth(
	req: CustomRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const { authorization } = req.headers

		if (!authorization) {
			throw new CustomError({
				message: "Musisz być zalogowany, żeby to zrobić",
				statusCode: 401,
			})
		}

		const token = authorization?.split(" ")[1]
		const { payload } = jwt.verify(token, env.TOKEN_SECRET) as JwtPayload
		const user = await User.findById(payload._id)

		if (!user) {
			throw new CustomError({
				message: "Użytkownik podany w tokenie, nie istnieje",
				statusCode: 401,
			})
		}

		req.user = user
		next()
	} catch (err) {
		env.NODE_ENV === "development" && console.log(err)

		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ error: err.message })
		} else {
			res.status(400).json({ error: env.UNIVERSAL_ERROR_MESSAGE })
		}
	}
}
