import { Routes, Route } from "react-router-dom"
import Home from "./pages/home/Index"
import Alerts from "./components/alert/Index"
import Navbar from "./components/navbar/Index"
import GlobalStyle from "./app/globalStyle"
import { useAppDispatch, useAppSelector } from "./app/config"
import LoadingScreen from "./components/loadingScreen/Index"
import Login from "./pages/login/Index"
import { useCookies } from "react-cookie"
import useLogin from "./hooks/useLogin"
import { useEffect } from "react"
import { setTheme, setToken } from "./app/features/appSlice"
import Profile from "./pages/profile/Index"
import store from "./app/store"
import CreateAccount from "./pages/createAccount/Index"
import EditAccount from "./pages/editAccount/Index"

function App() {
	const theme = useAppSelector(state => state.app.theme)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const [cookies] = useCookies()
	const { loginWithToken } = useLogin()
	const dispatch = useAppDispatch()

	async function login() {
		await loginWithToken()
		dispatch(setToken(cookies.token))
	}

	useEffect(() => {
		if (cookies.token) {
			login()
		}
		if (localStorage.getItem("theme")) {
			dispatch(setTheme(localStorage.getItem("theme") || "LIGHT"))
		}
	}, [])

	if (window.Cypress) {
		window.store = store
	}

	return (
		<>
			<GlobalStyle bgColor={theme.colors.mainBg} />
			{isAppLoading && <LoadingScreen />}
			<Navbar />
			<Alerts />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/user/create" element={<CreateAccount />} />
				<Route path="/user/:id/edit" element={<EditAccount />} />
				<Route path="/user/:id" element={<Profile />} />
			</Routes>
		</>
	)
}

export default App
