import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs"
import { AiFillHome } from "react-icons/ai"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { setTheme } from "../../app/features/appSlice"
import { Button } from "../button/Button"
import { NavbarContainer } from "./styles"

export function Navbar() {
	const themeType = useAppSelector(state => state.app.themeType)
	const theme = useAppSelector(state => state.app.theme)
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const user = useAppSelector(state => state.app.user)
	const dispatch = useAppDispatch()
	const [avatarUrl, setAvatarUrl] = useState(
		`${import.meta.env.VITE_SERVER_URL}${user?.avatarLocation}` ||
			`${import.meta.env.VITE_SERVER_URL}/static/defaultAvatar.jpg`
	)

	useEffect(() => {
		if (user) {
			setAvatarUrl(`${import.meta.env.VITE_SERVER_URL}${user?.avatarLocation}`)
		}
	}, [user])

	return (
		<NavbarContainer>
			{!isLoggedIn && (
				<Link to="/login">
					<Button
						bgColor={theme.colors.main}
						width="auto"
						height="40px"
						textColor="#efefef"
					>
						Logowanie
					</Button>
				</Link>
			)}
			{isLoggedIn && user && (
				<Link to={`/user/${user?._id}`}>
					<img
						src={avatarUrl}
						alt="zdjęcie profilowe"
						className="avatar"
						onError={() =>
							setAvatarUrl(
								`${import.meta.env.VITE_SERVER_URL}/static/defaultAvatar.jpg`
							)
						}
					/>
				</Link>
			)}
			<div className="right-container">
				<Link to="/" className="icon-container">
					<AiFillHome />
				</Link>
				<div
					className="icon-container"
					data-cy="theme-btn"
					onClick={() => {
						if (themeType === "LIGHT") {
							dispatch(setTheme("DARK"))
						} else {
							dispatch(setTheme("LIGHT"))
						}
					}}
				>
					{themeType === "LIGHT" && <BsFillSunFill />}
					{themeType === "DARK" && <BsFillMoonFill />}
				</div>
			</div>
		</NavbarContainer>
	)
}
