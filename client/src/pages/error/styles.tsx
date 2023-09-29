import { styled } from "../../app/config"
import Container from "../../components/container/Index"

export const ErrorPageContainer = styled(Container)`
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 20px;
	background-color: ${({ theme }) => theme.colors.mainBg};
	color: ${({ theme }) => theme.colors.text};
	button {
		margin: 20px;
	}
`
