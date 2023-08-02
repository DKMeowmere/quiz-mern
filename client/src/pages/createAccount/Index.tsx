import { FormEvent, useEffect, useState } from "react"
import { useAppSelector } from "../../app/config"
import Container from "../../components/container/Index"
import { useNavigate } from "react-router-dom"
import { RegisterForm } from "./styles"
import { Textarea } from "../../components/textarea/TextArea"
import { Button } from "../../components/button/Button"
import useSignUp from "../../hooks/useSignUp"
import PasswordInput from "../../components/passwordInput/Index"

export default function CreateAccount() {
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const theme = useAppSelector(state => state.app.theme)
	const navigate = useNavigate()
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [biography, setBiography] = useState("")
	const [avatar, setAvatar] = useState<File | null>(null)
	const [preview, setPreview] = useState("")
	const { signUp } = useSignUp()

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/")
		}
	}, [])

	useEffect(() => {
		if (!avatar) {
			return
		}

		const url = URL.createObjectURL(avatar)
		setPreview(url)

		return () => URL.revokeObjectURL(url)
	}, [avatar])

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		await signUp({ name, avatar, biography, email, password })
	}

	return (
		<Container>
			<RegisterForm onSubmit={handleSubmit}>
				<h1>Stwórz konto</h1>
				<div className="input-container">
					<p>Podaj nazwe</p>
					<input
						value={name}
						onChange={e => setName(e.target.value)}
						data-cy="name-input"
					/>
				</div>
				<div className="input-container">
					<p>Podaj email</p>
					<input
						value={email}
						onChange={e => setEmail(e.target.value)}
						data-cy="email-input"
					/>
				</div>
				<div className="input-container">
					<p>Podaj hasło</p>
					<PasswordInput
						value={password}
						onChange={e => setPassword(e.target.value)}
						width="100%"
						height="60px"
						dataCy="password-input"
					/>
				</div>
				<div className="input-container">
					<p>Podaj biografie (opcjonalnie)</p>
					<Textarea
						width="100%"
						height="200px"
						value={biography}
						onChange={e => setBiography(e.target.value)}
						data-cy="biography-input"
					/>
				</div>
				<div className="input-container">
					<p>Dodaj zdjęcie profilowe</p>
					<input
						width="100%"
						height="200px"
						type="file"
						data-cy="avatar-input"
						onChange={e => {
							if (e.target.files) {
								setAvatar(e.target.files[0])
								return
							}
						}}
					/>
					{preview && (
						<img
							src={preview}
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
			</RegisterForm>
		</Container>
	)
}
