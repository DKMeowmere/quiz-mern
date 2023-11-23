import { useEffect, useMemo } from "react"
import { QuizClient } from "@backend/types/quiz"
import { QuestionClient } from "@backend/types/question"
import { tick } from "../../../../app/features/quizSlice"
import { useAppDispatch, useAppSelector } from "../../../../app/config"
import { useUtils } from "../../../../hooks/useUtils"
import { StartGame } from "./StartGame"
import { QuestionView } from "./QuestionView"
import { EndGame } from "./EndGame"

type Props = {
	quiz: QuizClient
}

export function QuizGameWrapper({ quiz }: Props) {
	const isGameStarted = useAppSelector(state => state.quizGame.isGameStarted)
	const isGameEnded = useAppSelector(state => state.quizGame.isGameEnded)
	const currentQuestionIndex = useAppSelector(
		state => state.quizGame.currentQuestionIndex
	)
	const dispatch = useAppDispatch()
	const { shuffle } = useUtils()
	const { questions } = quiz
	const shuffledQuestions: QuestionClient[] = useMemo(
		() =>
			shuffle(
				questions.map(question => ({
					...question,
					answers: shuffle(question.answers),
				}))
			),
		[quiz]
	)

	useEffect(() => {
		const interval = setInterval(() => {
			if (isGameStarted) {
				dispatch(tick())
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [isGameStarted])

	return (
		<>
			{!isGameStarted && !isGameEnded && <StartGame quiz={quiz} />}
			{isGameStarted && currentQuestionIndex < shuffledQuestions.length && (
				<QuestionView
					question={shuffledQuestions[currentQuestionIndex]}
					questionsCount={shuffledQuestions.length}
				/>
			)}
			{isGameEnded && <EndGame quiz={quiz} />}
		</>
	)
}
