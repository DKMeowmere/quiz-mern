import { Quiz as QuizType } from "../../types/quiz"

export const quizPayload: QuizType = {
	title: "quiz title",
	creatorId: "no id",
	questions: [
		{
			title: "question title",
			type: "IMAGE",
			fileLocation: null,
			answers: [
				{
					title: "Quiz anwser 1",
					isTrue: true,
					type: "TEXT",
					fileLocation: null,
				},
				{
					title: "Quiz anwser 2",
					isTrue: false,
					type: "TEXT",
					fileLocation: null,
				},
				{
					title: "Quiz anwser 3",
					isTrue: false,
					type: "TEXT",
					fileLocation: null,
				},
				{
					title: "Quiz anwser 4",
					isTrue: false,
					type: "TEXT",
					fileLocation: null,
				},
			],
		},
		{
			title: "question title",
			type: "TEXT",
			fileLocation: null,

			answers: [
				{
					title: "Quiz anwser 1",
					isTrue: true,
					type: "TEXT",
					fileLocation: null,
				},
				{
					title: "Quiz anwser 2",
					isTrue: false,
					type: "TEXT",
					fileLocation: null,
				},
				{
					title: "Quiz anwser 3",
					isTrue: false,
					type: "TEXT",
					fileLocation: null,
				},
				{
					title: "Quiz anwser 4",
					isTrue: false,
					type: "TEXT",
					fileLocation: null,
				},
			],
		},
	],
}
