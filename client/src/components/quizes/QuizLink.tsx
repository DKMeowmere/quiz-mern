import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdEdit } from "react-icons/md"
import { QuizClient } from "@backend/types/quiz"
import { DEFAULT_QUIZ_IMAGE_URL } from "../../app/constants"
import { useUtils } from "../../hooks/useUtils"

type Props = {
	quiz: QuizClient
	shouldDisplayEditLink: boolean
}

function getShorterTitle(title: string) {
	return title.length > 30 ? `${title.slice(0, 30)}...` : title
}

export function QuizLink({ quiz, shouldDisplayEditLink }: Props) {
	const [quizImageUrl, setQuizImageUrl] = useState(quiz.fileLocation || "")
	const { validateFileUrl } = useUtils()
	const navigate = useNavigate()

	return (
		<div
			className="quiz"
			key={quiz._id}
			onClick={() => navigate(`/quiz/${quiz._id}`)}
		>
			<img
				src={validateFileUrl(quizImageUrl)}
				alt="zdjęcie quizu"
				onError={() => setQuizImageUrl(DEFAULT_QUIZ_IMAGE_URL)}
			/>
			<div className="right-container">
				<p className="quiz-title">{getShorterTitle(quiz.title)}</p>
				<p className="subtitle">Liczba pytań: {quiz.questions.length}</p>
			</div>
			{shouldDisplayEditLink && (
				<Link
					className="edit-quiz-link"
					to={`/quiz/${quiz._id}/edit`}
					onClick={e => e.stopPropagation()}
				>
					<MdEdit />
				</Link>
			)}
		</div>
	)
}
