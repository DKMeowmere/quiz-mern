import { styled } from "../../app/config"
import { Container } from "../../components/container/Index"

export const HomeContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	h1 {
		font-size: 2rem;
		margin-bottom: 40px;
	}
	a {
		width: 100%;
	}
	.search-bar-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80%;
		max-width: 600px;
		margin: 20px 0;
		svg {
			width: 60px;
			height: 60px;
			padding: 10px;
			color: ${({ theme }) => theme.colors.whiteText};
			background-color: ${({ theme }) => theme.colors.main};
			border-radius: 10px 0 0 10px;
		}
		input {
			padding: 10px;
			height: 60px;
			width: 80%;
		}
	}
	h2 {
		font-size: 2rem;
		margin-top: 20px;
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		h1 {
			font-size: 3rem;
		}
	}
`