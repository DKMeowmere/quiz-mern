import { useEffect } from "react"
import { RiCloseCircleFill } from "react-icons/ri"
import { ModalContainer } from "./styles"

type Props = {
	children: any
	closeCallback: (...args: any[]) => void
	className?: string
	[key: string]: any
}

export function Modal({ children, closeCallback, className, ...rest }: Props) {
	useEffect(() => {
		document.body.style.overflow = "hidden"
		return () => {
			document.body.style.overflow = "scroll"
		}
	}, [])

	return (
		<ModalContainer className={className} {...rest}>
			<RiCloseCircleFill
				className="close-btn"
				onClick={closeCallback}
				data-cy="close-modal-btn"
			/>
			<div className="content">{children}</div>
		</ModalContainer>
	)
}
