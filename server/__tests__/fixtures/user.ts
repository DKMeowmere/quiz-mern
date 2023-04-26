import { User } from "../../types/user"

export const user: Omit<User, "createdAt" | "updatedAt"> = {
	name: "user name",
	email: "email",
	password: "password",
	biography: "biography",
	userQuizes: [],
	avatarLocation: "",
}
