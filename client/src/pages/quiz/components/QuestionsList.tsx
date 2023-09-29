import { AiFillFileText } from "react-icons/ai"
import { useAppDispatch, useAppSelector } from "../../../app/config"
import { DEFAULT_QUESTION_IMAGE_URL } from "../../../app/constants"
import { openModal } from "../../../app/features/quizSlice"
import { useFiles } from "../hooks/useFiles"
import { useQuestion } from "../hooks/useQuestion"
import { useUtils } from "../../../hooks/useUtils"
import { AudioPlayer } from "../../../components/audioPlayer/Index"
import { IsTrueIcon } from "../../../components/isTrueIcon/Index"
import { QuestionListContainer } from "../styles"

export function QuestionsList() {
	const dispatch = useAppDispatch()
	const questions = useAppSelector(
		state => state.quizGame.quiz?.questions || []
	)
	const { getProcessedQuestionTitle } = useQuestion()
	const { removeQuestionFile } = useFiles()
	const { validateFileUrl } = useUtils()

	return (
		<QuestionListContainer>
			{questions.map(question => (
				<div
					key={question._id}
					onClick={() => dispatch(openModal(question))}
					className="question"
				>
					<div
						className="left-block"
						onClick={e => {
							e.stopPropagation()
						}}
					>
						{question.type === "TEXT" && (
							<AiFillFileText className="text-icon" />
						)}
						{question.type === "IMAGE" && (
							<img
								src={
									validateFileUrl(question.fileLocation) ||
									DEFAULT_QUESTION_IMAGE_URL
								}
								alt="question image"
								onError={() => removeQuestionFile(question)}
							/>
						)}
						{question.type === "AUDIO" && (
							<AudioPlayer
								url={validateFileUrl(question.fileLocation) || null}
								className="audio-player"
								dataCy="question-list-audio-player"
							/>
						)}
					</div>
					<span className="title">
						{getProcessedQuestionTitle(question.title)}
					</span>
					<div className="answers-list">
						{question.answers.map(answer => (
							<IsTrueIcon
								isTrue={answer.isTrue}
								key={answer._id}
								width="15px"
								height="15px"
							/>
						))}
					</div>
				</div>
			))}
		</QuestionListContainer>
	)
}
