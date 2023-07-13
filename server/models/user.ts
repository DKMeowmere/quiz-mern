import mongoose from "mongoose"
import { User as UserType } from "../types/user.js"
import { quizSchema } from "./quiz.js"

const userSchema = new mongoose.Schema<UserType>(
	{
		name: {
			type: String,
			required: true,
		},
		biography: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		avatarLocation: { type: String, default: "" },
		password: { type: String, required: true },
		userQuizes: { type: [quizSchema], default: [] },
	},
	{ timestamps: true }
)

const User = mongoose.model<UserType>("user", userSchema)
export default User
