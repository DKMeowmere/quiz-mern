import fs from "fs/promises"

export async function doFileExists(path: string) {
	try {
		await fs.access(path)
		return true
	} catch {
		return false
	}
}
