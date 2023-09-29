import mongoose from "mongoose"
import { Quiz as QuizType } from "../types/quiz.js"
import { questionSchema } from "./schemas/question.js"

export const quizSchema = new mongoose.Schema<QuizType>(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		fileLocation: {
			type: String,
		},
		questions: {
			type: [questionSchema],
			required: true,
		},
		creatorId: {
			type: String,
			ref: "User",
		},
	},
	{ timestamps: true }
)

const Quiz = mongoose.model<QuizType>("quiz", quizSchema)
export default Quiz
