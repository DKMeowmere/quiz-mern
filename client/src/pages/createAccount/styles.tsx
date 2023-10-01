import { styled } from "../../app/config"
import { Form } from "../../components/form/Form"

export const RegisterForm = styled(Form)`
	text-align: center;
	h1 {
		font-size: 3rem;
		margin-bottom: 20px;
	}
	.input-container {
		width: 100%;
		margin-bottom: 20px;
		p {
			font-size: 1.4rem;
			text-align: center;
			margin-bottom: 10px;
		}
		input {
			height: 60px;
			padding: 10px 20px;
			width: 100%;
			font-size: 1.3rem;
		}
		.avatar-preview {
			margin: auto;
			width: 80%;
			border-radius: 50%;
			aspect-ratio: 1/1;
			object-fit: cover;
		}
	}
`
