import { AnswerClient } from "@backend/types/answer"
import { FaFileImage } from "react-icons/fa"
import { MdAudioFile } from "react-icons/md"
import { AiFillQuestionCircle } from "react-icons/ai"
import { DEFAULT_ANSWER_IMAGE_URL } from "../../../app/constants"
import { useAnswer } from "../hooks/useAnswer"
import { useUtils } from "../../../hooks/useUtils"
import { useFiles } from "../hooks/useFiles"
import { AudioPlayer } from "../../../components/audioPlayer/Index"
import FileInput from "../../../components/fileInput/Index"

type Props = {
	questionId: string
	answer: AnswerClient
}

export function ExtendAnswer({ questionId, answer }: Props) {
	const { toggleImageType, toggleAudioType } = useAnswer()
	const { addAnswerFile, removeAnswerFile } = useFiles()
	const { validateFileUrl } = useUtils()
	const { type } = answer

	return (
		<>
			<div className="row">
				<button
					className={`answer-type-icon-btn ${type === "IMAGE" ? "active" : ""}`}
					onClick={() => toggleImageType(questionId, answer)}
					data-cy="toggle-type-to-image-btn"
				>
					<FaFileImage />
				</button>
				<button
					className={`answer-type-icon-btn ${type === "AUDIO" ? "active" : ""}`}
					onClick={() => toggleAudioType(questionId, answer)}
					data-cy="toggle-type-to-audio-btn"
				>
					<MdAudioFile />
				</button>
			</div>
			<FileInput
				id="answer-file-input"
				onChange={e => addAnswerFile(questionId, answer, e.target.files)}
				text="Dodaj plik"
				dataCy="answer-file-input"
				width="100%"
				maxWidth="200px"
				bgColor="#fff"
			/>
			<div className="type-symbol">
				{type === "TEXT" && <AiFillQuestionCircle className="text-icon" />}
				{type === "IMAGE" && (
					<img
						src={
							validateFileUrl(answer.fileLocation) || DEFAULT_ANSWER_IMAGE_URL
						}
						className="answer-image"
						alt="answer image"
						onError={() => removeAnswerFile(questionId, answer)}
					/>
				)}
				{type === "AUDIO" && (
					<AudioPlayer
						url={validateFileUrl(answer.fileLocation) || null}
						width="100%"
						height="100%"
					/>
				)}
			</div>
		</>
	)
}
