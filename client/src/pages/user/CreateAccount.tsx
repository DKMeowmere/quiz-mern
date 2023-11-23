import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { UserForm } from "./components/userForm/Index"
import { LoadingScreen } from "../../components/loadingScreen/Index"
import { setUser } from "../../app/features/appSlice"
import { useCookies } from "react-cookie"

export function CreateAccount() {
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const user = useAppSelector(state => state.app.user)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [cookies] = useCookies()

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/")
		}

		dispatch(
			setUser({
				_id: crypto.randomUUID(),
				name: "",
				email: "",
				biography: "",
				password: "",
				userQuizes: [],
			})
		)

		return () => {
			setUser(JSON.parse(cookies?.user || "null"))
		}
	}, [])

	if (!user) {
		return <LoadingScreen />
	}

	return <UserForm type="CREATE" user={user} />
}
