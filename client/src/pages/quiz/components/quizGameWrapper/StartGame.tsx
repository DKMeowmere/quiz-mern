import { QuizClient } from "@backend/types/quiz"
import { DEFAULT_QUIZ_IMAGE_URL } from "../../../../app/constants"
import { useAppDispatch, useAppSelector } from "../../../../app/config"
import { startGame } from "../../../../app/features/quizSlice"
import { useUtils } from "../../../../hooks/useUtils"
import { StartEndGameContainer } from "./styles"
import { Button } from "../../../../components/button/Button"

type Props = {
	quiz: QuizClient
}

export function StartGame({ quiz }: Props) {
	const theme = useAppSelector(state => state.app.theme)
	const { validateFileUrl } = useUtils()
	const dispatch = useAppDispatch()

	return (
		<StartEndGameContainer>
			<h1>{quiz.title}</h1>
			<p>Liczba pytań: {quiz.questions.length}</p>
			<img
				src={validateFileUrl(quiz.fileLocation) || DEFAULT_QUIZ_IMAGE_URL}
				alt="quiz image"
			/>
			<Button
				width="100%"
				height="60px"
				bgColor={theme.colors.main}
				onClick={() => dispatch(startGame())}
        data-cy="start-game-btn"
			>
				Zacznij gre
			</Button>
		</StartEndGameContainer>
	)
}
