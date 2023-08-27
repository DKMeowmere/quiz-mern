import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { CookiesProvider } from "react-cookie"
import { BrowserRouter } from "react-router-dom"
import { Provider as ReduxProvider } from "react-redux"
import store from "./app/store"
import ThemeProvider from "./components/providers/ThemeProvider"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ReduxProvider store={store}>
			<CookiesProvider>
				<BrowserRouter>
					<ThemeProvider>
						<App />
					</ThemeProvider>
				</BrowserRouter>
			</CookiesProvider>
		</ReduxProvider>
	</React.StrictMode>
)
