import { styled } from "../../app/config"

export const QuizesContainer = styled.div`
	display: flex;
	gap: 25px;
	flex-direction: column;
	width: 90%;
	align-items: center;
	max-width: 600px;
	margin-top: 40px;
	.quiz {
		background-color: ${({ theme }) => theme.colors.darkMainBg};
		height: 120px;
		width: 100%;
		border-radius: 20px;
		display: flex;
		cursor: pointer;
		&:hover {
			scale: 1.1;
		}
		img {
			border-radius: 20px 0 0 20px;
			width: 120px;
			height: 100%;
		}
		.right-container {
			margin-left: 10px;
			width: calc(100% - 140px);
			.quiz-title {
				font-size: 1.2rem;
				margin-bottom: 15px;
			}
			.subtitle {
				margin-top: 5px;
				font-size: 0.8rem;
			}
		}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		.quiz {
			height: 200px;
			img {
				width: 200px;
			}
			.right-container {
				width: calc(100% - 200px);
			}
		}
	}
`
