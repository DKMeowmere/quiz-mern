import { Response } from "express"
import env from "../config/envVariables"
import CustomError from "../types/customError"
import { CustomRequest } from "../types/customRequest"
import { removeFiles } from "./removeFile"

export async function handleControllerError(
	req: CustomRequest,
	res: Response,
	err: unknown
) {
	env.NODE_ENV === "development" && console.log(err)

  await removeFiles(req.pathToFilesProvidedOnLastReq || [])
	if (err instanceof CustomError) {
		res.status(err.statusCode).json({ error: err.message })
	} else {
		res.status(400).json({ error: env.UNIVERSAL_ERROR_MESSAGE })
	}
}
