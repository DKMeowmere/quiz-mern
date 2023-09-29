export type Theme = {
	type: string
	media: {
		breakpoints: {
			xs: string
			sm: string
			md: string
			lg: string
			xl: string
		}
		containerWidth: {
			xs: string
			sm: string
			md: string
			lg: string
			xl: string
		}
	}
	colors: {
		text: string
		contrastText: string
		whiteText: string
		blackText: string
		main: string
		lightMainBg: string
		mainBg: string
		darkMainBg: string
		contrastMainBg: string
		errorMain: string
		errorSecondary: string
		warningMain: string
		warningSecondary: string
		successMain: string
		successSecondary: string
		infoMain: string
		infoSecondary: string
	}
}
