import fs from "fs/promises"
import { doFileExists } from "../utils/doFileExists.js"

export async function removeFile(path: string) {
	if (await doFileExists(path)) {
		await fs.unlink(path)
	}
}

export async function removeFiles(paths: string[]) {
	paths.forEach(async path => {
		if (await doFileExists(path)) {
			await fs.unlink(path)
		}
	})
}
