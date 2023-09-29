import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ErrorPageContainer } from "./styles"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { setQuiz } from "../../app/features/quizSlice"
import useLogin from "../../hooks/useLogin"
import { Button } from "../../components/button/Button"

export default function ErrorPage() {
	const isUserLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const [hasUserBeenLoggedIn, setHasUserBeenLoggedIn] = useState(false)
	const theme = useAppSelector(state => state.app.theme)
	const dispatch = useAppDispatch()
	const { logout } = useLogin()

	useEffect(() => {
		if (isUserLoggedIn) {
			setHasUserBeenLoggedIn(true)
			logout()
		}
	}, [isUserLoggedIn])

	useEffect(() => {
		dispatch(setQuiz(null))
	}, [])

	return (
		<ErrorPageContainer>
			<h1>Krytyczny błąd</h1>
			{hasUserBeenLoggedIn && <h2>Nastąpiło wylogowanie</h2>}
			<Link to="/">
				<Button
					bgColor={theme.colors.errorMain}
					textColor="#fff"
					height="70px"
					width="400px"
					onClick={() =>
						setTimeout(() => {
							location.reload()
						}, 500)
					}
				>
					Wróć do strony głównej
				</Button>
			</Link>
		</ErrorPageContainer>
	)
}
