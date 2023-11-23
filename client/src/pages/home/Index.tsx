import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { IoMdSearch } from "react-icons/io"
import { QuizClient } from "@backend/types/quiz"
import { useAppDispatch, useAppSelector } from "../../app/config"
import { endLoading, startLoading } from "../../app/features/appSlice"
import { SERVER_URL } from "../../app/constants"
import { useUtils } from "../../hooks/useUtils"
import { Button } from "../../components/button/Button"
import { Quizes } from "../../components/quizes/Index"
import { HomeContainer } from "./styles"

export function Home() {
	const theme = useAppSelector(state => state.app.theme)
	const [quizes, setQuizes] = useState<QuizClient[]>([])
	const [query, setQuery] = useState("")
	const { handleErrorWithAlert } = useUtils()
	const dispatch = useAppDispatch()
	const filteredQuizes = useMemo(
		() =>
			query
				? quizes.filter(quiz =>
						quiz.title.toLowerCase().includes(query.toLowerCase())
				  )
				: quizes.slice(0, 20),
		[query, quizes]
	)

	useEffect(() => {
		async function getQuizes() {
			try {
				dispatch(startLoading())

				const res = await fetch(`${SERVER_URL}/api/quiz`)
				const data = await res.json()

				if (!res.ok) {
					throw new Error(data.error)
				}

				setQuizes(data)
				dispatch(endLoading())
			} catch (err: any) {
				handleErrorWithAlert(err)
			}
		}

		getQuizes()
	}, [])

	return (
		<HomeContainer>
			<h1>Twórz i rozwiązuj quizy</h1>
			<Link to="/quiz/create">
				<Button
					width="100%"
					maxWidth="250px"
					height="50px"
					bgColor={theme.colors.main}
					textColor="#eee"
				>
					Stwórz quiz
				</Button>
			</Link>
			<div className="search-bar-container">
				<IoMdSearch />
				<input
					placeholder="Wyszukaj quiz..."
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>
			</div>
			{quizes.length > 0 && (
				<>
					<h2>Quizy:</h2>
					<Quizes quizes={filteredQuizes} />
				</>
			)}
		</HomeContainer>
	)
}
