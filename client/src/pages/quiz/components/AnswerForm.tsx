import { AiFillDelete } from "react-icons/ai"
import { useAppDispatch, useAppSelector } from "../../../app/config"
import { enqueueAlert } from "../../../app/features/alertSlice"
import { RootState } from "../../../app/store"
import { useAnswer } from "../hooks/useAnswer"
import { getQuestionById } from "./QuestionModal"
import { Button } from "../../../components/button/Button"
import { AnswerFormContainer } from "../styles"
import { IsTrueIcon } from "../../../components/isTrueIcon/Index"
import { ExtendAnswer } from "./ExtendAnswerForm"

type Props = {
	questionId: string
	answerId: string
}

function getAnswerById(questionId: string, answerId: string, state: RootState) {
	return getQuestionById(questionId, state)?.answers.find(
		answer => answer._id === answerId
	)
}

export function AnswerForm({ questionId, answerId }: Props) {
	const dispatch = useAppDispatch()
	const theme = useAppSelector(state => state.app.theme)
	const answer = useAppSelector(state =>
		getAnswerById(questionId, answerId, state)
	)
	const { updateTitle, toogleIsTrue, removeAnswer } = useAnswer()

	if (!answer) {
		dispatch(enqueueAlert({ body: "Nieoczekiwany błąd", type: "ERROR" }))
		removeAnswer(questionId, answerId)
		return null
	}

	return (
		<AnswerFormContainer className="answer-container">
			<div className="input-container row">
				<input
					type="text"
					value={answer.title}
					onChange={e => updateTitle(questionId, answer, e.target.value)}
					placeholder="Odpowiedź..."
					data-cy="answer-title-input"
				/>
				<Button
					onClick={() => removeAnswer(questionId, answerId)}
					bgColor={theme.colors.errorMain}
					height="40px"
					onlyIcon
					data-cy="remove-answer-btn"
				>
					<AiFillDelete />
				</Button>
			</div>
			<div className="row">
				<p>Czy odpowiedź jest poprawna?</p>
				<IsTrueIcon
					isTrue={answer.isTrue}
					onClick={() => toogleIsTrue(questionId, answer)}
					data-cy="answer-toggle-isTrue-btn"
				/>
			</div>
			<ExtendAnswer answer={answer} questionId={questionId} />
		</AnswerFormContainer>
	)
}
