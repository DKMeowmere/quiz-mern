import { useState } from "react"
import { AnswerClient } from "@backend/types/answer"
import { useUtils } from "../../../../hooks/useUtils"
import { AudioPlayer } from "../../../../components/audioPlayer/Index"

type Props = {
	answer: AnswerClient
	isSelected: boolean
	selectCb: (answer: AnswerClient) => void
}

function getShorterAnswerTitle(title: string) {
	return title.length > 30 ? `${title.slice(0, 30)}...` : title
}

export function AnswerView({ answer, isSelected, selectCb }: Props) {
	const { validateFileUrl } = useUtils()
	const [isFileError, setIsFileError] = useState(false)

	return (
		<div className="answer">
			{isFileError && (
				<p className="answer-error">Błąd podczas pobierania pliku</p>
			)}
			{answer.type === "IMAGE" && !isFileError && (
				<img
					className="answer-image"
					src={validateFileUrl(answer.fileLocation) || ""}
					alt="answer image"
					onError={() => setIsFileError(true)}
				/>
			)}
			{answer.type === "AUDIO" && !isFileError && (
				<AudioPlayer
					className="answer-audio"
					width="50%"
					height="auto"
					url={validateFileUrl(answer.fileLocation) || ""}
					onError={() => setIsFileError(true)}
				/>
			)}
			<div
				className={`answer-title ${isSelected && "selected"}`}
				onClick={() => selectCb(answer)}
				data-cy={`select-answer-${answer.isTrue}-btn`}
			>
				{getShorterAnswerTitle(answer.title)}
				{answer.title.length > 30 && (
					<div className="full-text-tooltip">{answer.title}</div>
				)}
			</div>
		</div>
	)
}
