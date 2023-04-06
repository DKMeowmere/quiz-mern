import mongoose from "mongoose"
import {
	Question as QuestionType,
	questionTypeEnum,
} from "../../types/question"
import { answerSchema } from "../../types/answer"

export const questionSchema = new mongoose.Schema<QuestionType>({
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
	fileDescription: {
		type: String,
	},
	anwsers: [answerSchema],
})
