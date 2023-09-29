import { QuestionClient } from "@backend/types/question"
import { useAppDispatch } from "../../../app/config"
import {
	closeModal,
	editQuestion,
	openModal,
	addQuestion as addQuestionAction,
	removeQuestion as removeQuestionAction,
} from "../../../app/features/quizSlice"
import { useFiles } from "./useFiles"

export function useQuestion() {
	const dispatch = useAppDispatch()
	const { removeQuestionFile } = useFiles()

	function addQuestion() {
		const newQuestion: QuestionClient = {
			_id: crypto.randomUUID(),
			answers: [],
			fileLocation: "",
			title: "",
			type: "TEXT",
		}

		dispatch(addQuestionAction(newQuestion))
		dispatch(openModal(newQuestion))
	}

	function editQuestionTitle(question: QuestionClient, value: string) {
		dispatch(editQuestion({ ...question, title: value }))
	}

	function getProcessedQuestionTitle(title: string) {
		if (!title) {
			return <i>Brak tytułu pytania</i>
		}

		if (title.length > 22) {
			return `${title.slice(0, 20)}...`
		}
    
		return title
	}

	function toggleImageType(question: QuestionClient) {
		const { type, fileLocation } = question

		fileLocation && removeQuestionFile(question)
		if (type === "IMAGE") {
			dispatch(editQuestion({ ...question, type: "TEXT", fileLocation: null }))
		} else {
			dispatch(editQuestion({ ...question, type: "IMAGE" }))
		}
	}

	function toggleAudioType(question: QuestionClient) {
		const { type, fileLocation } = question

		fileLocation && removeQuestionFile(question)
		if (type === "AUDIO") {
			dispatch(editQuestion({ ...question, type: "TEXT", fileLocation: null }))
		} else {
			dispatch(editQuestion({ ...question, type: "AUDIO" }))
		}
	}

	function removeQuestion(question: QuestionClient) {
		dispatch(removeQuestionAction(question._id))
		dispatch(closeModal())
	}

	return {
		addQuestion,
		editQuestionTitle,
		getProcessedQuestionTitle,
		toggleImageType,
		toggleAudioType,
		removeQuestion,
	}
}
