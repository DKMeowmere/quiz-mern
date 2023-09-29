import { css } from "styled-components"
import { styled } from "../../app/config"
import { AlertTypes } from "@backend/types/client/alert"

function getAlertColor(type: AlertTypes) {
	switch (type) {
		case "ERROR":
			return css`
				background-color: ${({ theme }) => theme.colors.errorSecondary};
				color: ${({ theme }) => theme.colors.errorMain};
				border: 1px solid ${({ theme }) => theme.colors.errorMain};
			`
		case "WARNING":
			return css`
				background-color: ${({ theme }) => theme.colors.warningSecondary};
				color: ${({ theme }) => theme.colors.warningMain};
				border: 1px solid ${({ theme }) => theme.colors.warningMain};
			`
		case "SUCCESS":
			return css`
				background-color: ${({ theme }) => theme.colors.successSecondary};
				color: ${({ theme }) => theme.colors.successMain};
				border: 1px solid ${({ theme }) => theme.colors.successMain};
			`
		case "INFO":
			return css`
				background-color: ${({ theme }) => theme.colors.infoSecondary};
				color: ${({ theme }) => theme.colors.infoMain};
				border: 1px solid ${({ theme }) => theme.colors.infoMain};
			`
	}
}

export const AlertsContainer = styled.section`
	position: fixed;
	z-index: 10000;
	left: 20px;
	bottom: 20px;
	display: flex;
	flex-direction: column-reverse;
	gap: 30px;
`

type Props = {
	type: AlertTypes
}

export const Alert = styled.div<Props>`
	padding: 10px 20px;
	display: flex;
	align-items: center;
	min-width: 70%;
	width: 400px;
	${({ type }) => getAlertColor(type)};
	&:nth-child(n + 4) {
		display: none;
	}
	svg {
		margin-right: 10px;
		scale: 150%;
	}
`
