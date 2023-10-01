import { useState, useEffect } from "react"
import { useAppDispatch } from "../../app/config"
import { enqueueAlert } from "../../app/features/alertSlice"

export function useAudio() {
	const [audio, setAudio] = useState<HTMLAudioElement>()
	const [isAudioPlaying, setIsAudioPlaying] = useState(false)
	const dispatch = useAppDispatch()

	function endPlaying() {
		setIsAudioPlaying(false)
	}

	useEffect(() => {
		audio?.addEventListener("ended", endPlaying)

		return () => audio?.removeEventListener("ended", endPlaying)
	}, [audio])

	function playAudio(url?: string | null) {
		if (!url) {
			dispatch(enqueueAlert({ body: "Audio nie istnieje", type: "INFO" }))
			return
		}

		const newAudio = new Audio(url)

		setAudio(newAudio)
		setIsAudioPlaying(true)
		newAudio.play()
	}

	function pauseAudio() {
		audio?.pause()
		setIsAudioPlaying(false)
	}

	return { playAudio, pauseAudio, isAudioPlaying }
}
