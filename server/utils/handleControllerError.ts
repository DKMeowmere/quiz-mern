import { Response } from "express"
import { CustomError } from "../types/customError.js"
import { CustomRequest } from "../types/customRequest.js"
import { env } from "../config/envVariables.js"
import { universalError } from "../config/constants/universalErrors.js"
import { removeFiles } from "./removeFile.js"

export async function handleControllerError(
	req: CustomRequest,
	res: Response,
	err: unknown
) {
	env.NODE_ENV === "development" && console.log(err)

	await removeFiles(req.pathToFilesProvidedOnLastReq!)
	if (err instanceof CustomError) {
		res.status(err.statusCode).json({ error: err.message })
	} else if (env.NODE_ENV === "development" || env.NODE_ENV === "test") {
		res.status(universalError.statusCode).json({
			error: err instanceof Error ? err.message : universalError.message,
		})
	} else {
		res
			.status(universalError.statusCode)
			.json({ error: universalError.message })
	}
}
