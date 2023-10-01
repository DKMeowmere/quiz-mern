import { QuestionClient } from "@backend/types/question"
import { AnswerClient } from "@backend/types/answer"
import { useAppDispatch, useAppSelector } from "../../../app/config"
import { enqueueAlert } from "../../../app/features/alertSlice"
import {
	editAnswer,
	editQuestion,
	setQuiz,
} from "../../../app/features/quizSlice"

export function useFiles() {
	const quiz = useAppSelector(state => state.quizGame.quiz)
	const dispatch = useAppDispatch()

	function addQuizFile(files: FileList | null) {
		if (!files || !files[0] || !quiz) {
			return
		}
		const file = files[0]
		const fileExt = file.name.split(".").pop() || ""
		const acceptedExts = new Set(["jpg", "png", "jpeg"])

		if (!acceptedExts.has(fileExt)) {
			dispatch(
				enqueueAlert({
					body: "Plik musi mieć rozszerzenie .png, .jpg albo .jpeg",
					type: "ERROR",
				})
			)
			return
		}

		const url = URL.createObjectURL(file) || null
		dispatch(
			setQuiz({
				...quiz,
				fileLocation: url,
				originalFileName: `${crypto.randomUUID()}-${file.name}`,
			})
		)
	}

	function removeQuizFile() {
		if (!quiz?.fileLocation) {
			return
		}

		URL.revokeObjectURL(quiz.fileLocation)
		dispatch(
			setQuiz({ ...quiz, fileLocation: null, originalFileName: undefined })
		)
	}

	function addQuestionFile(question: QuestionClient, files: FileList | null) {
		if (!files || !files[0] || !quiz) {
			return
		}
		const file = files[0]
		const ext = file.name.split(".").pop() || ""
		const imagePossibleExts = new Set(["jpg", "png", "jpeg"])
		const audioPossibleExts = new Set(["mp3"])

		if (question.type === "IMAGE" && !imagePossibleExts.has(ext)) {
			dispatch(
				enqueueAlert({
					body: "Złe rozszerzenie pliku - możliwe: .jpg, .png, .jpeg",
					type: "ERROR",
				})
			)
			return
		}

		if (question.type === "AUDIO" && !audioPossibleExts.has(ext)) {
			dispatch(
				enqueueAlert({
					body: "Złe rozszerzenie pliku - możliwe: .mp3",
					type: "ERROR",
				})
			)
			return
		}

		const newName = `${crypto.randomUUID()}-${file.name}`
		const newFile = new File([file], newName)

		const url = URL.createObjectURL(newFile) || null
		dispatch(
			editQuestion({
				...question,
				fileLocation: url,
				originalFileName: `${crypto.randomUUID()}-${file.name}`,
			})
		)
	}

	function removeQuestionFile(question: QuestionClient) {
		if (!question?.fileLocation) {
			return
		}

		URL.revokeObjectURL(question.fileLocation)
		dispatch(
			editQuestion({
				...question,
				fileLocation: null,
				originalFileName: undefined,
			})
		)
	}

	function addAnswerFile(
		questionId: string,
		answer: AnswerClient,
		files: FileList | null
	) {
		if (!files || !files[0] || !quiz) {
			return
		}
		if (answer.type === "TEXT") {
			dispatch(
				enqueueAlert({
					body: "Nie można dodać pliku do odpowiedzi tekstowej",
					type: "INFO",
				})
			)
		}

		const file = files[0]
		const ext = file.name.split(".").pop() || ""
		const imagePossibleExts = new Set(["jpg", "png", "jpeg"])
		const audioPossibleExts = new Set(["mp3"])

		if (answer.type === "IMAGE" && !imagePossibleExts.has(ext)) {
			dispatch(
				enqueueAlert({
					body: "Złe rozszerzenie pliku - możliwe: .jpg, .png, .jpeg",
					type: "ERROR",
				})
			)
			return
		}

		if (answer.type === "AUDIO" && !audioPossibleExts.has(ext)) {
			dispatch(
				enqueueAlert({
					body: "Złe rozszerzenie pliku - możliwe: .mp3",
					type: "ERROR",
				})
			)
			return
		}

		const newName = `${crypto.randomUUID()}-${file.name}`
		const newFile = new File([file], newName)

		const url = URL.createObjectURL(newFile) || null
		dispatch(
			editAnswer({
				questionId,
				answer: {
					...answer,
					fileLocation: url,
					originalFileName: `${crypto.randomUUID()}-${file.name}`,
				},
			})
		)
	}

	function removeAnswerFile(questionId: string, answer: AnswerClient) {
		if (!answer?.fileLocation) {
			return
		}

		URL.revokeObjectURL(answer.fileLocation)
		dispatch(
			editAnswer({
				questionId,
				answer: { ...answer, fileLocation: null, originalFileName: undefined },
			})
		)
	}

	return {
		addQuizFile,
		removeQuizFile,
		addQuestionFile,
		removeQuestionFile,
		addAnswerFile,
		removeAnswerFile,
	}
}
