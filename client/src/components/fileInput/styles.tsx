import { styled } from "../../app/config"

export const FileInputContainer = styled.div<{
	width: string
	maxWidth?: string
	bgColor?: string
}>`
	input[type="file"] {
		display: none;
	}
	label {
		width: ${({ width }) => width};
		max-width: ${({ maxWidth }) => maxWidth || "500px"};
		margin: 15px auto;
		display: block;
		cursor: pointer;
		padding: 10px;
		background: ${({ theme, bgColor }) =>
			bgColor ? bgColor : theme.colors.lightMainBg};
		border: 2px solid ${({ theme }) => theme.colors.main};
		box-shadow: 0px 0px 10px 2px
			${({ theme }) => (theme.type === "DARK" ? theme.colors.main : "#050505")};
		&:hover {
			background-color: ${({ theme }) => theme.colors.main};
			border-radius: 20px;
			scale: 1.05;
			color: #f8f7f7;
			box-shadow: 0px 0px 15px 5px ${({ theme }) => theme.colors.main};
		}
	}
`
