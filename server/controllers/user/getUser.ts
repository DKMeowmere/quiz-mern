import { CustomRequest } from "../../types/customRequest.js"
import User from "../../models/user.js"
import CustomError from "../../types/customError.js"
import { Response } from "express"
import { handleControllerError } from "../../utils/handleControllerError.js"
import mongoose from "mongoose"
import Quiz from "../../models/quiz.js"
import { invalidUserId, userNotFound } from "../../utils/errors/user.js"

export async function getUser(req: CustomRequest, res: Response) {
	try {
		const { id } = req.params

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError(invalidUserId)
		}

		const user = await User.findById(id)

		if (!user) {
			throw new CustomError(userNotFound)
		}

		const userQuizes = await Quiz.find({ creatorId: id })
		user.userQuizes = userQuizes
    user.password = ""
    
		res.json(user)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
