import { User } from "../../types/user"

export const userPayload: Omit<User, "createdAt" | "updatedAt"> = {
	name: "user name",
	email: "email@user.com",
	password: "password",
	biography: "biography",
	userQuizes: [],
	avatarLocation: "",
}
