import { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { quizClientSchema } from "@backend/types/quiz"
import { useAppDispatch, useAppSelector } from "../../../app/config"
import { SERVER_URL } from "../../../app/constants"
import { enqueueAlert } from "../../../app/features/alertSlice"
import { setQuiz } from "../../../app/features/quizSlice"
import { useUtils } from "../../../hooks/useUtils"
import { useFiles } from "./useFiles"

export function useQuiz() {
	const quiz = useAppSelector(state => state.quizGame.quiz)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const token = useAppSelector(state => state.app.token)
	const { getZodErrorMessage, handleErrorWithAlert, getFileFromUrl } =
		useUtils()
	const { removeQuizFile } = useFiles()

	async function handleQuizCreation(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		try {
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

			dispatch(setQuiz(data))
			navigate(`/quiz/${data._id}`)
		} catch (err: any) {
			handleErrorWithAlert(err)
		}
	}

	async function editQuizTitle(value: string) {
		if (!quiz) {
			return
		}

		dispatch(setQuiz({ ...quiz, title: value }))
	}

	async function editQuizDescription(value: string) {
		if (!quiz) {
			return
		}

		dispatch(setQuiz({ ...quiz, description: value }))
	}

	async function clearQuiz() {
		if (!quiz) {
			return
		}

		removeQuizFile()
		dispatch(
			setQuiz({
				...quiz,
				title: "",
				description: "",
				questions: [],
				fileLocation: undefined,
			})
		)
	}

	return { handleQuizCreation, editQuizTitle, editQuizDescription, clearQuiz }
}
