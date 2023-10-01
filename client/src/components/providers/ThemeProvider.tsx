import { ThemeProvider as Theme } from "styled-components"
import { useAppSelector } from "../../app/config"

type Props = {
	children: any
}

export function ThemeProvider({ children }: Props) {
	const theme = useAppSelector(state => state.app.theme)

	return <Theme theme={theme}>{children}</Theme>
}
