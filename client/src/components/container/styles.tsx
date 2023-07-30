import { styled } from "../../app/config"

export const StyledContainer = styled.article`
	width: ${({ theme }) => theme.media.containerWidth.xs};
	margin: 120px auto 40px auto;
	color: ${({ theme }) => theme.colors.text};
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.sm}) {
		width: ${({ theme }) => theme.media.containerWidth.sm};
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		width: ${({ theme }) => theme.media.containerWidth.md};
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		width: ${({ theme }) => theme.media.containerWidth.lg};
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.xl}) {
		width: ${({ theme }) => theme.media.containerWidth.xl};
	}
`
