import { QuizClient } from "../quiz"

export type QuizGameState = {
	quiz: QuizClient | null
	userPoints: number
	timer: number
	isGameStarted: boolean
	form: {
		isQuestionModalOpen: boolean
		modalQuestionId: string
	}
}
