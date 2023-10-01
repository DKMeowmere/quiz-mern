import { useEffect } from "react"
import { RiCloseCircleFill } from "react-icons/ri"
import { ModalContainer } from "./styles"

type Props = {
	children: any
	closeCallback: (...args: any[]) => void
	className?: string
}

export function Modal({
	children,
	closeCallback,
	className,
}: Props) {
	useEffect(() => {
		document.body.style.overflow = "hidden"
		return () => {
			document.body.style.overflow = "scroll"
		}
	}, [])

	return (
		<ModalContainer className={className}>
			<RiCloseCircleFill className="close-btn" onClick={closeCallback} />
			<div className="content">{children}</div>
		</ModalContainer>
	)
}
