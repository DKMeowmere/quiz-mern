import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { MdLogout } from "react-icons/md"
import { BiEditAlt } from "react-icons/bi"
import { UserClient } from "@backend/types/user"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { endLoading, startLoading } from "../../app/features/appSlice"
import { DEFAULT_AVATAR_IMAGE_URL } from "../../app/constants"
import useLogin from "../../hooks/useLogin"
import { useUtils } from "../../hooks/useUtils"
import { ProfileContainer } from "./styles"
import Quizes from "../../components/quizes/Index"

export default function Profile() {
	const { id } = useParams()
	const dispatch = useAppDispatch()
	const loggedUser = useAppSelector(state => state.app.user)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const { logout } = useLogin()
	const [user, setUser] = useState<UserClient | null>(null)
	const [profileAvatar, setProfileAvatar] = useState(
		`${import.meta.env.VITE_SERVER_URL}/static/defaultAvatar.jpg`
	)
	const { handleErrorWithAlert, validateFileUrl } = useUtils()

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
				setProfileAvatar(data.avatarLocation)
				dispatch(endLoading())
			} catch (err: unknown) {
				handleErrorWithAlert(err)
			}
		}
		getUser()
	}, [])

	return (
		<ProfileContainer>
			{!user && !isAppLoading && <h1>Nie znaleziono użytkownika</h1>}
			{user && (
				<>
					{user._id === loggedUser?._id && (
						<div className="right-icons-container">
							<MdLogout
								className="icon"
								data-cy="logout-btn"
								onClick={() => logout()}
							/>
							<Link to={`/user/${id}/edit`}>
								<BiEditAlt className="icon" />
							</Link>
						</div>
					)}

					<img
						src={validateFileUrl(profileAvatar)}
						alt="zdjęcie profilowe"
						className="avatar"
						data-cy="avatar"
						onError={() => {
							setProfileAvatar(DEFAULT_AVATAR_IMAGE_URL)
						}}
					/>
					<h1 data-cy="user-name">{user.name}</h1>
					{user.biography && <p data-cy="user-biography">{user.biography}</p>}
					<Quizes quizes={user.userQuizes} />
				</>
			)}
		</ProfileContainer>
	)
}
