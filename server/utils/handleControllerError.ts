import { Response } from "express"
import env from "../config/envVariables.js"
import CustomError from "../types/customError.js"
import { CustomRequest } from "../types/customRequest.js"
import { removeFiles } from "./removeFile.js"

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
