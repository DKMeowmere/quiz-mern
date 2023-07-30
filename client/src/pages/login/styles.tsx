import { styled } from "../../app/config"
import { Form } from "../../components/form/Form"

export const LoginForm = styled(Form)`
	p {
		font-size: 1.5rem;
		text-align: center;
		margin-bottom: 40px;
	}
	button {
		margin: auto;
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
	}
	.create-account-link {
		margin-top: 60px;
		display: block;
	}
`
