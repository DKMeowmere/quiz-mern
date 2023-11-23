import { styled } from "../../../../app/config"

export const QuestionsViewContainer = styled.section`
	width: 100%;
	height: 500px;
	overflow-x: visible;
	position: relative;
	.arrow {
		position: absolute;
		top: 50%;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: ${({ theme }) => theme.colors.main};
		display: flex;
		align-items: center;
		cursor: pointer;
		&:hover {
			box-shadow: 0px 0px 25px 0px ${({ theme }) => theme.colors.main};
		}
		svg {
			color: ${({ theme }) => theme.colors.whiteText};
			width: 80%;
			height: 80%;
		}
	}
	.left {
		left: -15px;
		justify-content: flex-start;
		svg {
			margin-left: 2px;
		}
	}
	.right {
		right: -15px;
		justify-content: flex-end;
		svg {
			margin-right: 2px;
		}
	}
	.title {
		margin: 10px;
		font-size: 2.8rem;
	}
`

export const QuestionContainer = styled.div`
	margin-top: 20px;
	max-height: 400px;
	overflow-y: scroll;
	border-bottom: 1px solid ${({ theme }) => theme.colors.text};
	.question-title {
		letter-spacing: 1.5;
		font-size: 1.5rem;
	}
	.question-image {
		margin: 10px;
		width: 50%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}
	.question-audio-player {
		margin: auto;
	}
	.delete-question-btn {
		margin: 20px auto;
	}
	.answer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 100%;
		margin-top: 10px;
		border-top: 1px solid ${({ theme }) => theme.colors.text};
		.answer-title {
			margin-top: 10px;
			font-size: 1.5rem;
		}
		.is-true-icon {
			margin: auto;
		}
		.answer-image {
			margin: 10px;
			width: 50%;
			aspect-ratio: 16 / 9;
			object-fit: cover;
		}
	}
`
