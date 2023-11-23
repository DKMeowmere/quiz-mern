import { Routes, Route } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./app/config"
import { store } from "./app/store"
import { setTheme } from "./app/features/appSlice"
import { GlobalStyle } from "./app/globalStyle"
import { useLogin } from "./hooks/useLogin"
import { LoginPage } from "./pages/user/Login"
import { Home } from "./pages/home/Index"
import { UserProfilePage } from "./pages/user/UserProfile"
import { CreateAccount } from "./pages/user/CreateAccount"
import { EditAccount } from "./pages/user/EditAccount"
import { CreateQuiz } from "./pages/quiz/CreateQuiz"
import { NotFound } from "./pages/notFoundPage/Index"
import { ErrorBoundary } from "./pages/error/Index"
import { UpdateQuiz } from "./pages/quiz/UpdateQuiz"
import { QuizGame } from "./pages/quiz/QuizGame"
import { Alerts } from "./components/alert/Index"
import { Navbar } from "./components/navbar/Index"
import { LoadingScreen } from "./components/loadingScreen/Index"

export function App() {
	const theme = useAppSelector(state => state.app.theme)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const [cookies] = useCookies()
	const { loginWithToken } = useLogin()
	const dispatch = useAppDispatch()

	useEffect(() => {
		async function login() {
			await loginWithToken()
		}
		if (cookies?.token !== null) {
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
				<Route path="/login" element={<LoginPage />} />
				<Route path="/user/create" element={<CreateAccount />} />
				<Route path="/user/:id/edit" element={<EditAccount />} />
				<Route path="/user/:id" element={<UserProfilePage />} />
				<Route path="/quiz/create" element={<CreateQuiz />} />
				<Route path="/quiz/:id" element={<QuizGame />} />
				<Route path="/quiz/:id/edit" element={<UpdateQuiz />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</ErrorBoundary>
	)
}
