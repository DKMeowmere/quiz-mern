import { useState } from "react"
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"
import { QuestionsClient } from "@backend/types/question"
import { QuestionsViewContainer } from "./styles"
import { Question } from "./Question"

type Props = {
	questions: QuestionsClient
}

export function QuestionsView({ questions }: Props) {
	const [questionIndex, setQuestionIndex] = useState(0)

	return (
		<QuestionsViewContainer>
			{questionIndex > 0 && (
				<div
					className="arrow left"
					onClick={() => setQuestionIndex(questionIndex - 1)}
				>
					<AiFillCaretLeft />
				</div>
			)}
			{questionIndex < questions.length - 1 && (
				<div
					className="arrow right"
					onClick={() => setQuestionIndex(questionIndex + 1)}
				>
					<AiFillCaretRight />
				</div>
			)}
			<h2 className="title">Pytanie:</h2>
			{questions.length > 0 && <Question question={questions[questionIndex]} />}
		</QuestionsViewContainer>
	)
}
