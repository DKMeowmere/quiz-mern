import { FormEvent, useState, useEffect } from "react"
import { useAppSelector } from "../../app/config"
import { Button } from "../../components/button/Button"
import Container from "../../components/container/Index"
import { LoginForm } from "./styles"
import PasswordInput from "../../components/passwordInput/Index"
import { Link, useNavigate } from "react-router-dom"
import useLogin from "../../hooks/useLogin"

export default function Login() {
	const theme = useAppSelector(state => state.app.theme)
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const [email, setEmail] = useState("ronaldreagan@usa.com")
	const [password, setPassword] = useState("admin123")
	const navigate = useNavigate()
	const { loginWithEmail } = useLogin()

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/")
		}
	}, [])

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		loginWithEmail(email, password)
	}

	return (
		<Container>
			<LoginForm onSubmit={handleSubmit}>
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
			</LoginForm>
		</Container>
	)
}
