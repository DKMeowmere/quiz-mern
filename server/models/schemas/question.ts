import mongoose from "mongoose"
import {
	Question as QuestionType,
	questionTypeEnum,
} from "../../types/question.js"
import { answerSchema } from "./answer.js"

export const questionSchema = new mongoose.Schema<QuestionType>(
	{
		title: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: questionTypeEnum,
		},
		fileLocation: {
			type: String,
		},
		answers: {
			type: [answerSchema],
			required: true,
		},
	},
	{ _id: true }
)
