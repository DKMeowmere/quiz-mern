import { useState, useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { MdLogout } from "react-icons/md"
import { BiEditAlt } from "react-icons/bi"
import { UserClient } from "@backend/types/user"
import { DEFAULT_AVATAR_IMAGE_URL } from "../../../../app/constants"
import { useAppSelector } from "../../../../app/config"
import { useLogin } from "../../../../hooks/useLogin"
import { useUtils } from "../../../../hooks/useUtils"
import { Quizes } from "../../../../components/quizes/Index"
import { ProfileContainer } from "./styles"

type Props = {
	user: UserClient
}

export function UserProfile({ user }: Props) {
	const { id } = useParams()
	const loggedUser = useAppSelector(state => state.app.user)
	const isAppLoading = useAppSelector(state => state.app.isAppLoading)
	const { logout } = useLogin()
	const [profileAvatar, setProfileAvatar] = useState(user.avatarLocation)
	const { validateFileUrl } = useUtils()

	const doesTheProfileBelongsToTheLoggedUser = useMemo(
		() => user._id === loggedUser?._id,
		[user, loggedUser]
	)

	return (
		<ProfileContainer>
			{!user && !isAppLoading && <h1>Nie znaleziono użytkownika</h1>}
			{user && (
				<>
					{doesTheProfileBelongsToTheLoggedUser && (
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
					{user.biography && (
						<p className="user-biography" data-cy="user-biography">
							&quot;{user.biography}&quot;
						</p>
					)}
					{user.userQuizes.length > 0 && (
						<>
							<h2>Quizy użytkownika:</h2>
							<Quizes quizes={user.userQuizes} />
						</>
					)}
				</>
			)}
		</ProfileContainer>
	)
}
