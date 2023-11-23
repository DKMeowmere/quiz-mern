import { styled } from "../../../../app/config";
import { Container } from "../../../../components/container/Index";

export const QuizPageContainer = styled(Container)`
	text-align: center;
	h1 {
		font-size: 3rem;
	}
	.quiz-main-btns {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		margin: 10px 0;
	}
	.input-container {
		margin: 15px 0;
		p {
			font-size: 1.8rem;
			margin-bottom: 10px;
		}
		input {
			max-width: 500px;
			width: 100%;
			height: 50px;
			padding: 10px;
		}
		textarea {
			max-width: 500px;
		}
	}
	.quiz-image {
		margin: 20px 0;
		width: 100%;
		max-width: 600px;
		aspect-ratio: 16/9;
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		h1 {
			font-size: 4rem;
		}
		.input-container {
			input {
				max-width: 700px;
			}
			p {
				font-size: 2.4rem;
			}
			textarea {
				max-width: 700px;
			}
		}
	}
	.quiz-image {
		max-width: 900px;
	}
	.delete-quiz-btn {
		margin-top: 40px;
	}
`

