import { FormEvent } from "react"
import { UserClient } from "@backend/types/user"
import { useAppDispatch, useAppSelector } from "../../../../app/config"
import { setUser } from "../../../../app/features/appSlice"
import { useSignUp } from "../../../../hooks/useSignUp"
import { useUtils } from "../../../../hooks/useUtils"
import { useUser } from "../../hooks/useUser"
import { Container } from "../../../../components/container/Index"
import { Textarea } from "../../../../components/textarea/TextArea"
import { Button } from "../../../../components/button/Button"
import { PasswordInput } from "../../../../components/passwordInput/Index"
import { FileInput } from "../../../../components/fileInput/Index"
import { UserFormContainer } from "./styles"
import { DeleteUserButton } from "./DeleteUserButton"

type Props = {
	type: "CREATE" | "UPDATE"
	user: UserClient
}

export function UserForm({ type, user }: Props) {
	const theme = useAppSelector(state => state.app.theme)
	const dispatch = useAppDispatch()
	const { signUp } = useSignUp()
	const { validateFileUrl } = useUtils()
	const { setAvatar, editAccount } = useUser()

	async function handleSignUp(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		await signUp(user)
	}

	return (
		<Container>
			<UserFormContainer
				onSubmit={type === "CREATE" ? handleSignUp : editAccount}
			>
				{type === "UPDATE" && <h2>{user.email}</h2>}
				{type === "UPDATE" && <h1>Edytuj konto</h1>}
				{type === "CREATE" && <h1>Stwórz konto</h1>}
				<div className="input-container">
					<p>Podaj nazwe</p>
					<input
						placeholder="nazwa..."
						value={user.name}
						onChange={e => dispatch(setUser({ ...user, name: e.target.value }))}
						data-cy="name-input"
					/>
				</div>
				{type === "CREATE" && (
					<div className="input-container">
						<p>Podaj email</p>
						<input
							placeholder="email..."
							value={user.email}
							onChange={e =>
								dispatch(setUser({ ...user, email: e.target.value }))
							}
							data-cy="email-input"
						/>
					</div>
				)}
				{type === "CREATE" && (
					<div className="input-container">
						<p>Podaj hasło</p>
						<PasswordInput
							value={user.password}
							onChange={e =>
								dispatch(setUser({ ...user, password: e.target.value }))
							}
							placeholder="hasło..."
							width="100%"
							height="60px"
							dataCy="password-input"
						/>
					</div>
				)}
				<div className="input-container">
					<p>Podaj biografie (opcjonalnie)</p>
					<Textarea
						width="100%"
						height="200px"
						value={user.biography}
						onChange={e =>
							dispatch(setUser({ ...user, biography: e.target.value }))
						}
						placeholder="biografia..."
						data-cy="biography-input"
					/>
				</div>
				<div className="input-container">
					<FileInput
						width="100%"
						text="Dodaj zdjęcie profilowe"
						dataCy="avatar-input"
						id="avatar-input"
						onChange={e => setAvatar(e.target.files)}
					/>
					{user.avatarLocation && (
						<img
							src={validateFileUrl(user.avatarLocation)}
							alt="Zdjęcie profilowe"
							className="avatar-preview"
						/>
					)}
				</div>
				<Button
					type="submit"
					width="100%"
					height="60px"
					bgColor={theme.colors.main}
					textColor="#fff"
					data-cy="submit-btn"
				>
					Zatwierdź
				</Button>
				{type === "UPDATE" && <DeleteUserButton />}
			</UserFormContainer>
		</Container>
	)
}
