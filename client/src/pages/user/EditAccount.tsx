import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { endLoading, setUser, startLoading } from "../../app/features/appSlice"
import { UserForm } from "./components/userForm/Index"
import { LoadingScreen } from "../../components/loadingScreen/Index"
import { useUtils } from "../../hooks/useUtils"
import { Container } from "../../components/container/Index"

export function EditAccount() {
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const user = useAppSelector(state => state.app.user)
	const dispatch = useAppDispatch()
	const [cookies] = useCookies()
	const { id } = useParams()
	const { handleErrorWithAlert } = useUtils()

	useEffect(() => {
		if (!isLoggedIn) {
			return
		}

		async function getUser() {
			try {
				dispatch(startLoading())
				const res = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/api/user/${id}`
				)
				const data = await res.json()

				if (data.error) {
					throw new Error(data.error)
				}

				setUser(data)
				dispatch(endLoading())
			} catch (err: unknown) {
				handleErrorWithAlert(err)
			}
		}
		getUser()

		return () => {
			setUser(JSON.parse(cookies.user || "null"))
		}
	}, [])

	if (!isLoggedIn) {
		return (
			<Container>
				<h1>Musisz być zalogowany</h1>
			</Container>
		)
	}

	if (isAppLoading) {
		return <LoadingScreen />
	}

	if (!user) {
		return (
			<Container>
				<h1>Błąd podczas wczytywania użytkownika</h1>
			</Container>
		)
	}

	return <UserForm type="UPDATE" user={user} />
}
