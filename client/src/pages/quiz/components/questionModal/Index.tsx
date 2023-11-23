import { BsFillTrashFill } from "react-icons/bs"
import { AiOutlineCheck } from "react-icons/ai"
import { closeModal } from "../../../../app/features/quizSlice"
import { enqueueAlert } from "../../../../app/features/alertSlice"
import { RootState } from "../../../../app/store"
import { useAppDispatch, useAppSelector } from "../../../../app/config"
import { useQuestion } from "../../hooks/useQuestion"
import { useAnswer } from "../../hooks/useAnswer"
import { useQuizRequests } from "../../hooks/useQuizRequests"
import { Button } from "../../../../components/button/Button"
import { AnswerForm } from "./AnswerForm"
import { ExtendQuestionForm } from "./ExtendQuestionForm"
import { QuestionModalContainer, AnswersContainer } from "./styles"

type Props = {
	questionId: string
	type: "CREATE" | "UPDATE"
}

export function getQuestionById(id: string, state: RootState) {
	return state.quizGame.quiz?.questions.find(question => question._id === id)
}

export function QuestionModal({ questionId, type }: Props) {
	const dispatch = useAppDispatch()
	const theme = useAppSelector(state => state.app.theme)
	const question = useAppSelector(state => getQuestionById(questionId, state))
	const { editQuestionTitle, removeQuestion } = useQuestion()
	const { addAnswer } = useAnswer()
	const { handleQuestionCreation } = useQuizRequests()

	if (!question) {
		dispatch(enqueueAlert({ body: "Nieoczekiwany błąd", type: "ERROR" }))
		dispatch(closeModal())
		return null
	}

	return (
		<QuestionModalContainer
			data-cy="question-modal"
			closeCallback={() =>
				type === "CREATE" ? dispatch(closeModal()) : removeQuestion(question)
			}
		>
			<div className="main-content">
				<p className="title">Edycja pytania</p>
				<div className="input-container">
					<p>Podaj tytuł pytania</p>
					<input
						value={question.title}
						placeholder="Podaj tytuł pytania..."
						onChange={e => editQuestionTitle(question, e.target.value)}
						data-cy="question-title-input"
					/>
				</div>
				<ExtendQuestionForm question={question} />
				<Button
					bgColor={theme.colors.infoMain}
					textColor="#fff"
					width="100%"
					height="70px"
					maxWidth="500px"
					onClick={() => addAnswer(question)}
					data-cy="add-answer-btn"
				>
					Dodaj odpowiedź
				</Button>
				<AnswersContainer>
					{question.answers.map(answer => (
						<AnswerForm
							key={answer._id}
							questionId={question._id}
							answerId={answer._id}
							type={type}
						/>
					))}
				</AnswersContainer>
			</div>
			<div className="btns-container">
				{type === "CREATE" && (
					<Button
						bgColor={theme.colors.successMain}
						textColor="#fff"
						height="60px"
						width="100%"
						type="button"
						onClick={() => dispatch(closeModal())}
						data-cy="close-question-modal-btn"
					>
						<AiOutlineCheck />
						<div className="text">Zamknij</div>
					</Button>
				)}
				{type === "UPDATE" && (
					<Button
						bgColor={theme.colors.successMain}
						textColor="#fff"
						height="60px"
						width="100%"
						type="button"
						onClick={() => handleQuestionCreation(question)}
						data-cy="close-question-modal-btn"
					>
						<AiOutlineCheck />
						<div className="text">Dodaj pytanie</div>
					</Button>
				)}
				<Button
					bgColor={theme.colors.errorMain}
					textColor="#fff"
					height="60px"
					width="100%"
					type="button"
					onClick={() => removeQuestion(question)}
					data-cy="remove-question-btn"
				>
					<BsFillTrashFill />
					<div className="text">Usuń pytanie</div>
				</Button>
			</div>
		</QuestionModalContainer>
	)
}
