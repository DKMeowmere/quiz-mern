import { useState } from "react"
import { useAppSelector } from "../../../../app/config"
import { useUser } from "../../hooks/useUser"
import { Modal } from "../../../../components/modal/Index"
import { Button } from "../../../../components/button/Button"

export function DeleteUserButton() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const theme = useAppSelector(state => state.app.theme)
	const { deleteAccount } = useUser()

	return (
		<>
			<Button
				bgColor={theme.colors.errorMain}
				height="40px"
				width="100%"
				textColor="#fefefe"
				onClick={() => setIsModalOpen(true)}
				type="button"
				className="delete-account-btn"
				data-cy="open-delete-account-modal-btn"
			>
				Usuń konto
			</Button>
			{isModalOpen && (
				<Modal closeCallback={() => setIsModalOpen(false)} className="modal">
					<p>Na pewno? Ta akcja jest nieodwracalna</p>
					<Button
						bgColor={theme.colors.errorMain}
						height="50px"
						width="50%"
						textColor="#fefefe"
						onClick={() => deleteAccount()}
						type="button"
						data-cy="delete-account-btn"
					>
						Usuń konto
					</Button>
				</Modal>
			)}
		</>
	)
}
