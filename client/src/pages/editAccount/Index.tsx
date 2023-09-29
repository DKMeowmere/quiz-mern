import { FormEvent, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UserClient } from "@backend/types/user"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { endLoading, login, startLoading } from "../../app/features/appSlice"
import { enqueueAlert } from "../../app/features/alertSlice"
import { useUtils } from "../../hooks/useUtils"
import useLogin from "../../hooks/useLogin"
import { Textarea } from "../../components/textarea/TextArea"
import { Button } from "../../components/button/Button"
import Modal from "../../components/modal/Index"
import FileInput from "../../components/fileInput/Index"
import { EditAccountContainer, EditAccountForm } from "./styles"

export default function EditAccount() {
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const loggedUser = useAppSelector(state => state.app.user)
	const theme = useAppSelector(state => state.app.theme)
	const token = useAppSelector(state => state.app.token)
	const dispatch = useAppDispatch()
	const [user, setUser] = useState<UserClient | null>(null)
	const { id } = useParams()
	const navigate = useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [avatar, setAvatar] = useState<File | null>(null)
	const [avatarUrl, setAvatarUrl] = useState("")
	const { handleErrorWithAlert } = useUtils()
	const { logout } = useLogin()

	useEffect(() => {
		async function getUser() {
			try {
				dispatch(startLoading())
				const res = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/api/user/${id}`
				)
				const data = await res.json()

				if (data.error) {
					throw new Error(data.error)
				}

				setUser(data)
				setAvatarUrl(`${import.meta.env.VITE_SERVER_URL}${data.avatarLocation}`)
				dispatch(endLoading())
			} catch (err: unknown) {
				handleErrorWithAlert(err)
			}
		}
		getUser()
	}, [])

	useEffect(() => {
		if (!avatar) {
			return
		}

		const url = URL.createObjectURL(avatar)
		setAvatarUrl(url)

		return () => URL.revokeObjectURL(url)
	}, [avatar])

	if (!loggedUser || loggedUser._id !== id) {
		if (loggedUser) {
			navigate("/login")
		}
	}

	async function editProfile(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (!user) {
				throw new Error("Nieoczekiwany błąd")
			}

			if (!user.name) {
				throw new Error("Wprowadź nazwe")
			}

			const formData = new FormData()
			formData.append("name", user.name)
			formData.append("biography", user.biography)
			avatar && formData.append("avatar", avatar)

			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/api/user/${id}`,
				{
					body: formData,
					method: "PATCH",
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}
			setUser(data)
			setAvatar(null)
			setAvatarUrl(`${import.meta.env.VITE_SERVER_URL}${data.avatarLocation}`)
			dispatch(login(data))
			dispatch(
				enqueueAlert({
					body: "Zaaktualizowano profil się pomyślnie",
					type: "SUCCESS",
				})
			)
			endLoading()
		} catch (err: unknown) {
			handleErrorWithAlert(err)
		}
	}

	async function deleteAccount() {
		try {
			dispatch(startLoading())
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/api/user/${id}`,
				{
					method: "DELETE",
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}

			logout()
			dispatch(
				enqueueAlert({ type: "SUCCESS", body: "Usunięto konto pomyślnie" })
			)
			dispatch(endLoading())
			navigate("/")
		} catch (err) {
			handleErrorWithAlert(err)
		}
	}

	return (
		<EditAccountContainer>
			{!user && !isAppLoading && <h1>Nie znaleziono użytkownika</h1>}
			{user && (
				<EditAccountForm onSubmit={editProfile}>
					<h2>{user.email}</h2>
					<h1>Edytuj konto</h1>
					<div className="input-container">
						<p>Edytuj nazwe</p>
						<input
							type="text"
							value={user.name}
							onChange={e => setUser({ ...user, name: e.target.value })}
							data-cy="name-input"
						/>
					</div>
					<div className="input-container">
						<p>Edytuj biografie</p>
						<Textarea
							height="200px"
							width="100%"
							value={user.biography}
							onChange={e => setUser({ ...user, biography: e.target.value })}
							data-cy="biography-input"
						/>
					</div>
					<div className="input-container">
						<FileInput
							dataCy="avatar-upload"
							id="avatar-upload"
							text="Dodaj zdjęcie profilowe"
							width="100%"
							onChange={e => {
								if (e.target.files) {
									setAvatar(e.target.files[0])
									return
								}
							}}
						/>

						<img
							src={avatarUrl}
							alt="Zdjęcie profilowe"
							className="avatar-preview"
							onError={() =>
								setAvatarUrl(
									`${import.meta.env.VITE_SERVER_URL}/static/defaultAvatar.jpg`
								)
							}
						/>
					</div>
					<Button
						type="submit"
						bgColor={theme.colors.main}
						height="60px"
						width="100%"
						textColor="#fefefe"
						data-cy="submit-btn"
					>
						Zaaktualizuj profil
					</Button>
					<Button
						bgColor={theme.colors.errorMain}
						height="40px"
						width="100%"
						textColor="#fefefe"
						onClick={() => setIsModalOpen(true)}
						type="button"
						className="delete-account-btn"
						data-cy="open-delete-account-modal-btn"
					>
						Usuń konto
					</Button>
				</EditAccountForm>
			)}
			{isModalOpen && (
				<Modal closeCallback={() => setIsModalOpen(false)} className="modal">
					<p>Na pewno? Ta akcja jest nieodwracalna</p>
					<Button
						bgColor={theme.colors.errorMain}
						height="50px"
						width="50%"
						textColor="#fefefe"
						onClick={() => deleteAccount()}
						type="button"
						data-cy="delete-account-btn"
					>
						Usuń konto
					</Button>
				</Modal>
			)}
		</EditAccountContainer>
	)
}
