import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { initQuiz } from "../../app/features/quizSlice"
import { LoadingScreen } from "../../components/loadingScreen/Index"
import { QuizForm } from "./components/quizForm/Index"
import { Container } from "../../components/container/Index"

export function CreateQuiz() {
	const quiz = useAppSelector(state => state.quizGame.quiz)
	const user = useAppSelector(state => state.app.user)
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!isLoggedIn || !user) {
			return
		}

		dispatch(initQuiz(user._id))
	}, [user, isLoggedIn])

	if (isAppLoading) {
		return <LoadingScreen />
	}

	if (!isLoggedIn) {
		return (
			<Container>
				<h1>Musisz być zalogowany by to zrobić</h1>
			</Container>
		)
	}

	if (!quiz) {
		return (
			<Container>
				<h1>Błąd podczas inicjalizacji quizu</h1>
			</Container>
		)
	}

	return <QuizForm quiz={quiz} type="CREATE" />
}
