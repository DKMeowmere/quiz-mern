import mongoose from "mongoose"
import { Answer as AnswerType, answerTypeEnum } from "../../types/answer"

export const anwserSchema = new mongoose.Schema<AnswerType>({
	title: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: answerTypeEnum,
	},
	fileLocation: {
		type: String,
	},
	isTrue: {
		type: Boolean,
		required: true,
	},
})
