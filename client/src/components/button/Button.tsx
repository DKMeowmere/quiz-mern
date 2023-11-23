import { styled } from "../../app/config"

type Props = {
	width?: string
	maxWidth?: string
	height?: string
	bgColor?: string
	textColor?: string
	onlyIcon?: boolean
	disabled?: boolean
}

export const Button = styled.button<Props>`
	width: ${({ width }) => width || "auto"};
	max-width: ${({ maxWidth }) => maxWidth || "auto"};
	height: ${({ height }) => height || "auto"};
	background-color: ${({ bgColor, theme }) => bgColor || theme.colors.main};
	color: ${({ textColor, theme }) => textColor || theme.colors.whiteText};
	padding: 5px 10px;
	cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
	text-transform: uppercase;
	letter-spacing: 1.6px;
	font-weight: bold;
	border: none;
	border-radius: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	&:hover {
		box-shadow: 0px 0px 25px 0px
			${({ bgColor, disabled }) => (disabled ? "none" : bgColor)};
	}
	svg {
		width: 25px;
		height: 25px;
		margin-right: ${({ onlyIcon }) => (onlyIcon ? "0px" : "12px")};
	}
`
