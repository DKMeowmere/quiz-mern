import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { UserClient } from "@backend/types/user"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { endLoading, startLoading } from "../../app/features/appSlice"
import { useUtils } from "../../hooks/useUtils"
import { UserProfile } from "./components/userProfile/Index"
import { LoadingScreen } from "../../components/loadingScreen/Index"
import { Container } from "../../components/container/Index"

export function UserProfilePage() {
	const { id } = useParams()
	const dispatch = useAppDispatch()
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const { handleErrorWithAlert } = useUtils()
	const [user, setUser] = useState<UserClient | null>(null)

	useEffect(() => {
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
	}, [])

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

	return <UserProfile user={user} />
}
