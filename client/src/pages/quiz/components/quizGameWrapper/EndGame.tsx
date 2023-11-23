import { FaCircle } from "react-icons/fa"
import { QuizClient } from "@backend/types/quiz"
import { DEFAULT_QUIZ_IMAGE_URL } from "../../../../app/constants"
import { useAppDispatch, useAppSelector } from "../../../../app/config"
import { reset } from "../../../../app/features/quizSlice"
import { useUtils } from "../../../../hooks/useUtils"
import {
	AnswerContainer,
	AnsweredQuestionsContainer,
	StartEndGameContainer,
} from "./styles"
import { Button } from "../../../../components/button/Button"

type Props = {
	quiz: QuizClient
}

export function EndGame({ quiz }: Props) {
	const theme = useAppSelector(state => state.app.theme)
	const answeredQuestions = useAppSelector(
		state => state.quizGame.answeredQuestions
	)
	const timer = useAppSelector(state => state.quizGame.timer)
	const userPoints = useAppSelector(state => state.quizGame.userPoints)
	const { validateFileUrl } = useUtils()
	const dispatch = useAppDispatch()

	return (
		<StartEndGameContainer>
			<h1>{quiz.title}</h1>
			<img
				src={validateFileUrl(quiz.fileLocation) || DEFAULT_QUIZ_IMAGE_URL}
				alt="quiz image"
			/>
			<p>Czas: {timer}sec</p>
			<p>
				Wynik: {userPoints}/{quiz.questions.length}
			</p>
			<Button
				width="100%"
				height="60px"
				onClick={() => dispatch(reset())}
				bgColor={theme.colors.main}
				data-cy="reset-btn"
			>
				Jeszcze raz?
			</Button>
			<AnsweredQuestionsContainer>
				<h2>Twoje odpowiedzi:</h2>
				{answeredQuestions.map(({ question, answeredAnswerId }) => (
					<div className="question" key={question._id}>
						<p className="question-title">{question.title}</p>
						{question.answers.map(answer => (
							<AnswerContainer
								key={answer._id}
								isTrue={answer.isTrue}
								didUserAnswered={answeredAnswerId === answer._id}
							>
								<FaCircle />
								<p className="answer-title">{answer.title}</p>
							</AnswerContainer>
						))}
					</div>
				))}
			</AnsweredQuestionsContainer>
		</StartEndGameContainer>
	)
}
