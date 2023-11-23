import { Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { env } from "../../config/envVariables.js"
import { loginFailed, userNotFound } from "../../config/constants/userErrors.js"
import { User } from "../../models/user.js"
import { createToken } from "../../utils/createToken.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

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

		const isProvidedPasswordCorrect = await bcrypt.compare(
			password,
			user.password
		)

		if (!isProvidedPasswordCorrect) {
			throw new CustomError(loginFailed)
		}
		const token = createToken(user)

		user.password = ""
		res.json({ user, token })
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
