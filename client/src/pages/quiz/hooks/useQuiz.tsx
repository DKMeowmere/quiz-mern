import { useAppDispatch, useAppSelector } from "../../../app/config"
import {  setQuiz } from "../../../app/features/quizSlice"
import { useFiles } from "./useFiles"

export function useQuiz() {
	const quiz = useAppSelector(state => state.quizGame.quiz)
	const dispatch = useAppDispatch()
	const { removeQuizFile } = useFiles()

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

	return {
		editQuizTitle,
		editQuizDescription,
		clearQuiz,
	}
}
