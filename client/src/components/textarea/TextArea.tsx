import { styled } from "../../app/config"

type Props = {
	width: string
	height: string
	maxWidth?: string
}

export const Textarea = styled.textarea<Props>`
	position: relative;
	width: ${({ width }) => width};
	max-width: ${({ maxWidth }) => maxWidth || "auto"};
	height: ${({ height }) => height};
	padding: 10px;
	resize: vertical;
	font-family: inherit;
`
