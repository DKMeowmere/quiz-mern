import  {
	Component,
	ErrorInfo,
	PropsWithChildren,
} from "react"
import ErrorPage from "./ErrorBoundaryPage"

type State = {
	hasError: boolean
}

class ErrorBoundary extends Component<PropsWithChildren, State> {
	state: State = { hasError: false }

	public static getDerivedStateFromError(): State {
		return { hasError: true }
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo)
	}
	public render() {
		if (this.state.hasError) {
			return <ErrorPage />
		}

		return this.props.children
	}
}

export default ErrorBoundary
