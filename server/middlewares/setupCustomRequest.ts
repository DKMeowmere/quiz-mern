import { CustomRequest } from "../types/customRequest.js"
import { NextFunction, Response } from "express"

export function setupCustomRequest(
	req: CustomRequest,
	res: Response,
	next: NextFunction
) {
	req.isFilesValidationPassed = true
	req.pathToFilesProvidedOnLastReq = []
	req.pathToFilesAddedOnLastReq = []
	req.user = null
	next()
}
