import { CustomRequest } from "../../types/customRequest.js"
import User from "../../models/user.js"
import { Response } from "express"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function getUsers(req: CustomRequest, res: Response) {
	try {
		const { limit } = req.query
		const users = await User.find()
			.sort({ createdAt: -1 })
			.limit(parseInt(limit?.toString() || "0"))

		users.forEach(user => {
			user.password = ""
		})

		res.json(users)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
