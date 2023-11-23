import { Question } from "../question"
import { QuizClient } from "../quiz"

type AnsweredQuestions = {
	didUserAnsweredCorrectly: boolean
	answeredAnswerId: string
	question: Question
}[]

export type QuizGameState = {
	quiz: QuizClient | null
	userPoints: number
	timer: number
	currentQuestionIndex: number
	isGameStarted: boolean
	isGameEnded: boolean
	answeredQuestions: AnsweredQuestions
	form: {
		isQuestionModalOpen: boolean
		modalQuestionId: string
	}
}
