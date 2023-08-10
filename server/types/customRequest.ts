import { Request as RequestType } from "express"
import { User as UserType } from "./user.js"

//zod does not support type extension
export interface CustomRequest extends RequestType {
	isFilesValidationPassed?: boolean
	pathToFilesProvidedOnLastReq?: string[]
	pathToFilesAddedOnLastReq?: Set<string>
	user?: UserType | null
}
