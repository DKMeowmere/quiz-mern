import { FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { useAppSelector } from "../../../../app/config"
import { useLogin } from "../../../../hooks/useLogin"
import { Button } from "../../../../components/button/Button"
import { Container } from "../../../../components/container/Index"
import { PasswordInput } from "../../../../components/passwordInput/Index"
import { LoginFormContainer } from "./styles"

export function LoginForm() {
	const theme = useAppSelector(state => state.app.theme)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const { loginWithEmail } = useLogin()


	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		loginWithEmail(email, password)
	}

	return (
		<Container>
			<LoginFormContainer onSubmit={handleSubmit}>
				<p>Zaloguj sie</p>
				<div className="input-container">
					<p>Wprowadź email</p>
					<input
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="email..."
						data-cy="email-input"
					/>
				</div>
				<div className="input-container">
					<p>Wprowadź hasło</p>
					<PasswordInput
						width="100%"
						height="60%"
						className="password-input"
						value={password}
						onChange={e => setPassword(e.target.value)}
						dataCy="password-input"
						placeholder="hasło..."
					/>
				</div>
				<Button
					width="100%"
					height="50px"
					bgColor={theme.colors.main}
					textColor="#efefef"
					type="submit"
				>
					Zatwierdź
				</Button>
				<Link to="/user/create" className="create-account-link">
					<Button
						width="100%"
						height="50px"
						bgColor={theme.colors.main}
						textColor="#efefef"
					>
						Nie masz konta? Zajerestruj się
					</Button>
				</Link>
			</LoginFormContainer>
		</Container>
	)
}
