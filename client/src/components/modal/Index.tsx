import { RiCloseCircleFill } from "react-icons/ri"
import { ModalContainer } from "./styles"
import { useEffect } from "react"

type Props = {
	children: any
	setIsModalOpen: (isModalOpen: boolean) => void
	className?: string
}

export default function Modal({ children, setIsModalOpen, className }: Props) {
	useEffect(() => {
		document.body.style.overflow = "hidden"
		return () => {
			document.body.style.overflow = "scroll"
		}
	}, [])

	return (
		<ModalContainer className={className}>
			<RiCloseCircleFill onClick={() => setIsModalOpen(false)} />
			<div className="content">{children}</div>
		</ModalContainer>
	)
}
