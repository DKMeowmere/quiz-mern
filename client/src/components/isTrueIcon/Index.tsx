import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai"
import { IconContainer } from "./styles"

type Props = {
	width?: string
	height?: string
	isTrue: boolean
	[key: string]: any
}

export function IsTrueIcon({ isTrue, width, height, ...rest }: Props) {
	return (
		<IconContainer isTrue={isTrue} width={width} height={height} {...rest}>
			{isTrue ? <AiOutlineCheck /> : <AiOutlineClose />}
		</IconContainer>
	)
}
