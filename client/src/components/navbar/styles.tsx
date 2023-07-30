import { styled } from "../../app/config"

export const NavbarContainer = styled.nav`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	width: 100%;
	padding: 10px 20px;
	height: 60px;
	color: ${({ theme }) => theme.colors.text};
	background-color: ${({ theme }) => theme.colors.darkMainBg};
	border-bottom: ${({ theme }) => theme.colors.main} 2px solid;
	display: flex;
	align-items: center;
	box-shadow: 0px 0px 10px 2px
		${({ theme }) => (theme.type === "DARK" ? theme.colors.main : "#050505")};
	.right-container {
		display: flex;
		position: absolute;
		right: 30px;
		gap: 10px;
		.icon-container {
			width: 35px;
			height: 35px;
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			svg {
				color: ${({ theme }) => theme.colors.text};
				width: 90%;
				height: 90%;
			}
		}
	}
	.avatar {
		width: 50px;
		aspect-ratio: 1/1;
		border-radius: 50%;
		object-fit: cover;
	}
`
