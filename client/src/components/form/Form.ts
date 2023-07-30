import { styled } from "../../app/config"

export const Form = styled.form`
	width: 90%;
	max-width: 500px;
	margin: auto;
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		max-width: 650px;
	}
`
