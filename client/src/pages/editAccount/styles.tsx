import { styled } from "../../app/config"
import { Form } from "../../components/form/Form"
import { Container } from "../../components/container/Index"

export const EditAccountContainer = styled(Container)`
	text-align: center;
	h2 {
		font-size: 2rem;
		margin-bottom: 20px;
	}
	h1 {
		font-size: 3rem;
		margin-bottom: 20px;
	}
	.modal {
		p {
			font-size: 2rem;
			margin-bottom: 20px;
			color: #121212;
		}
	}
`

export const EditAccountForm = styled(Form)`
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
			margin: 25px auto 0 auto;
			width: 80%;
			border-radius: 50%;
			aspect-ratio: 1/1;
			object-fit: cover;
		}
	}
	.delete-account-btn {
		margin: 15px 0;
	}
`
