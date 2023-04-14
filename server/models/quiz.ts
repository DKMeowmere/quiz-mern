import mongoose from "mongoose"
import { Quiz as QuizType } from "../types/quiz"
import { questionSchema } from "./schemas/question"

const quizSchema = new mongoose.Schema<QuizType>(
	{
		title: {
			type: String,
			required: true,
		},
		fileLocation: {
			type: String,
		},
		questions: {
			type: [questionSchema],
			required: true,
		},
	},
	{ timestamps: true }
)

const Quiz = mongoose.model<QuizType>("quiz", quizSchema)
export default Quiz
