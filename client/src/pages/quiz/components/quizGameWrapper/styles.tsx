import { styled } from "../../../../app/config"
import { Container } from "../../../../components/container/Index"

export const StartEndGameContainer = styled(Container)`
	width: 80%;
	max-width: 500px;
	text-align: center;
	h1 {
		font-size: 1.6rem;
		margin: 20px 0;
	}
	p {
		margin: 20px 0;
		font-size: 1.2rem;
	}
	img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}
	button {
		margin: 20px 0;
	}

	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		h1 {
			font-size: 2.4rem;
		}
	}

	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		max-width: 700px;
		h1 {
			font-size: 3rem;
		}
	}
`

export const QuestionViewContainer = styled(Container)`
	margin-top: 120px;
	text-align: center;
	max-width: 600px;
	.question-title {
		font-size: 2rem;
	}
	.error {
		font-size: 1.8rem;
		color: ${({ theme }) => theme.colors.errorMain};
		font-weight: bold;
		margin: 20px 0;
	}
	.question-image {
		margin: 20px 0;
		width: 70%;
		aspect-ratio: 16 / 9;
	}
	.question-audio {
		margin: 20px auto;
		width: 50%;
		height: auto;
	}
	.answers-container {
		width: 80%;
		max-width: 500px;
		margin: 40px auto 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		border-top: 2px solid ${({ theme }) => theme.colors.contrastMainBg};
		padding-top: 10px;
		.answer {
			width: 100%;
			.answer-error {
				font-size: 0.8rem;
				color: ${({ theme }) => theme.colors.errorMain};
				font-weight: bold;
				margin: 20px 0;
			}
			.answer-image {
				margin: 10px 0;
				width: 50%;
				aspect-ratio: 16 / 9;
				object-fit: cover;
			}
			.answer-audio {
				margin: 10px auto;
				width: 50%;
			}
			.answer-title {
				background-color: #fff;
				color: ${({ theme }) => theme.colors.blackText};
				padding: 10px;
				border-radius: 10px;
				cursor: pointer;
				border: 1px solid ${({ theme }) => theme.colors.blackText};
				letter-spacing: 1px;
				text-transform: uppercase;
				position: relative;
				.full-text-tooltip {
					visibility: hidden;
					background-color: #fff;
					color: ${({ theme }) => theme.colors.blackText};
					border: 1px solid ${({ theme }) => theme.colors.blackText};
					padding: 10px;
					position: absolute;
					top: -60px;
					font-size: 1rem;
					text-transform: none;
				}
				:hover,
				:active,
				:focus {
					.full-text-tooltip {
						visibility: visible;
					}
				}
			}
			.selected {
				background-color: ${({ theme }) => theme.colors.main};
				color: ${({ theme }) => theme.colors.whiteText};
				font-weight: bold;
			}
		}
	}

	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		max-width: 700px;
	}

	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		max-width: 900px;
		.question-title {
			font-size: 2.8rem;
		}
	}
`

export const AnsweredQuestionsContainer = styled.div`
	margin: 20px 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
	h2 {
		font-size: 1.4rem;
		margin: 20px 0;
	}
	.question {
		width: 100%;
		border-radius: 20px;
		color: ${({ theme }) => theme.colors.text};
		background-color: ${({ theme }) => theme.colors.darkMainBg};
		padding: 15px;
		.question-title {
			font-size: 1rem;
		}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		.question {
			.question-title {
				font-size: 1.3rem;
			}
		}
	}

	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		.question {
			.question-title {
				font-size: 1.6rem;
			}
		}
	}
`

type AnswerProps = {
	didUserAnswered: boolean
	isTrue: boolean
}

export const AnswerContainer = styled.div<AnswerProps>`
	display: flex;
	align-items: center;
	.answer-title {
		font-size: 0.8rem;
	}
	svg {
		width: 20px;
		height: 20px;
		margin: 0 10px;
		color: #787878;
		${({ didUserAnswered }) => didUserAnswered && "color: #fc0317;"}
		${({ isTrue }) => isTrue && "color: #2cfc03;"}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		.answer-title {
			font-size: 1.1rem;
		}
	}

	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		.answer-title {
			font-size: 1.4rem;
		}
	}
`
