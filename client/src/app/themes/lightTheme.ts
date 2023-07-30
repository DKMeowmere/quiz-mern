import { Theme } from "../../types/theme"

const lightTheme: Theme = {
	type: "LIGHT",
	media: {
		breakpoints: {
			xs: "0px",
			sm: "600px",
			md: "900px",
			lg: "1200px",
			xl: "1536px",
		},
		containerWidth: {
			xs: "90%",
			sm: "90%",
			md: "80%",
			lg: "1080px",
			xl: "1380px",
		},
	},
	colors: {
		text: "#080808",
		main: "#10700b",
		lightMainBg: "#fff",
		mainBg: "#e8e8e8",
		darkMainBg: "#d1d1d1",
		errorMain: "#da5252",
		errorSecondary: "#fdeded",
		warningMain: "#ee7f23",
		warningSecondary: "#fff4e5",
		successMain: "#458b49",
		successSecondary: "#edf7ed",
		infoMain: "#319eda",
		infoSecondary: "#e5f6fd",
	},
}

export default lightTheme
