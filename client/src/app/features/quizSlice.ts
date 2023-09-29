import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { QuizGameState } from "@backend/types/client/quizState"
import { QuizClient } from "@backend/types/quiz"
import { AnswerClient } from "@backend/types/answer"
import { QuestionClient } from "@backend/types/question"

const initialState: QuizGameState = {
	quiz: null,
	timer: 0,
	userPoints: 0,
	isGameStarted: false,
	form: {
		isQuestionModalOpen: false,
		modalQuestionId: "",
	},
}

const quizGameSlice = createSlice({
	initialState,
	name: "quiz",
	reducers: {
		reset: state => {
			state.quiz = null
			state.timer = 0
			state.userPoints = 0
			state.isGameStarted = false
		},
		initQuiz: (state, action: PayloadAction<string>) => {
			const creatorId = action.payload

			state.quiz = {
				_id: crypto.randomUUID(),
				creatorId,
				questions: [],
				title: "",
				description: "",
				fileLocation: undefined,
				originalFileName: undefined,
			}
		},
		setQuiz: (state, action: PayloadAction<QuizClient | null>) => {
			const quiz = action.payload

			state.quiz = quiz
		},
		startGame: state => {
			state.isGameStarted = true
		},
		answerQuestion: (state, action: PayloadAction<AnswerClient>) => {
			const answer = action.payload

			if (answer.isTrue) {
				state.userPoints++
			}
		},
		endGame: state => {
			state.isGameStarted = false
		},
		addQuestion: (state, action: PayloadAction<QuestionClient>) => {
			if (!state.quiz) {
				throw new Error("Quiz is null")
			}

			const question = action.payload

			state.quiz.questions.push(question)
		},
		editQuestion: (state, action: PayloadAction<QuestionClient>) => {
			if (!state.quiz) {
				throw new Error("Quiz is null")
			}
			const question = action.payload
			const questionIndex = state.quiz.questions.findIndex(
				({ _id }) => question._id === _id
			)

			if (questionIndex === -1) {
				throw new Error("No question with given id")
			}

			state.quiz.questions[questionIndex] = question
		},
		removeQuestion: (state, action: PayloadAction<string>) => {
			if (!state.quiz) {
				throw new Error("Quiz is null")
			}

			const questionId = action.payload

			state.quiz.questions = state.quiz.questions.filter(
				question => question._id !== questionId
			)
		},
		addAnswer: (
			state,
			action: PayloadAction<{ questionId: string; answer: AnswerClient }>
		) => {
			if (!state.quiz) {
				throw new Error("Quiz is null")
			}

			const questionId = action.payload.questionId
			const answer = action.payload.answer

			const questionIndex = state.quiz.questions.findIndex(
				({ _id }) => _id === questionId
			)

			if (questionIndex === -1) {
				throw new Error("No question with given id")
			}

			state.quiz.questions[questionIndex].answers.push(answer)
		},
		editAnswer: (
			state,
			action: PayloadAction<{
				questionId: string
				answer: AnswerClient
			}>
		) => {
			if (!state.quiz) {
				throw new Error("Quiz is null")
			}

			const questionId = action.payload.questionId
			const answerId = action.payload.answer._id
			const answer = action.payload.answer

			const questionIndex = state.quiz.questions.findIndex(
				({ _id }) => _id === questionId
			)

			if (questionIndex === -1) {
				throw new Error("No question with given id")
			}

			const answerIndex = state.quiz.questions[questionIndex].answers.findIndex(
				({ _id }) => _id === answerId
			)

			if (answerIndex === -1) {
				throw new Error("No answer with given id")
			}

			state.quiz.questions[questionIndex].answers[answerIndex] = answer
		},
		removeAnswer: (
			state,
			action: PayloadAction<{ questionId: string; answerId: string }>
		) => {
			if (!state.quiz) {
				throw new Error("Quiz is null")
			}
			const questionId = action.payload.questionId
			const answerId = action.payload.answerId

			const questionIndex = state.quiz.questions.findIndex(
				question => question._id === questionId
			)

			state.quiz.questions[questionIndex].answers = state.quiz.questions[
				questionIndex
			].answers.filter(answer => answer._id !== answerId)
		},
		tick: state => {
			state.timer++
		},
		openModal: (state, action: PayloadAction<QuestionClient>) => {
			const question = action.payload
			state.form.isQuestionModalOpen = true
			state.form.modalQuestionId = question._id
		},
		closeModal: state => {
			state.form.isQuestionModalOpen = false
		},
	},
})

export const {
	reset,
	setQuiz,
	removeQuestion,
	tick,
	addAnswer,
	editAnswer,
	removeAnswer,
	startGame,
	endGame,
	answerQuestion,
	addQuestion,
	editQuestion,
	initQuiz,
	openModal,
	closeModal,
} = quizGameSlice.actions
export default quizGameSlice.reducer
