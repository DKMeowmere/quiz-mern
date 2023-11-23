import { styled } from "../../../../app/config"

export const QuestionListContainer = styled.div`
	margin: 50px auto 20px;
	max-width: 400px;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 25px;
	flex-direction: column;
	.question {
		position: relative;
		width: 100%;
		height: 80px;
		cursor: pointer;
		color: ${({ theme }) => theme.colors.blackText};
		display: flex;
		align-items: center;
		gap: 5px;
		background-color: #e8e8e8;
		border: ${({ theme }) =>
			theme.type === "LIGHT" ? "1px solid #000" : "none"};
		border-radius: 20px;
		.title {
			margin-left: 5px;
		}
		.left-block {
			height: 100%;
			border-radius: 20px 0 0 20px;
			aspect-ratio: 1 / 1;
			background: linear-gradient(132deg, #f8f4f4 0%, #a29d9d 100%);
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: default;
			.text-icon {
				width: 50%;
				height: 50%;
				color: ${({ theme }) => theme.colors.main};
			}
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
		.answers-list {
			position: absolute;
			right: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			gap: 2px;
		}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		max-width: 600px;
	}
`
