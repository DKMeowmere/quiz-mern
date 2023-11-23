import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../app/config"
import { enqueueAlert } from "../app/features/alertSlice"
import {
	endLoading,
	login,
	setToken,
	setUser,
	startLoading,
} from "../app/features/appSlice"
import { useUtils } from "./useUtils"
import { UserClient } from "@backend/types/user"

export function useSignUp() {
	const dispatch = useAppDispatch()
	const [, setCookies] = useCookies()
	const navigate = useNavigate()
	const { handleErrorWithAlert, getFileFromUrl } = useUtils()

	async function signUp({
		name,
		email,
		password,
		biography,
		avatarLocation,
	}: UserClient) {
		try {
			if (!name) {
				throw new Error("Wprowadź nazwe")
			}

			if (!email) {
				throw new Error("Wprowadź email")
			}

			if (!password) {
				throw new Error("Wprowadź hasło")
			}

			const avatar = await getFileFromUrl(avatarLocation, "avatar.png")

			if (!avatar) {
				throw new Error("Podaj zdjęcie profilowe")
			}

			const formData = new FormData()

			formData.append("name", name)
			formData.append("email", email)
			formData.append("password", password)
			formData.append("biography", biography)
			formData.append("avatar", avatar)

			dispatch(startLoading())
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user`, {
				body: formData,
				method: "POST",
			})

			const { user, token, error } = await res.json()

			if (!res.ok) {
				throw new Error(error)
			}

			dispatch(
				enqueueAlert({ body: "Zalogowano się pomyślnie", type: "SUCCESS" })
			)
			dispatch(setToken(token))
			dispatch(login())
			dispatch(setUser(user))
			setCookies("token", token, { path: "/" })
			dispatch(endLoading())

			navigate("/")
		} catch (err: unknown) {
			handleErrorWithAlert(err)
		}
	}

	return { signUp }
}
