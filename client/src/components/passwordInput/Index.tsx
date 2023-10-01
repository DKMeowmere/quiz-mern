import { useState } from "react"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { InputContainer } from "./styles"

type Props = {
	width: string
	height: string
	value: string
	onChange: React.ChangeEventHandler<HTMLInputElement>
	placeholder?: string
	className?: string
	dataCy?: string
}

export function PasswordInput({
	width,
	height,
	value,
	onChange,
	placeholder,
	className,
	dataCy,
}: Props) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	return (
		<InputContainer width={width} height={height}>
			<input
				type={isPasswordVisible ? "text" : "password"}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className={className}
				data-cy={dataCy}
			/>
			{isPasswordVisible ? (
				<AiFillEyeInvisible
					className="eye-icon"
					onClick={() => setIsPasswordVisible(false)}
				/>
			) : (
				<AiFillEye
					className="eye-icon"
					onClick={() => setIsPasswordVisible(true)}
				/>
			)}
		</InputContainer>
	)
}
