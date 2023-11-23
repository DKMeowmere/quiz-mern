import { QuestionClient } from "@backend/types/question"
import {
	DEFAULT_ANSWER_IMAGE_URL,
	DEFAULT_QUESTION_IMAGE_URL,
} from "../../../../app/constants"
import { useAppSelector } from "../../../../app/config"
import { useFiles } from "../../hooks/useFiles"
import { useQuizRequests } from "../../hooks/useQuizRequests"
import { useUtils } from "../../../../hooks/useUtils"
import { Button } from "../../../../components/button/Button"
import { AudioPlayer } from "../../../../components/audioPlayer/Index"
import { IsTrueIcon } from "../../../../components/isTrueIcon/Index"
import { QuestionContainer } from "./styles"

type Props = {
	question: QuestionClient
}

export function Question({ question }: Props) {
	const theme = useAppSelector(state => state.app.theme)
	const { handleQuestionDeletion } = useQuizRequests()
	const { removeQuestionFile, removeAnswerFile } = useFiles()
	const { validateFileUrl } = useUtils()

	return (
		<QuestionContainer>
			<p className="question-title">{question.title}</p>
			{question.type === "IMAGE" && (
				<img
					src={
						validateFileUrl(question.fileLocation) || DEFAULT_QUESTION_IMAGE_URL
					}
					alt="question image"
					className="question-image"
					onError={() => removeQuestionFile(question)}
				/>
			)}
			{question.type === "AUDIO" && (
				<AudioPlayer
					url={validateFileUrl(question.fileLocation) || null}
					height="250px"
					width="250px"
					className="question-audio-player"
					data-cy="question-audio-player"
				/>
			)}
			<p className="title">Odpowiedzi:</p>

			{question.answers.map(answer => (
				<div className="answer" key={answer._id}>
					<p className="answer-title">{answer.title}</p>
					<IsTrueIcon isTrue={answer.isTrue} />
					{answer.type === "IMAGE" && (
						<img
							src={
								validateFileUrl(answer.fileLocation) || DEFAULT_ANSWER_IMAGE_URL
							}
							alt="answer image"
							className="answer-image"
							onError={() => removeAnswerFile(question._id, answer)}
						/>
					)}
					{answer.type === "AUDIO" && (
						<AudioPlayer
							url={validateFileUrl(answer.fileLocation) || null}
							height="250px"
							width="250px"
							className="answer-audio-player"
							data-cy="answer-audio-player"
						/>
					)}
				</div>
			))}
			<Button
				type="button"
				width="80%"
				height="40px"
				bgColor={theme.colors.errorMain}
				className="delete-question-btn"
				data-cy="delete-question-btn"
				onClick={() => handleQuestionDeletion(question)}
			>
				Usuń pytanie
			</Button>
		</QuestionContainer>
	)
}
