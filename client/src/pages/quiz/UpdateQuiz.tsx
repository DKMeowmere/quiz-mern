import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { SERVER_URL } from "../../app/constants"
import { LoadingScreen } from "../../components/loadingScreen/Index"
import { QuizForm } from "./components/quizForm/Index"
import { useNavigate, useParams } from "react-router-dom"
import { quizClientSchema } from "@backend/types/quiz"
import { useUtils } from "../../hooks/useUtils"
import { setQuiz } from "../../app/features/quizSlice"
import { endLoading, startLoading } from "../../app/features/appSlice"
import { Container } from "../../components/container/Index"

export function UpdateQuiz() {
	const quiz = useAppSelector(state => state.quizGame.quiz)
	const user = useAppSelector(state => state.app.user)
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const dispatch = useAppDispatch()
	const { id } = useParams()
	const navigate = useNavigate()
	const { handleErrorWithAlert, getZodErrorMessage } = useUtils()

	useEffect(() => {
		async function getQuiz() {
			try {
				if (!isLoggedIn || !user) {
					return
				}

        dispatch(startLoading())
				const res = await fetch(`${SERVER_URL}/api/quiz/${id}`)
				const data = await res.json()

				if (!res.ok) {
					throw new Error(data.error)
				}

				const result = quizClientSchema.safeParse(data)

				if (!result.success) {
					throw new Error(getZodErrorMessage(result.error.message))
				}
				const { data: parsedQuiz } = result

				if (parsedQuiz.creatorId !== user?._id) {
					throw new Error(
						"Nie możesz edytować quizu, który nie należy do ciebie"
					)
				}

				dispatch(setQuiz(parsedQuiz))
				dispatch(endLoading())
			} catch (err: any) {
				handleErrorWithAlert(err)
				navigate("/")
			}
		}
		getQuiz()
	}, [user, isLoggedIn])

	if (isAppLoading) {
		return <LoadingScreen />
	}

	if (!isLoggedIn || !user) {
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

	return <QuizForm quiz={quiz} type="UPDATE" />
}
