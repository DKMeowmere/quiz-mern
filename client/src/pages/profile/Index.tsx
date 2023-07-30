import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { endLoading, startLoading } from "../../app/features/appSlice"
import { User } from "../../types/user"
import { ProfileContainer } from "./styles"
import { MdLogout } from "react-icons/md"
import { BiEditAlt } from "react-icons/bi"
import useLogin from "../../hooks/useLogin"
import Quizes from "../../components/quizes/Index"
import useUtils from "../../hooks/useUtils"

export default function Profile() {
	const { id } = useParams()
	const dispatch = useAppDispatch()
	const loggedUser = useAppSelector(state => state.app.user)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const { logout } = useLogin()
	const [user, setUser] = useState<User | null>(null)
	const [profileAvatar, setProfileAvatar] = useState(
		`${import.meta.env.VITE_SERVER_URL}/static/defaultAvatar.jpg`
	)
	const { handleErrorWithAlert } = useUtils()

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
						src={`${import.meta.env.VITE_SERVER_URL}${profileAvatar}`}
						alt="zdjęcie profilowe"
						className="avatar"
						onError={() => {
							setProfileAvatar(
								`${import.meta.env.VITE_SERVER_URL}/static/defaultAvatar.jpg`
							)
						}}
					/>
					<h1>{user.name}</h1>
					{user.biography && <p>{user.biography}</p>}
					<Quizes quizes={user.userQuizes} />
				</>
			)}
		</ProfileContainer>
	)
}
