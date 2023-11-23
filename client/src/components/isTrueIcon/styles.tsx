import { styled } from "../../app/config"

type Props = {
	width?: string
	height?: string
	isTrue: boolean
	interactive?: boolean
}

export const IconContainer = styled.div<Props>`
	display: flex;
	justify-content: center;
	align-items: center;
	width: ${({ width }) => width || "40px"};
	height: ${({ height }) => height || "40px"};
	border-radius: 50%;
	background-color: ${({ theme, isTrue }) =>
		isTrue ? theme.colors.successMain : theme.colors.errorMain};
	cursor: ${({ interactive }) => (interactive ? "cursor" : "default")};
	svg {
		color: ${({ theme }) => theme.colors.whiteText};
	}
`
