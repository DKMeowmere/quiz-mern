import { CustomRequest } from "../types/customRequest.js"
import { removeFile } from "./removeFile.js"

export async function removeUnusedFiles(req: CustomRequest) {
	req.pathToFilesProvidedOnLastReq!.forEach(async path => {
		if (!req.pathToFilesAddedOnLastReq!.has(path)) {
			await removeFile(path)
		}
	})
}
