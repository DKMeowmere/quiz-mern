import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useAppDispatch } from "../app/config"
import { enqueueAlert } from "../app/features/alertSlice"
import {
	endLoading,
	login,
	setToken,
	startLoading,
	logout as logoutAction,
} from "../app/features/appSlice"
import { useUtils } from "./useUtils"

export function useLogin() {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [cookies, setCookies] = useCookies()
	const { handleErrorWithAlert, handleError } = useUtils()

	async function loginWithEmail(email: string, password: string) {
		try {
			if (!email) {
				throw new Error("Wprowadź email")
			}

			if (!password) {
				throw new Error("Wprowadź hasło")
			}

			const body = JSON.stringify({
				email,
				password,
			})

			dispatch(startLoading())
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/api/user/login`,
				{
					body,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			)

			const { user, token, error } = await res.json()

			dispatch(endLoading())
			if (!res.ok) {
				throw new Error(error)
			}

			dispatch(
				enqueueAlert({ body: "Zalogowano się pomyślnie", type: "SUCCESS" })
			)
			dispatch(setToken(token))
			dispatch(login(user))
			setCookies("token", token, { path: "/" })

			navigate("/")
		} catch (err: unknown) {
			handleErrorWithAlert(err)
		}
	}

	async function loginWithToken() {
		try {
			dispatch(startLoading())
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/api/user/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						authorization: `Bearer ${cookies.token}`,
					},
				}
			)

			const { user, token, error } = await res.json()
			dispatch(endLoading())

			if (!res.ok) {
				throw new Error(error)
			}

			dispatch(setToken(token))
			dispatch(login(user))
			setCookies("token", token, { path: "/" })
		} catch (err: unknown) {
			handleError()
			setCookies("token", null, { path: "/" })
		}
	}

	function logout() {
		dispatch(logoutAction())
		setCookies("token", null, { path: "/" })
	}

	return { loginWithEmail, loginWithToken, logout }
}
