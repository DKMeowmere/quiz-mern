import { FileInputContainer } from "./styles"

type Props = {
	width: string
	text: string
	id: string
	dataCy: string
	maxWidth?: string
	bgColor?: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FileInput({
	width,
	onChange,
	text,
	dataCy,
	id,
	maxWidth,
	bgColor,
}: Props) {
	return (
		<FileInputContainer width={width} maxWidth={maxWidth} bgColor={bgColor}>
			<label htmlFor={id}>{text}</label>
			<input id={id} data-cy={dataCy} type="file" onChange={onChange} />
		</FileInputContainer>
	)
}
