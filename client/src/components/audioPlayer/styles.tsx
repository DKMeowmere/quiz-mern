import { styled } from "../../app/config"

type Props = {
	width?: string
	height?: string
}

export const PlayerContainer = styled.div<Props>`
	width: ${({ width }) => width || "100%"};
	height: ${({ height }) => height || "100%"};
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	svg {
		width: 50%;
		height: 50%;
		color: ${({ theme }) => theme.colors.main};
	}
`
