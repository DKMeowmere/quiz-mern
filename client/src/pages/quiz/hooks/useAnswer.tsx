import { QuestionClient } from "@backend/types/question"
import { AnswerClient } from "@backend/types/answer"
import { useAppDispatch } from "../../../app/config"
import { enqueueAlert } from "../../../app/features/alertSlice"
import {
	addAnswer as addAnswerAction,
	editAnswer,
	removeAnswer as removeAnswerAction,
} from "../../../app/features/quizSlice"
import { useFiles } from "./useFiles"

export function useAnswer() {
	const dispatch = useAppDispatch()
	const { removeAnswerFile } = useFiles()

	function addAnswer(question: QuestionClient) {
		const { answers } = question

		if (question.answers.length === 4) {
			dispatch(
				enqueueAlert({
					body: "Pytanie może maksymalnie zawierać 4 odpowiedzi",
					type: "INFO",
				})
			)
			return
		}

		const newAnswer: AnswerClient = {
			_id: crypto.randomUUID(),
			title: "",
			fileLocation: "",
			isTrue: answers.length === 0 ? true : false,
			type: "TEXT",
		}

		dispatch(addAnswerAction({ questionId: question._id, answer: newAnswer }))
	}

	function updateTitle(
		questionId: string,
		answer: AnswerClient,
		value: string
	) {
		dispatch(editAnswer({ questionId, answer: { ...answer, title: value } }))
	}

	function toogleIsTrue(questionId: string, answer: AnswerClient) {
		dispatch(
			editAnswer({ questionId, answer: { ...answer, isTrue: !answer.isTrue } })
		)
	}

	function toggleImageType(questionId: string, answer: AnswerClient) {
		const { type, fileLocation } = answer

		fileLocation && removeAnswerFile(questionId, answer)
		if (type === "IMAGE") {
			dispatch(
				editAnswer({
					questionId,
					answer: { ...answer, type: "TEXT", fileLocation: null },
				})
			)
		} else {
			dispatch(
				editAnswer({
					questionId,
					answer: { ...answer, type: "IMAGE", fileLocation: null },
				})
			)
		}
	}

	function toggleAudioType(questionId: string, answer: AnswerClient) {
		const { type, fileLocation } = answer

		fileLocation && removeAnswerFile(questionId, answer)
		if (type === "AUDIO") {
			dispatch(
				editAnswer({
					questionId,
					answer: { ...answer, type: "TEXT", fileLocation: null },
				})
			)
		} else {
			dispatch(
				editAnswer({
					questionId,
					answer: { ...answer, type: "AUDIO", fileLocation: null },
				})
			)
		}
	}

	function removeAnswer(questionId: string, answerId: string) {
		dispatch(removeAnswerAction({ questionId, answerId }))
	}

	return {
		addAnswer,
		updateTitle,
		toggleImageType,
		toggleAudioType,
		toogleIsTrue,
		removeAnswer,
	}
}
