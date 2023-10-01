import { MdError, MdInfo, MdWarning, MdDone } from "react-icons/md"
import { AlertTypes } from "@backend/types/client/alert"

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
