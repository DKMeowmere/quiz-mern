import { styled } from "../../app/config"

type Props = {
	width: string
	height: string
	bgColor: string
	textColor: string
}

export const Button = styled.button<Props>`
	width: ${({ width }) => width};
	height: ${({ height }) => height};
	background-color: ${({ bgColor }) => bgColor};
	color: ${({ textColor }) => textColor};
	padding: 5px 10px;
	cursor: pointer;
	text-transform: uppercase;
	letter-spacing: 1.6px;
	font-weight: bold;
	border: none;
	border-radius: 10px;
	&:hover {
		box-shadow: 0px 0px 25px 0px ${({ bgColor }) => bgColor};
	}
`
