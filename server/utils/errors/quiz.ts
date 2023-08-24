import { CustomErrorType } from "../../types/customError"

export const maximumNumberOfAnswersExceeded: CustomErrorType = {
	message: "Pytanie może maksymalnie składać się z 4 odpowiedzi",
	statusCode: 400,
}

export const minimumNumberOfAnswersExceeded: CustomErrorType = {
	message: "Pytanie może minimalnie składać się z 2 odpowiedzi",
	statusCode: 400,
}

export const invalidQuizId: CustomErrorType = {
	message: "Niepoprawne id quizu",
	statusCode: 400,
}

export const invalidQuestionId: CustomErrorType = {
	message: "Niepoprawne id pytania",
	statusCode: 400,
}

export const invalidAnswerId: CustomErrorType = {
	message: "Niepoprawne id odpowiedzi",
	statusCode: 400,
}

export const quizUpdateForbidden: CustomErrorType = {
	message:
		"Nie możesz zaaktualizować quizu, który nie jest przypisany do twojego konta",
	statusCode: 403,
}

export const quizNotFound: CustomErrorType = {
	message: "Nie znaleziono quizu",
	statusCode: 404,
}

export const noQuizTitle: CustomErrorType = {
	message: "Brak tytułu quizu",
	statusCode: 400,
}

export const noQuestionTitle: CustomErrorType = {
	message: "Brak tytułu odpowodzi",
	statusCode: 400,
}

export const noAnswerTitle: CustomErrorType = {
	message: "Brak tytułu odpowiedzi",
	statusCode: 400,
}

export const wrongQuestionType: CustomErrorType = {
	message: "Niepoprawny typ pytania",
	statusCode: 400,
}

export const wrongAnswerType: CustomErrorType = {
	message: "Niepoprawny typ odpowiedzi",
	statusCode: 400,
}

export const questionNotFound: CustomErrorType = {
	message: "Nie znaleziono pytania",
	statusCode: 404,
}

export const answerNotFound: CustomErrorType = {
	message: "Nie znaleziono odpowiedzi",
	statusCode: 404,
}

export const isTrueMustBeBoolean: CustomErrorType = {
	message: "isTrue musi mieć wartość 'true' lub 'false'",
	statusCode: 400,
}

export const questionHasNotTrueAnswer = (
	questionTitle?: string
): CustomErrorType => ({
	message: `Pytanie${
		questionTitle ? `: ${questionTitle}` : ""
	} musi mieć przynajmiej jedną poprawną odpowiedź`,
	statusCode: 400,
})
