import { styled } from "../../app/config"
import { Container } from "../../components/container/Index"

export const ProfileContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: center;
	.right-icons-container {
		display: flex;
		gap: 15px;
		position: absolute;
		top: 100px;
		.icon {
			width: 60px;
			height: 60px;
			color: #fff;
			padding: 10px;
			background-color: ${({ theme }) => theme.colors.main};
			border-radius: 50%;
			cursor: pointer;
			&:hover {
				color: ${({ theme }) => theme.colors.main};
				background-color: ${({ theme }) => theme.colors.darkMainBg};
			}
		}
	}
	h1 {
		font-size: 4rem;
		text-align: center;
		margin-top: 20px;
	}
	.avatar {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		margin-top: 60px;
		object-fit: cover;
	}
	p {
		width: 85%;
		max-width: 500px;
		margin-top: 30px;
		font-size: 1.3rem;
		text-align: center;
	}
	h2 {
		font-size: 2rem;
		text-align: center;
		margin-top: 20px;
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.md}) {
		.right-icons-container {
			right: 40px;
		}
	}
	@media screen and (min-width: ${({ theme }) => theme.media.breakpoints.lg}) {
		h1 {
			font-size: 6rem;
		}
		.avatar {
			width: 400px;
			height: 400px;
			border-radius: 50%;
		}
		p {
			max-width: 750px;
			font-size: 1.8rem;
		}
		h2 {
			font-size: 4rem;
		}
	}
`
