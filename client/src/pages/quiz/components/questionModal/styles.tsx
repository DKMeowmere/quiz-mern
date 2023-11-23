import { styled } from "../../../../app/config"
import { Modal } from "../../../../components/modal/Index"

export const QuestionModalContainer = styled(Modal)`
	.content {
		gap: 20px;
		justify-content: flex-start;
		.main-content {
			height: 70vh;
			width: 100%;
			overflow-x: scroll;
			.title {
				font-size: 3rem;
				margin-bottom: 40px;
				font-weight: 700;
				letter-spacing: 1px;
			}
			.input-container {
				width: 100%;
				margin: 20px auto;
				max-width: 500px;
				p {
					font-size: 2.2rem;
				}
				input {
					padding: 10px;
					height: 40px;
				}
				.question-types {
					width: 80%;
					margin: auto;
					display: flex;
					justify-content: space-evenly;
					.type-btn {
						border: ${({ theme }) => theme.colors.main} 2px solid;
					}
					.active {
						color: #fff;
						background-color: ${({ theme }) => theme.colors.main};
						border: none;
					}
				}
				.question-image {
					width: 100%;
					aspect-ratio: 16 / 9;
					object-fit: cover;
				}
				.audio-player {
					margin: auto;
				}
			}
		}
		.btns-container {
			width: 100%;
			display: flex;
			gap: 10px;
			button {
				svg {
					margin-right: 0px;
				}
				.text {
					display: none;
				}
			}
		}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		.content {
			.btns-container {
				button {
					svg {
						margin-right: 10px;
					}
					.text {
						display: inline;
					}
				}
			}
		}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		.content {
			.main-content {
				.input-container {
					max-width: 700px;
				}
			}
		}
	}
`

export const AnswersContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 10px;
`

export const AnswerFormContainer = styled.div`
	margin-bottom: 40px;
	position: relative;
	width: calc(100% - 20px);
	.row {
		margin-top: 10px;
		display: flex;
		gap: 10px;
		justify-content: center;
		align-items: center;
	}
	.answer-type-icon-btn {
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: ${({ theme }) => theme.colors.main};
		color: ${({ theme }) => theme.colors.whiteText};
		cursor: pointer;
		border-radius: 75%;
		border: none;
		&:hover {
			scale: 1.1;
		}
		svg {
			width: 50%;
			height: 50%;
		}
	}
	.active {
		box-shadow: 0px 0px 25px 0px ${({ theme }) => theme.colors.main};
	}
	.type-symbol {
		width: 80%;
		height: 200px;
		margin: 10px auto;
		display: flex;
		align-items: center;
		justify-content: center;
		.text-icon {
			width: 50%;
			height: 50%;
			color: ${({ theme }) => theme.colors.main};
		}
		.answer-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&:before {
		content: "";
		display: block;
		bottom: -20px;
		left: 20%;
		position: absolute;
		width: 60%;
		height: 4px;
		background-color: #4a4949;
		border-radius: 4px;
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.sm}) {
		.type-symbol {
			width: 60%;
		}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		width: calc(50% - 20px);
	}
`
