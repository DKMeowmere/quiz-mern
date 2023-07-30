import { useDispatch } from "react-redux"
import { enqueueAlert } from "../app/features/alertSlice"
import { endLoading } from "../app/features/appSlice"

export default function useUtils() {
	const dispatch = useDispatch()

	function handleErrorWithAlert(err: unknown) {
		const message = err instanceof Error ? err.message : "Nieoczekiwany błąd"

		dispatch(enqueueAlert({ body: message, type: "ERROR" }))
		dispatch(endLoading())
	}

	function handleError() {
		dispatch(endLoading())
	}

	return { handleErrorWithAlert, handleError }
}
