import { Quiz } from "./quiz"

export type QuizState = {
	quiz: Quiz | null
	userPoints: number
	timer: number
	isGameStarted: boolean
}
