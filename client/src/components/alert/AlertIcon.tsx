import { AlertTypes } from "../../types/alert"
import { MdError, MdInfo, MdWarning, MdDone } from "react-icons/md"

type Props = {
	type: AlertTypes
}

export function AlertIcon({ type }: Props) {
	switch (type) {
		case "ERROR":
			return <MdError />
		case "WARNING":
			return <MdWarning />
		case "SUCCESS":
			return <MdDone />
		case "INFO":
			return <MdInfo />
		default:
			return <MdInfo />
	}
}