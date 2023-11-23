import { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { QuestionClient, QuestionClientSchema } from "@backend/types/question"
import { quizClientSchema, quizOnlySchema } from "@backend/types/quiz"
import { useAppDispatch, useAppSelector } from "../../../app/config"
import {
	closeModal,
	setQuiz,
	removeQuestion as removeQuestionAction,
	addQuestion as addQuestionAction,
} from "../../../app/features/quizSlice"
import { enqueueAlert } from "../../../app/features/alertSlice"
import { endLoading, startLoading } from "../../../app/features/appSlice"
import { SERVER_URL } from "../../../app/constants"
import { useUtils } from "../../../hooks/useUtils"

export function useQuizRequests() {
	const dispatch = useAppDispatch()
	const quiz = useAppSelector(state => state.quizGame.quiz)
	const token = useAppSelector(state => state.app.token)
	const { getZodErrorMessage, getFileFromUrl, handleErrorWithAlert } =
		useUtils()
	const navigate = useNavigate()

	async function handleQuizCreation(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		try {
			dispatch(startLoading())
			const result = quizClientSchema.safeParse(quiz)

			if (!result.success) {
				throw new Error(getZodErrorMessage(result.error.message))
			}

			if (!quiz) {
				throw new Error("Quiz is null")
			}

			const { data: parsedQuiz } = result
			const files: File[] = []

			if (!quiz.fileLocation) {
				dispatch(
					enqueueAlert({ type: "ERROR", body: "Brak zdjęcia głównego quizu" })
				)
				return
			}

			const quizFile = await getFileFromUrl(
				quiz.fileLocation,
				quiz.originalFileName
			)

			quizFile && files.push(quizFile)
			parsedQuiz.fileLocation = quiz.originalFileName

			for (let i = 0; i < parsedQuiz.questions.length; i++) {
				const question = parsedQuiz.questions[i]

				const questionFile = await getFileFromUrl(
					question.fileLocation || "",
					question.originalFileName
				)
				question.fileLocation = question.originalFileName || null
				questionFile && files.push(questionFile)

				for (let j = 0; j < question.answers.length; j++) {
					const answer = question.answers[j]
					const answerFile = await getFileFromUrl(
						answer.fileLocation || "",
						answer.originalFileName
					)
					answer.fileLocation = answer.originalFileName || null
					answerFile && files.push(answerFile)
				}
			}

			const formData = new FormData()

			const questionsWithoutIds = parsedQuiz.questions.map(question => ({
				...question,
				_id: undefined,
				answers: question.answers.map(answer => ({
					...answer,
					_id: undefined,
				})),
			}))
			formData.append("title", parsedQuiz.title)
			formData.append("description", parsedQuiz.description)
			formData.append("fileLocation", parsedQuiz.fileLocation || "")
			formData.append("questions", JSON.stringify(questionsWithoutIds))

			files.forEach(file => {
				formData.append("files", file)
			})

			const res = await fetch(`${SERVER_URL}/api/quiz`, {
				method: "POST",
				body: formData,
				headers: {
					authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}

			dispatch(endLoading())
			dispatch(setQuiz(data))
			navigate(`/quiz/${data._id}`)
		} catch (err: any) {
			handleErrorWithAlert(err)
			dispatch(endLoading())
		}
	}

	async function handleQuizUpdating(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		try {
			dispatch(startLoading())
			const result = quizOnlySchema.safeParse(quiz)

			if (!result.success) {
				throw new Error(getZodErrorMessage(result.error.message))
			}

			if (!quiz) {
				throw new Error("Quiz is null")
			}

			const { data: parsedQuiz } = result

			if (!quiz.fileLocation) {
				dispatch(
					enqueueAlert({ type: "ERROR", body: "Brak zdjęcia głównego quizu" })
				)
				return
			}

			const quizFile = await getFileFromUrl(
				quiz.fileLocation,
				quiz.originalFileName
			)

			const formData = new FormData()

			formData.append("title", parsedQuiz.title)
			formData.append("description", parsedQuiz.description)
			quizFile && formData.append("file", quizFile)

			const res = await fetch(`${SERVER_URL}/api/quiz/${quiz._id}`, {
				method: "PATCH",
				body: formData,
				headers: {
					authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}

			dispatch(setQuiz(data))
			dispatch(closeModal())
			dispatch(
				enqueueAlert({
					type: "SUCCESS",
					body: "Zaaktualizowano quiz pomyślnie",
				})
			)
			dispatch(endLoading())
		} catch (err: any) {
			dispatch(endLoading())
			handleErrorWithAlert(err)
		}
	}

	async function handleQuizDeletion() {
		try {
			dispatch(startLoading())

			if (!quiz) {
				throw new Error("Quiz is null")
			}

			const res = await fetch(`${SERVER_URL}/api/quiz/${quiz._id}`, {
				method: "DELETE",
				headers: {
					authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}

			dispatch(setQuiz(null))
			dispatch(
				enqueueAlert({
					type: "SUCCESS",
					body: "Usunięto quiz pomyślnie",
				})
			)
			navigate("/")
			dispatch(endLoading())
		} catch (err: any) {
			dispatch(endLoading())
			handleErrorWithAlert(err)
		}
	}

	async function handleQuestionCreation(question: QuestionClient) {
		try {
			dispatch(startLoading())

			if (!quiz) {
				return
			}

			const result = QuestionClientSchema.safeParse(question)
			if (!result.success) {
				throw new Error(getZodErrorMessage(result.error.message))
			}
			const { data: parsedQuestion } = result

			const files: File[] = []
			const questionFile = await getFileFromUrl(
				question.fileLocation || undefined,
				question.originalFileName
			)

			questionFile && files.push(questionFile)
			parsedQuestion.fileLocation = question.originalFileName || null

			for (let i = 0; i < parsedQuestion.answers.length; i++) {
				const answer = parsedQuestion.answers[i]
				const answerFile = await getFileFromUrl(
					answer.fileLocation || "",
					answer.originalFileName
				)
				answer.fileLocation = answer.originalFileName || null
				answerFile && files.push(answerFile)
			}

			const answersWithoutIds = parsedQuestion.answers.map(answer => ({
				...answer,
				_id: undefined,
			}))

			const formData = new FormData()
			formData.append("title", parsedQuestion.title)
			formData.append("type", parsedQuestion.type)
			formData.append("fileLocation", parsedQuestion.fileLocation || "")
			formData.append("answers", JSON.stringify(answersWithoutIds))
			files.forEach(file => {
				formData.append("files", file)
			})

			const res = await fetch(`${SERVER_URL}/api/quiz/${quiz._id}`, {
				method: "POST",
				body: formData,
				headers: {
					authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}

			//replace thhe old question with server responcse
			dispatch(removeQuestionAction(parsedQuestion._id))
			dispatch(addQuestionAction(data))
			dispatch(
				enqueueAlert({
					type: "SUCCESS",
					body: "Dodano pytanie pomyślnie",
				})
			)
			dispatch(endLoading())
			dispatch(closeModal())
		} catch (err: any) {
			handleErrorWithAlert(err)
			dispatch(endLoading())
		}
	}

	async function handleQuestionDeletion(question: QuestionClient) {
		try {
			dispatch(startLoading())

			if (!quiz) {
				throw new Error("Quiz is null")
			}

			const res = await fetch(
				`${SERVER_URL}/api/quiz/${quiz._id}/${question._id}`,
				{
					method: "DELETE",
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}

			dispatch(removeQuestionAction(question._id))
			dispatch(
				enqueueAlert({
					type: "SUCCESS",
					body: "Usunięto pytanie pomyślnie",
				})
			)
			dispatch(endLoading())
		} catch (err: any) {
			dispatch(endLoading())
			handleErrorWithAlert(err)
		}
	}

	return {
		handleQuizCreation,
		handleQuizUpdating,
		handleQuizDeletion,
		handleQuestionCreation,
		handleQuestionDeletion,
	}
}
