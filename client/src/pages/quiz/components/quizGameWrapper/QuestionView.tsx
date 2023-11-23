import { useState } from "react"
import { QuestionClient } from "@backend/types/question"
import { AnswerClient } from "@backend/types/answer"
import { useAppDispatch, useAppSelector } from "../../../../app/config"
import { useUtils } from "../../../../hooks/useUtils"
import { AudioPlayer } from "../../../../components/audioPlayer/Index"
import { Button } from "../../../../components/button/Button"
import { AnswerView } from "./AnswerView"
import { QuestionViewContainer } from "./styles"
import { answerQuestion, endGame } from "../../../../app/features/quizSlice"

type Props = {
	questionsCount: number
	question: QuestionClient
}

export function QuestionView({ question, questionsCount }: Props) {
	const theme = useAppSelector(state => state.app.theme)
	const currentQuestionIndex = useAppSelector(
		state => state.quizGame.currentQuestionIndex
	)
	const [isFileError, setIsFileError] = useState(false)
	const [selectedAnswer, setSelectedAnswer] = useState<AnswerClient | null>(
		null
	)
	const dispatch = useAppDispatch()
	const { validateFileUrl } = useUtils()

	function submitAnswer() {
		if (selectedAnswer) {
			dispatch(answerQuestion({ question, answer: selectedAnswer }))
			setSelectedAnswer(null)
			if (questionsCount === currentQuestionIndex + 1) {
				dispatch(endGame())
			}
		}
	}

	return (
		<QuestionViewContainer>
			<p className="question-title">{question.title}</p>
			{isFileError && <p className="error">Błąd podczas pobierania pliku</p>}
			{question.type === "IMAGE" && !isFileError && (
				<img
					src={validateFileUrl(question.fileLocation) || ""}
					alt={`${question.title} - image`}
					onError={() => setIsFileError(true)}
					className="question-image"
				/>
			)}
			{question.type === "AUDIO" && !isFileError && (
				<AudioPlayer
					url={validateFileUrl(question.fileLocation) || ""}
					onError={() => setIsFileError(true)}
					className="question-audio"
				/>
			)}
			<div className="answers-container">
				{question.answers.map(answer => (
					<AnswerView
						key={answer._id}
						answer={answer}
						isSelected={answer._id === selectedAnswer?._id}
						selectCb={() => setSelectedAnswer(answer)}
					/>
				))}
			</div>
			<Button
				className="submit-answer-btn"
				data-cy="submit-answer-btn"
				width="80%"
				height="60px"
				bgColor={theme.colors.main}
				onClick={submitAnswer}
				disabled={selectedAnswer ? false : true}
			>
				Zatwierdź
			</Button>
		</QuestionViewContainer>
	)
}
