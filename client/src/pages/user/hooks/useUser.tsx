import { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/config"
import {
	endLoading,
	setUser,
	startLoading,
} from "../../../app/features/appSlice"
import { enqueueAlert } from "../../../app/features/alertSlice"
import { useUtils } from "../../../hooks/useUtils"
import { useLogin } from "../../../hooks/useLogin"

export function useUser() {
	const user = useAppSelector(state => state.app.user)
	const token = useAppSelector(state => state.app.token)
	const { handleErrorWithAlert, getFileFromUrl } = useUtils()
	const { logout } = useLogin()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	function setAvatar(files: FileList | null) {
		if (!files || !files[0] || !user) {
			return
		}
		const file = files[0]
		const fileExt = file.name.split(".").pop() || ""
		const acceptedExts = new Set(["jpg", "png", "jpeg"])

		if (!acceptedExts.has(fileExt)) {
			dispatch(
				enqueueAlert({
					body: "Plik musi mieć rozszerzenie .png, .jpg albo .jpeg",
					type: "ERROR",
				})
			)
			return
		}

		const url = URL.createObjectURL(file)
		dispatch(setUser({ ...user, avatarLocation: url }))
	}

	function removeAvatar() {
		if (!user?.avatarLocation) {
			return
		}

		URL.revokeObjectURL(user.avatarLocation)
		dispatch(setUser({ ...user, avatarLocation: undefined }))
	}

	async function editAccount(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		try {
			if (!user) {
				throw new Error("Nieoczekiwany błąd")
			}

			if (!user.name) {
				throw new Error("Wprowadź nazwe")
			}

			const avatar = await getFileFromUrl(user.avatarLocation, "avatar.png")

			if (!avatar) {
				throw new Error("Dodaj zdjęcie profilowe")
			}

			const formData = new FormData()
			formData.append("name", user.name)
			formData.append("biography", user.biography)
			avatar && formData.append("avatar", avatar)

			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/api/user/${user._id}`,
				{
					body: formData,
					method: "PATCH",
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}
      console.log("DATA")
			setUser(data)
			dispatch(
				enqueueAlert({
					body: "Zaaktualizowano profil się pomyślnie",
					type: "SUCCESS",
				})
			)
			endLoading()
		} catch (err: unknown) {
			handleErrorWithAlert(err)
		}
	}

	async function deleteAccount() {
		try {
			if (!user) {
				throw new Error("Nieoczekiwany błąd")
			}

			dispatch(startLoading())
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/api/user/${user._id}`,
				{
					method: "DELETE",
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}

			logout()
			dispatch(
				enqueueAlert({ type: "SUCCESS", body: "Usunięto konto pomyślnie" })
			)
			dispatch(endLoading())
			navigate("/")
		} catch (err) {
			handleErrorWithAlert(err)
		}
	}

	return { editAccount, deleteAccount, setAvatar, removeAvatar }
}
