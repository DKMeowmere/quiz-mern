import { StyledContainer } from "./styles"

type Props = {
	children: any
	className?: string
}

export default function Container({ children, className }: Props) {
	return <StyledContainer className={className}>{children}</StyledContainer>
}
