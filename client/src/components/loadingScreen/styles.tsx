import { styled } from "../../app/config"
import { keyframes } from "styled-components"

const loadingAnimation = keyframes`
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
`

export const LoadingScreenContainer = styled.div`
	width: 100%;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	background-color: #000000bb;
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
	svg {
		width: 150px;
		height: 150px;
		color: ${({ theme }) => theme.colors.main};
		animation-name: ${loadingAnimation};
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
`
