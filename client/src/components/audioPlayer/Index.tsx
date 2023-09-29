import { AiFillPlayCircle, AiOutlinePause } from "react-icons/ai"
import { PlayerContainer } from "./styles"
import useAudio from "./useAudio"

type Props = {
	url: string | null
	width?: string
	height?: string
	[key: string]: any
}

export function AudioPlayer({ url, width, height, ...rest }: Props) {
	const { isAudioPlaying, pauseAudio, playAudio } = useAudio()

	function togglePlayingStatus() {
		isAudioPlaying ? pauseAudio() : playAudio(url)
	}

	return (
		<PlayerContainer
			{...rest}
			width={width}
			height={height}
			onClick={togglePlayingStatus}
		>
			{isAudioPlaying ? <AiOutlinePause /> : <AiFillPlayCircle />}
		</PlayerContainer>
	)
}
