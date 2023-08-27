import { QuizClient } from "../quiz"

export type QuizState = {
	quiz: QuizClient | null
	userPoints: number
	timer: number
	isGameStarted: boolean
}
