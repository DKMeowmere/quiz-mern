import { QuizesClient } from "@backend/types/quiz"
import { QuizesContainer } from "./styles"
import { QuizLink } from "./QuizLink"
import { useAppSelector } from "../../app/config"

type Props = {
	quizes: QuizesClient
}

export function Quizes({ quizes }: Props) {
	const user = useAppSelector(state => state.app.user)

	if (quizes.length === 0) {
		return null
	}
  
	return (
		<>
			<h2>Quizy użytkownika:</h2>
			<QuizesContainer className="quizes-container">
				{quizes.map(quiz => (
					<QuizLink
						quiz={quiz}
						key={quiz._id}
						shouldDisplayEditLink={quiz.creatorId === user?._id}
					/>
				))}
			</QuizesContainer>
		</>
	)
}
