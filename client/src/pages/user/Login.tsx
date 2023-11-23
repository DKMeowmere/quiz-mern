import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/config"
import { LoginForm } from "./components/loginForm/Index"

export function LoginPage() {
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const navigate = useNavigate()

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/")
		}
	}, [])

	return <LoginForm />
}
