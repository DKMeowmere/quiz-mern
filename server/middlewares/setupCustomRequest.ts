import { NextFunction, Response } from "express"
import { CustomRequest } from "../types/customRequest"

export function setupCustomRequest(
	req: CustomRequest,
	res: Response,
	next: NextFunction
) {
	req.isFilesValidationPassed = true
	req.pathToFilesProvidedOnLastReq = []
	req.pathToFilesAddedOnLastReq = new Set()
	req.user = null
	next()
}
