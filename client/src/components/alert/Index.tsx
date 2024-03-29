import { useAppDispatch, useAppSelector } from "../../app/config"
import { dequeueAlert } from "../../app/features/alertSlice"
import { AlertIcon } from "./AlertIcon"
import { Alert, AlertsContainer } from "./styles"

export function Alerts() {
	const alerts = useAppSelector(state => state.alert.alertsQueue)
	const alertLifeTime = useAppSelector(state => state.alert.alertLifeTime)
	const dispatch = useAppDispatch()

	return (
		<AlertsContainer>
			{alerts.map(alert => {
				setTimeout(() => {
					dispatch(dequeueAlert())
				}, alertLifeTime)

				return (
					<Alert type={alert.type} key={alert.id} data-cy="alert">
						<AlertIcon type={alert.type} />
						{alert.body}
					</Alert>
				)
			})}
		</AlertsContainer>
	)
}
