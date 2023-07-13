import mongoose from "mongoose"
import { Answer as AnswerType, answerTypeEnum } from "../../types/answer.js"

export const answerSchema = new mongoose.Schema<AnswerType>(
	{
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
	},
	{ _id: true }
)
