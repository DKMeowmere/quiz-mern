import { Link } from "react-router-dom"
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs"
import { AiFillHome } from "react-icons/ai"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { setTheme, setUser } from "../../app/features/appSlice"
import { Button } from "../button/Button"
import { NavbarContainer } from "./styles"
import { DEFAULT_AVATAR_IMAGE_URL } from "../../app/constants"
import { useUtils } from "../../hooks/useUtils"

export function Navbar() {
	const themeType = useAppSelector(state => state.app.themeType)
	const theme = useAppSelector(state => state.app.theme)
	const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
	const user = useAppSelector(state => state.app.user)
	const dispatch = useAppDispatch()
	const {validateFileUrl} = useUtils()

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
						src={validateFileUrl(user.avatarLocation)}
						alt="zdjęcie profilowe"
						className="avatar"
						onError={() =>
							dispatch(
								setUser({ ...user, avatarLocation: DEFAULT_AVATAR_IMAGE_URL })
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
