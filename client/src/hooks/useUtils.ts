import { useDispatch } from "react-redux"
import mime from "mime"
import { enqueueAlert } from "../app/features/alertSlice"
import { endLoading } from "../app/features/appSlice"
import { DEFAULT_ERROR_MESSAGE, SERVER_URL } from "../app/constants"

export function useUtils() {
	const dispatch = useDispatch()

	async function getFileFromUrl(url?: string, fileName?: string) {
		if (!url || !fileName) {
			return
		}

		//filename have to contain extension
		const res = await fetch(url)
		const ext = fileName.split(".").at(-1)
		const file = new File([await res.blob()], fileName, {
			type: mime.getType(ext || "") || "",
		})

		return file
	}

	function validateFileUrl(url?: string | null) {
		if (!url) {
			return
		}

		if (!url.includes("http")) {
			return `${SERVER_URL}${url}`
		}

		return url
	}

	function getZodErrorMessage(error: string) {
		return JSON.parse(error)[0]?.message || DEFAULT_ERROR_MESSAGE
	}

	function handleErrorWithAlert(err: unknown) {
		const message = err instanceof Error ? err.message : "Nieoczekiwany błąd"

		dispatch(enqueueAlert({ body: message, type: "ERROR" }))
		dispatch(endLoading())
	}

	function handleError() {
		dispatch(endLoading())
	}

	function shuffle(arr: any[]) {
		const newArr = structuredClone(arr)

		for (let i = newArr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			const temp = newArr[i]
			newArr[i] = newArr[j]
			newArr[j] = temp
		}

		return newArr
	}

	return {
		getZodErrorMessage,
		getFileFromUrl,
		handleErrorWithAlert,
		handleError,
		validateFileUrl,
		shuffle,
	}
}
