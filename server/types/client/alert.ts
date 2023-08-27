export type AlertTypes = "ERROR" | "WARNING" | "SUCCESS" | "INFO"

export type Alert = {
	id: string
	body: string
	type: AlertTypes
}

export type Alerts = Alert[]

export type AlertState = {
	alertLifeTime: number
	alertsQueue: Alerts
}
