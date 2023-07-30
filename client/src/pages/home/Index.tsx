import { useAppSelector } from "../../app/config"
import { Button } from "../../components/button/Button"
import { HomeContainer } from "./styles"

export default function Home() {
	const theme = useAppSelector(state => state.app.theme)

	return (
		<HomeContainer>
			<h1>Twórz i rozwiązuj quizy</h1>
			<Button
				width="250px"
				height="50px"
				bgColor={theme.colors.main}
				textColor="#eee"
			>
				Stwórz quiz
			</Button>
			<h2>Nowe quizy</h2>
		</HomeContainer>
	)
}
