import { QuestionClient } from "@backend/types/question"
import { useAppSelector } from "../../../app/config"
import { DEFAULT_QUESTION_IMAGE_URL } from "../../../app/constants"
import { useFiles } from "../hooks/useFiles"
import { useQuestion } from "../hooks/useQuestion"
import { Button } from "../../../components/button/Button"
import FileInput from "../../../components/fileInput/Index"
import { AudioPlayer } from "../../../components/audioPlayer/Index"
import { useUtils } from "../../../hooks/useUtils"

type Props = {
	question: QuestionClient
}

export function ExtendQuestionForm({ question }: Props) {
	const theme = useAppSelector(state => state.app.theme)
	const { addQuestionFile, removeQuestionFile } = useFiles()
	const { toggleImageType, toggleAudioType } = useQuestion()
	const { validateFileUrl } = useUtils()

	return (
		<div className="input-container">
			<p>Dodaj do pytania:</p>
			<div className="question-types">
				<Button
					className={`type-btn ${question.type === "IMAGE" ? "active" : ""}`}
					textColor={theme.colors.main}
					bgColor="#fff"
					width="40%"
					height="50px"
					type="button"
					onClick={() => toggleImageType(question)}
					data-cy="toggle-type-to-image-btn"
				>
					ZDJĘCIE
				</Button>
				<Button
					className={`type-btn ${question.type === "AUDIO" ? "active" : ""}`}
					textColor={theme.colors.main}
					bgColor="#fff"
					width="40%"
					height="50px"
					type="button"
					onClick={() => toggleAudioType(question)}
					data-cy="toggle-type-to-audio-btn"
				>
					AUDIO
				</Button>
			</div>
			{question.type !== "TEXT" && (
				<div className="input-container">
					<FileInput
						dataCy="question-file-input"
						id="question-file-input"
						onChange={e => addQuestionFile(question, e.target.files)}
						text={`Dodaj ${question.type === "IMAGE" ? "zdjęcie" : "audio"}`}
						bgColor="#fff"
						width="100%"
						maxWidth="500px"
						data-cy="question-file-input"
					/>
					{question.type === "IMAGE" && (
						<img
							alt="question image"
							src={
								validateFileUrl(question.fileLocation) ||
								DEFAULT_QUESTION_IMAGE_URL
							}
							onError={() => removeQuestionFile(question)}
							className="question-image"
						/>
					)}
					{question.type === "AUDIO" && (
						<AudioPlayer
							url={validateFileUrl(question.fileLocation) || null}
							width="50%"
							height="50%"
							className="audio-player"
							dataCy="question-form-audio-player"
						/>
					)}
				</div>
			)}
		</div>
	)
}
