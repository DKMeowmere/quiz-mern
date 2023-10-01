import fs from "fs/promises"
import path from "path"
import bcrypt from "bcrypt"
import { Response } from "express"
import { CustomRequest } from "../../types/customRequest.js"
import { CustomError } from "../../types/customError.js"
import { userSchema } from "../../types/user.js"
import { env } from "../../config/envVariables.js"
import { filesValidationFailedMustBeImageOrAudio } from "../../config/constants/universalErrors.js"
import { User } from "../../models/user.js"
import { createToken } from "../../utils/createToken.js"
import { handleControllerError } from "../../utils/handleControllerError.js"

export async function signUp(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError(filesValidationFailedMustBeImageOrAudio)
		}

		const { name, email, biography, password } = req.body
		const result = userSchema.safeParse({ name, email, biography, password })

		if (result.success === false) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}
		const parsedUser = result.data
		const hash = await bcrypt.hash(parsedUser.password, env.SALT_ROUNDS)
		const user = await User.create({ ...parsedUser, password: hash })

		if (req.file) {
			const oldFilename = req.pathToFilesProvidedOnLastReq![0].split("/").at(-1)
			const ext = path.extname(oldFilename as string)
			const newFileName = `${path.parse(oldFilename as string).name}-${
				user._id
			}${ext}`
			const oldPath = req.pathToFilesProvidedOnLastReq![0]
			const newPath = path.resolve(`./static/uploads/user/${newFileName}`)

			await fs.rename(oldPath, newPath)

			user.avatarLocation = `/static/uploads/user/${newFileName}`
		} else {
			user.avatarLocation = `/static/defaultAvatar.jpg`
		}

		await user.save()
		const token = createToken(user)

		user.password = ""
		res.status(201).json({ user, token })
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
