import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../app/config"
import { enqueueAlert } from "../../app/features/alertSlice"
import { useEffect } from "react"

export default function NotFound() {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(enqueueAlert({ type: "ERROR", body: "404 - Nie znaleziono" }))
		dispatch(enqueueAlert({ type: "INFO", body: "Przekierowanie za 2s..." }))

		setTimeout(() => {
			navigate("/")
		}, 2000)
	}, [])

	return null
}
