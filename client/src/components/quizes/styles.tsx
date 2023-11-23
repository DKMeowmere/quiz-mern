import { styled } from "../../app/config"

export const QuizesContainer = styled.div`
	display: flex;
	gap: 25px;
	flex-direction: column;
	width: 90%;
	align-items: center;
	margin-top: 40px;
	max-width: 600px;
	.quiz {
		background-color: ${({ theme }) => theme.colors.darkMainBg};
		height: 120px;
		width: 100%;
		border-radius: 20px;
		display: flex;
		cursor: pointer;
		position: relative;
		transition: border 0s linear;
		&:hover {
			border: ${({ theme }) => theme.colors.contrastMainBg} 2px solid;
		}
		img {
			border-radius: 20px 0 0 20px;
			width: 120px;
			height: 100%;
			object-fit: cover;
		}
		.right-container {
			margin-left: 10px;
			width: calc(80% - 140px);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.quiz-title {
				font-size: 1.2rem;
				margin-top: 0;
			}
			.subtitle {
				margin-top: 5px;
				font-size: 0.8rem;
			}
		}
		.edit-quiz-link {
			width: 40px;
			height: 40px;
			position: absolute;
			top: 10px;
			right: 13px;
			background-color: ${({ theme }) => theme.colors.darkMainBg};
			color: ${({ theme }) => theme.colors.contrastMainBg};
			border: ${({ theme }) => theme.colors.contrastMainBg} 1px solid;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			svg {
				width: 80%;
				height: 80%;
			}
			&:hover {
				scale: 1.2;
			}
		}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		max-width: 800px;
		.quiz {
			height: 200px;
			img {
				width: 200px;
			}
			.right-container {
				width: calc(100% - 200px);
				.quiz-title {
					font-size: 1.8rem;
				}
				.subtitle {
					margin-top: 8px;
					font-size: 1.2rem;
				}
			}
		}
	}
`
