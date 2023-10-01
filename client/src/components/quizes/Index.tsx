import { useState } from "react"
import { Link } from "react-router-dom"
import { QuizesClient } from "@backend/types/quiz"
import { QuizesContainer } from "./styles"

type Props = {
	quizes: QuizesClient
}

export function Quizes({ quizes }: Props) {
	const [quizesState, setQuizesState] = useState(quizes)

	function loadDefaultQuizImage(id: string) {
		setQuizesState(
			quizesState.map(quiz =>
				quiz._id === id
					? {
							...quiz,
							fileLocation: "/static/defaultQuiz.jpg",
					  }
					: quiz
			)
		)
	}

	if (quizes.length === 0) {
		return null
	}

	return (
		<>
			<h2>Quizy użytkownika:</h2>
			<QuizesContainer className="quizes-container">
				{quizesState.map(quiz => (
					<Link to={`/quiz/${quiz._id}`} className="quiz" key={quiz._id}>
						<img
							src={
								`${import.meta.env.VITE_SERVER_URL}${quiz.fileLocation}` || ""
							}
							alt="zdjęcie quizu"
							onError={() => loadDefaultQuizImage(quiz._id)}
						/>
						<div className="right-container">
							<p className="title">{quiz.title}</p>
							<p className="subtitle">Liczba pytań: {quiz.questions.length}</p>
						</div>
					</Link>
				))}
			</QuizesContainer>
		</>
	)
}
