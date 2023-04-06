import mongoose from "mongoose"
import { Quiz as QuizType } from "../types/quiz"
import { questionSchema } from "../types/question"

const quizSchema = new mongoose.Schema<QuizType>({
	title: {
		type: String,
		required: true,
	},
	fileLocation: {
		type: String,
		required: true,
	},
	questions: [questionSchema],
})

const Quiz = mongoose.model<QuizType>("quiz", quizSchema)
export default Quiz