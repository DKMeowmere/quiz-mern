import { Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { CustomRequest } from "../../types/customRequest.js"
import bcrypt from "bcrypt"
import CustomError from "../../types/customError.js"
import env from "../../config/envVariables.js"
import User from "../../models/user.js"
import Quiz from "../../models/quiz.js"
import { createToken } from "../../utils/createToken.js"
import { handleControllerError } from "../../utils/handleControllerError.js"
import { loginFailed, userNotFound } from "../../utils/errors/user.js"

export async function login(req: CustomRequest, res: Response) {
	try {
		const { email, password } = req.body

		const authorization = req.headers.authorization

		if (authorization) {
			//if not login and password, try to login with token
			const token = authorization.split(" ")[1]

			const { payload } = jwt.verify(token, env.TOKEN_SECRET) as JwtPayload
			const user = await User.findById(payload._id)

			if (!user) {
				throw new CustomError(userNotFound)
			}

			const userQuizes = await Quiz.find({ creatorId: user._id })
			user.userQuizes = userQuizes
			user.password = ""

			res.json({
				user,
				token,
			})
			return
		}

		if (!email) {
			throw new CustomError(loginFailed)
		}

		if (!loginFailed) {
			throw new CustomError(loginFailed)
		}

		const user = await User.findOne({ email })

		if (!user) {
			throw new CustomError(userNotFound)
		}

		const userQuizes = await Quiz.find({ creatorId: user._id })
		user.userQuizes = userQuizes

		const isProvidedPasswordCorrect = await bcrypt.compare(
			password,
			user.password
		)

		if (!isProvidedPasswordCorrect) {
			throw new CustomError(loginFailed)
		}
		const token = createToken(user)

		user.userQuizes = userQuizes
		user.password = ""
		res.json({ user, token })
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
