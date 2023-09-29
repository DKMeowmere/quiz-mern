import { BsFillTrashFill } from "react-icons/bs"
import { AiOutlineCheck } from "react-icons/ai"
import { closeModal } from "../../../app/features/quizSlice"
import { enqueueAlert } from "../../../app/features/alertSlice"
import { RootState } from "../../../app/store"
import { useAppDispatch, useAppSelector } from "../../../app/config"
import { useQuestion } from "../hooks/useQuestion"
import { useAnswer } from "../hooks/useAnswer"
import { AnswersContainer, QuestionModalContainer } from "../styles"
import { Button } from "../../../components/button/Button"
import { AnswerForm } from "./AnswerForm"
import { ExtendQuestionForm } from "./ExtendQuestionForm"

type Props = {
	questionId: string
}

export function getQuestionById(id: string, state: RootState) {
	return state.quizGame.quiz?.questions.find(question => question._id === id)
}

export function QuestionModal({ questionId }: Props) {
	const dispatch = useAppDispatch()
	const theme = useAppSelector(state => state.app.theme)
	const question = useAppSelector(state => getQuestionById(questionId, state))
	const { editQuestionTitle, removeQuestion } = useQuestion()
	const { addAnswer } = useAnswer()

	if (!question) {
		dispatch(enqueueAlert({ body: "Nieoczekiwany błąd", type: "ERROR" }))
		dispatch(closeModal())
		return null
	}

	return (
		<QuestionModalContainer closeCallback={() => dispatch(closeModal())}>
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
						/>
					))}
				</AnswersContainer>
			</div>
			<div className="btns-container">
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
