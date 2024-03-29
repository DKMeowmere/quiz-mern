import { CustomErrorType } from "../../types/customError"

export const universalError: CustomErrorType = {
	message: "Nieoczekiwany błąd",
	statusCode: 400,
}

export const filesValidationFailedMustBeImageOrAudio: CustomErrorType = {
	message:
		"Plik nie może zawierać '/' oraz musi posiadać rozszerzenie .jpg  .jpeg, .png lub .mp3",
	statusCode: 400,
}

export const filesValidationFailedMustBeImage: CustomErrorType = {
	message:
		"Plik nie może zawierać '/' oraz musi posiadać rozszerzenie .jpg  .jpeg lub .png",
	statusCode: 400,
}

export const invalidQObjectId: CustomErrorType = {
	message: "Niepoprawne id",
	statusCode: 400,
}

export const invalidFileName: CustomErrorType = {
	message: "Zła nazwa pliku",
	statusCode: 400,
}
