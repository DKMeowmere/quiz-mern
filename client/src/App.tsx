import { Routes, Route } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./app/config"
import store from "./app/store"
import { setTheme, setToken } from "./app/features/appSlice"
import GlobalStyle from "./app/globalStyle"
import useLogin from "./hooks/useLogin"
import Alerts from "./components/alert/Index"
import Navbar from "./components/navbar/Index"
import LoadingScreen from "./components/loadingScreen/Index"
import Login from "./pages/login/Index"
import Home from "./pages/home/Index"
import Profile from "./pages/profile/Index"
import CreateAccount from "./pages/createAccount/Index"
import EditAccount from "./pages/editAccount/Index"
import { CreateQuiz } from "./pages/quiz/CreateQuiz"
import NotFound from "./pages/notFoundPage/Index"
import ErrorBoundary from "./pages/error/Index"

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
		<ErrorBoundary>
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
				<Route path="/quiz/create" element={<CreateQuiz />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</ErrorBoundary>
	)
}

export default App
