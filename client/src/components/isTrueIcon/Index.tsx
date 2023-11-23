import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai"
import { IconContainer } from "./styles"

type Props = {
	width?: string
	height?: string
	isTrue: boolean
	interactive?: boolean
	[key: string]: any
}

export function IsTrueIcon({
	isTrue,
	width,
	height,
	interactive,
	...rest
}: Props) {
	return (
		<IconContainer
			isTrue={isTrue}
			width={width}
			height={height}
			interactive={interactive }
			{...rest}
		>
			{isTrue ? <AiOutlineCheck /> : <AiOutlineClose />}
		</IconContainer>
	)
}
