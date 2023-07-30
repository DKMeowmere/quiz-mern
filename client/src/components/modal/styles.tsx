import { styled } from "../../app/config"

export const ModalContainer = styled.div`
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	background-color: #000000bb;
	display: flex;
	align-items: center;
	justify-content: center;
	svg {
		position: absolute;
		top: 40px;
		right: 40px;
		color: #fff;
		width: 60px;
		height: 60px;
		cursor: pointer;
	}
	.content {
		width: 80%;
		max-width: 800px;
		background-color: #fff;
		padding: 20px;
		border-radius: 20px;
		height: 500px;
		overflow-y: scroll;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		.content {
			max-width: 1000px;
		}
	}
`
