import { NextFunction, Response } from "express"
import { CustomRequest } from "../types/customRequest.js"
import CustomError from "../types/customError.js"
import env from "../config/envVariables.js"
import jwt, { JwtPayload } from "jsonwebtoken"
import User from "../models/user.js"
import { authNeeded, userInTokenNotFound } from "../utils/errors/user.js"
import { handleControllerError } from "../utils/handleControllerError.js"

export async function requireAuth(
	req: CustomRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const { authorization } = req.headers

		if (!authorization) {
			throw new CustomError(authNeeded)
		}

		const token = authorization.split(" ")[1]
		const { payload } = jwt.verify(token, env.TOKEN_SECRET) as JwtPayload
		const user = await User.findById(payload._id)

		if (!user) {
      throw new CustomError(userInTokenNotFound)
		}
    
		req.user = user
		next()
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
