export type CustomErrorType = {
	message: string
	statusCode: number
}

class CustomError extends Error {
	statusCode: number
	constructor({ message, statusCode }: CustomErrorType) {
		super(message)
		this.message = message
		this.statusCode = statusCode
	}
}

CustomError.prototype.name = "CustomError"
export default CustomError
