import { CustomErrorType } from "../../types/customError"

export const userNotFound: CustomErrorType = {
	message: "nie znaleziono użytkownika",
	statusCode: 404,
}

export const userInTokenNotFound: CustomErrorType = {
	message: "Użytkownik podany w tokenie, nie istnieje",
	statusCode: 404,
}

export const authNeeded: CustomErrorType = {
	message: "Musisz być zalogowany, żeby to zrobić",
	statusCode: 401,
}

export const invalidUserId: CustomErrorType = {
	message: "Niepoprawne id użytkownika",
	statusCode: 400,
}

export const userUpdateForbidden: CustomErrorType = {
	message: "Możesz zaaktualizować tylko swój profil",
	statusCode: 403,
}

export const noUsers: CustomErrorType = {
	message: "Nie znaleziono żadnego użytkownika",
	statusCode: 404,
}

export const loginFailed: CustomErrorType = {
	message: "Logowanie nie powiodło się",
	statusCode: 400,
}

export const accountCreationFailed: CustomErrorType = {
	message: "Logowanie nie powiodło się",
	statusCode: 400,
}
