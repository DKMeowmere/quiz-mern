import { CustomRequest } from "../types/customRequest.js"
import User from "../models/user.js"
import CustomError from "../types/customError.js"
import env from "../config/envVariables.js"
import { Response } from "express"
import mongoose from "mongoose"
import { userSchema } from "../types/user.js"
import fs from "fs/promises"
import path from "path"
import bcrypt from "bcrypt"
import { createToken } from "../utils/createToken.js"
import { handleControllerError } from "../utils/handleControllerError.js"
import { removeFile } from "../utils/removeFile.js"
import Quiz from "../models/quiz.js"
import jwt, { JwtPayload } from "jsonwebtoken"

export async function getUsers(req: CustomRequest, res: Response) {
	try {
		const { limit } = req.query
		const users = await User.find()
			.sort({ createdAt: -1 })
			.limit(parseInt(limit?.toString() || "0"))

		if (!users) {
			throw new CustomError({
				message: "Nie znaleziono żadnego użytkownika",
				statusCode: 404,
			})
		}

		res.json(users)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}

export async function getUser(req: CustomRequest, res: Response) {
	try {
		const { id } = req.params

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError({ message: "Nie poprawne id", statusCode: 400 })
		}

		const user = await User.findById(id)

		if (!user) {
			throw new CustomError({
				message: "Nie znaleziono użytownika o podanym id",
				statusCode: 404,
			})
		}

		const userQuizes = await Quiz.find({ creatorId: id })
		user.userQuizes = userQuizes

		res.json(user)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}

export async function signUp(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError({
				message: "Błąd podczas walidacji zdjęcia profilowego",
				statusCode: 400,
			})
		}

		if (!req.file) {
			throw new CustomError({
				message: "Nie znaleziono zdjęcia profilowego",
				statusCode: 400,
			})
		}
		const { name, email, biography, password } = req.body

		const result = userSchema.safeParse({ name, email, biography, password })

		if (result.success === false) {
			throw new CustomError({ message: result.error.message, statusCode: 400 })
		}
		const parsedUser = result.data
		const hash = await bcrypt.hash(parsedUser.password, env.SALT_ROUNDS)
		const user = await User.create({ ...parsedUser, password: hash })

		if (!req.pathToFilesProvidedOnLastReq) {
			throw new CustomError({
				message: "Brak ścieżki do pliku zdjęcia profilowego",
				statusCode: 400,
			})
		}

		const oldFilename = req.pathToFilesProvidedOnLastReq[0].split("/").at(-1)
		const ext = path.extname(oldFilename as string)
		const newFileName = `${path.parse(oldFilename as string).name}-${
			user._id
		}${ext}`
		const oldPath = req.pathToFilesProvidedOnLastReq[0]
		const newPath = path.resolve(`./static/uploads/user/${newFileName}`)

		await fs.rename(oldPath, newPath)

		user.avatarLocation = `/static/uploads/user/${newFileName}`
		user.save()
		const token = createToken(user)
		res.status(201).json({ user, token })
	} catch (err) {
		handleControllerError(req, res, err)
	}
}

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
				throw Error("Błąd w logowaniu")
			}

			res.json({
				user,
				token,
			})
			return
		}

		if (!email || !password) {
			throw new CustomError({
				message: "Musisz podać email i hasło",
				statusCode: 400,
			})
		}

		const user = await User.findOne({ email })

		if (!user) {
			throw new CustomError({
				message: "Nie znaleziono użytkownika o podanym emailu",
				statusCode: 404,
			})
		}

		const userQuizes = await Quiz.find({ creatorId: user._id })
		user.userQuizes = userQuizes

		const isProvidedPasswordCorrect = await bcrypt.compare(
			password,
			user.password
		)

		if (!isProvidedPasswordCorrect) {
			throw new CustomError({
				message: "Nie poprawne hasło",
				statusCode: 400,
			})
		}
		const token = createToken(user)
		res.json({ user, token })
	} catch (err) {
		handleControllerError(req, res, err)
	}
}

export async function updateUser(req: CustomRequest, res: Response) {
	try {
		if (!req.isFilesValidationPassed) {
			throw new CustomError({
				message: "Błąd podczas walidacji zdjęcia profilowego",
				statusCode: 400,
			})
		}

		const { id } = req.params
		const { name, biography } = req.body

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError({ message: "Nie poprawne id", statusCode: 400 })
		}

		if (req.user?._id?.toString() !== id) {
			throw new CustomError({
				message: "Możesz tylko zaaktualizować swoje konto",
				statusCode: 403,
			})
		}

		const user = await User.findByIdAndUpdate(
			id,
			{ name, biography },
			{ new: true }
		)

		if (!user) {
			throw new CustomError({
				message: "Nie podano użytkownika o podanym id",
				statusCode: 404,
			})
		}

		const userQuizes = await Quiz.find({ creatorId: user._id })
		user.userQuizes = userQuizes

		if (req.file) {
			if (!req.pathToFilesProvidedOnLastReq) {
				throw new CustomError({
					message: "Brak ścieżki do pliku zdjęcia profilowego",
					statusCode: 400,
				})
			}

			removeFile(path.resolve(`.${user?.avatarLocation}`))

			const oldFilename = req.pathToFilesProvidedOnLastReq[0].split("/").at(-1)
			const ext = path.extname(oldFilename as string)
			const newFileName = `${path.parse(oldFilename as string).name}-${
				user._id
			}${ext}`
			const oldPath = req.pathToFilesProvidedOnLastReq[0]
			const newPath = path.resolve(`./static/uploads/user/${newFileName}`)

			await fs.rename(oldPath, newPath)

			user.avatarLocation = `/static/uploads/user/${newFileName}`
			user.save()
		}

		res.json(user)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}

export async function deleteUser(req: CustomRequest, res: Response) {
	try {
		const { id } = req.params

		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError({ message: "Nie poprawne id", statusCode: 400 })
		}

		if (req.user?._id?.toString() !== id) {
			throw new CustomError({
				message: "Możesz tylko usunąć swoje konto",
				statusCode: 403,
			})
		}

		const user = await User.findByIdAndDelete(id)

		if (!user) {
			throw new CustomError({
				message: "Nie znaleziono użytownika o podanym id",
				statusCode: 404,
			})
		}

		removeFile(path.resolve(`./${user.avatarLocation}`))
		res.json(user)
	} catch (err) {
		handleControllerError(req, res, err)
	}
}
