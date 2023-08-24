import { CustomRequest } from "../../types/customRequest.js"
import User from "../../models/user.js"
import CustomError from "../../types/customError.js"
import env from "../../config/envVariables.js"
import { Response } from "express"
import bcrypt from "bcrypt"
import { createToken } from "../../utils/createToken.js"
import { handleControllerError } from "../../utils/handleControllerError.js"
import Quiz from "../../models/quiz.js"
import jwt, { JwtPayload } from "jsonwebtoken"
import {
	emailMissing,
	invalidPassword,
	passwordMissing,
	userNotFound,
} from "../../utils/errors/user.js"

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
			throw new CustomError(emailMissing)
		}

		if (!passwordMissing) {
			throw new CustomError(passwordMissing)
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
			throw new CustomError(invalidPassword)
		}
		const token = createToken(user)

		user.userQuizes = userQuizes
		user.password = ""
		res.json({ user, token })
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
