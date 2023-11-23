import { Link } from "react-router-dom"
import { QuizClient } from "@backend/types/quiz"
import { useAppSelector } from "../../../../app/config"
import { DEFAULT_QUIZ_IMAGE_URL } from "../../../../app/constants"
import { useQuiz } from "../../hooks/useQuiz"
import { useFiles } from "../../hooks/useFiles"
import { useQuestion } from "../../hooks/useQuestion"
import { useUtils } from "../../../../hooks/useUtils"
import { useQuizRequests } from "../../hooks/useQuizRequests"
import { QuizPageContainer } from "./styles"
import { QuestionModal } from "../questionModal/Index"
import { QuestionsList } from "../questionList/Index"
import { QuestionsView } from "../questionView/Index"
import { Form } from "../../../../components/form/Form"
import { Textarea } from "../../../../components/textarea/TextArea"
import { FileInput } from "../../../../components/fileInput/Index"
import { Button } from "../../../../components/button/Button"

type Props = {
	type: "CREATE" | "UPDATE"
	quiz: QuizClient
}

export function QuizForm({ type, quiz }: Props) {
	const theme = useAppSelector(state => state.app.theme)
	const modalQuestionId = useAppSelector(
		state => state.quizGame.form.modalQuestionId
	)
	const isQuestionModalOpen = useAppSelector(
		state => state.quizGame.form.isQuestionModalOpen
	)
	const { editQuizTitle, editQuizDescription, clearQuiz } = useQuiz()
	const { addQuestion } = useQuestion()
	const { handleQuizCreation, handleQuizUpdating, handleQuizDeletion } =
		useQuizRequests()
	const { addQuizFile, removeQuizFile } = useFiles()
	const { validateFileUrl } = useUtils()

	return (
		<QuizPageContainer>
			{isQuestionModalOpen && (
				<QuestionModal
					questionId={modalQuestionId}
					type={type}
				/>
			)}
			<Form
				onSubmit={type === "CREATE" ? handleQuizCreation : handleQuizUpdating}
			>
				<h1>{type === "CREATE" ? "Stwórz" : "Edytuj"} quiz</h1>
				<div className="quiz-main-btns">
					{type === "CREATE" && (
						<>
							<Button
								bgColor={theme.colors.main}
								height="40px"
								width="40%"
								data-cy="submit-quiz-creation"
							>
								Zatwierdź
							</Button>
							<Button
								bgColor={theme.colors.errorMain}
								height="40px"
								width="40%"
								onClick={() => clearQuiz()}
								type="button"
								data-cy="clear-quiz-form"
							>
								Wyczyść
							</Button>
						</>
					)}
					{type === "UPDATE" && (
						<Button
							bgColor={theme.colors.main}
							height="40px"
							width="80%"
							data-cy="submit-quiz-update"
						>
							Zaaktualizuj
						</Button>
					)}
				</div>
				<div className="input-container">
					<p>Podaj tytuł quizu</p>
					<input
						type="text"
						value={quiz.title}
						onChange={e => editQuizTitle(e.target.value)}
						data-cy="quiz-title-input"
						placeholder="Podaj tytuł..."
					/>
				</div>
				<div className="input-container">
					<p>Podaj opis (opcjonalnie)</p>
					<Textarea
						height="200px"
						width="100%"
						value={quiz.description}
						placeholder="Podaj opis..."
						onChange={e => editQuizDescription(e.target.value)}
						data-cy="quiz-description-input"
					/>
				</div>
				<FileInput
					text="Wstaw główne zdjęcię quizu"
					id="quiz-main-image-input"
					width="100%"
					onChange={e => addQuizFile(e.target.files)}
					dataCy="quiz-main-image-input"
				/>
				<img
					src={validateFileUrl(quiz.fileLocation) || DEFAULT_QUIZ_IMAGE_URL}
					alt="quiz image"
					className="quiz-image"
					onError={() => removeQuizFile()}
				/>
				<Button
					bgColor={theme.colors.main}
					type="button"
					width="100%"
					maxWidth="500px"
					height="70px"
					textColor="#fff"
					onClick={addQuestion}
					data-cy="add-question-btn"
				>
					Dodaj pytanie
				</Button>
				{type === "CREATE" && <QuestionsList />}
				{type === "UPDATE" && (
					<>
						{quiz.questions.length > 0 && (
							<QuestionsView questions={quiz.questions} />
						)}
						<Link to={`/quiz/${quiz._id}`}>
							<Button
								bgColor={theme.colors.main}
								height="40px"
								width="80%"
								maxWidth="500px"
							>
								Rozwiąż quiz
							</Button>
						</Link>
						<Button
							bgColor={theme.colors.errorMain}
							type="button"
							width="100%"
							maxWidth="500px"
							height="70px"
							textColor="#fff"
							onClick={handleQuizDeletion}
							className="delete-quiz-btn"
							data-cy="delete-quiz-btn"
						>
							Usuń quiz
						</Button>
					</>
				)}
			</Form>
		</QuizPageContainer>
	)
}
