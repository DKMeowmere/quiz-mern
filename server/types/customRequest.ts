import { Request as RequestType } from "express"

//zod does not support type extension
export interface CustomRequest extends RequestType {
	isFilesValidationPassed?: boolean
	pathToFilesProvidedOnLastReq?: string[]
	pathToFilesAddedOnLastReq?: string[]
}
