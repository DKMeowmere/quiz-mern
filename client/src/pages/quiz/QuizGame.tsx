import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { reset, setQuiz } from "../../app/features/quizSlice"
import { SERVER_URL } from "../../app/constants"
import { endLoading, startLoading } from "../../app/features/appSlice"
import { useUtils } from "../../hooks/useUtils"
import { LoadingScreen } from "../../components/loadingScreen/Index"
import { Container } from "../../components/container/Index"
import { QuizGameWrapper } from "./components/quizGameWrapper/Index"

export function QuizGame() {
	const quiz = useAppSelector(state => state.quizGame.quiz)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const { id } = useParams()
	const { handleErrorWithAlert } = useUtils()
	const dispatch = useAppDispatch()

	useEffect(() => {
		async function getQuiz() {
			try {
				dispatch(setQuiz(null))
				dispatch(startLoading())

				const res = await fetch(`${SERVER_URL}/api/quiz/${id}`)
				const data = await res.json()

				if (!res.ok) {
					throw new Error(data.message)
				}

				dispatch(setQuiz(data))
				dispatch(reset())
				dispatch(endLoading())
			} catch (err: any) {
				handleErrorWithAlert(err)
			}
		}
		getQuiz()
	}, [])

	if (isAppLoading) {
		return <LoadingScreen />
	}

	if (!quiz) {
		return (
			<Container>
				<h1>Nie znaleziono quizu!</h1>
			</Container>
		)
	}

	return <QuizGameWrapper quiz={quiz} />
}
