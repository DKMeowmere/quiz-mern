import { Quiz as QuizType } from "../../types/quiz"

export const quizText: QuizType = {
	title: "quiz title",
	questions: [
		{
			title: "question title",
			type: "TEXT",
			answers: [
				{
					title: "Quiz anwser 1",
					isTrue: true,
					type: "TEXT",
				},
				{
					title: "Quiz anwser 2",
					isTrue: false,
					type: "IMAGE",
				},
				{
					title: "Quiz anwser 3",
					isTrue: false,
					type: "TEXT",
				},
				{
					title: "Quiz anwser 4",
					isTrue: false,
					type: "TEXT",
				},
			],
		},
		{
			title: "question title with file",
			type: "IMAGE",
			answers: [
				{
					title: "Quiz anwser 1",
					isTrue: true,
					type: "TEXT",
				},
				{
					title: "Quiz anwser 2",
					isTrue: false,
					type: "IMAGE",
				},
				{
					title: "Quiz anwser 3",
					isTrue: false,
					type: "TEXT",
				},
				{
					title: "Quiz anwser 4",
					isTrue: false,
					type: "TEXT",
				},
			],
		},
	],
}
