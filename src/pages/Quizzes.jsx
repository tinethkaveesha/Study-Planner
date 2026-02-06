import { useState } from "react";

export default function Quizzes() {
	const [generatingQuiz, setGeneratingQuiz] = useState(false);
	const [generatedQuiz, setGeneratedQuiz] = useState(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState({});
	const [showResults, setShowResults] = useState(false);
	const [formData, setFormData] = useState({
		subject: "Mathematics",
		topic: "",
		questions: 10,
	});

	const quizzes = [
		{
			id: 1,
			title: "Basic Algebra",
			subject: "Mathematics",
			questions: 20,
			difficulty: "Easy",
			duration: "15 min",
			bestScore: 95,
			url: "https://kahoot.it/solo?quizId=44bb0240-283a-483b-8863-2abcdc1be8b8",
		},
		{
			id: 2,
			title: "Newton's Laws",
			subject: "Physics",
			questions: 15,
			difficulty: "Medium",
			duration: "20 min",
			bestScore: 88,
			url: "https://kahoot.it/solo?quizId=b444d4e0-1147-4d64-8e13-ae1aa009d716",
		},
		{
			id: 3,
			title: "Organic Reactions",
			subject: "Chemistry",
			questions: 20,
			difficulty: "Hard",
			duration: "30 min",
			bestScore: 82,
			url: "https://kahoot.it/solo?quizId=b588f275-6c2e-4470-9ebb-cc6980d6becc",
		},
		{
			id: 4,
			title: "Shakespeare Quiz",
			subject: "English",
			questions: 20,
			difficulty: "Medium",
			duration: "18 min",
			bestScore: 92,
			url: "https://kahoot.it/solo?quizId=21d58ee3-f281-4455-9d43-4fe13c6e613a",
		},
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleGenerateQuiz = async (e) => {
		e.preventDefault();
		
		if (!formData.topic.trim()) {
			alert("Please enter a topic for the quiz!");
			return;
		}
		
		setGeneratingQuiz(true);

		try {
			const response = await fetch(
				"https://openrouter.ai/api/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"HTTP-Referer": window.location.href,
						"X-Title": "Quiz Generator"
					},
					body: JSON.stringify({
						model: "tngtech/deepseek-r1t2-chimera:free",
						messages: [
							{
								role: "user",
								content: `Generate a quiz with ${formData.questions} multiple choice questions about ${formData.topic} in ${formData.subject}. 

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer (just the letter)
4. A brief explanation

Format your response as a JSON array with NO markdown formatting, NO backticks, NO preamble. Just the raw JSON array of objects with this structure:
[
  {
    "question": "question text",
    "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"],
    "correct": "A",
    "explanation": "explanation text"
  }
]

Return ONLY the JSON array, nothing else.`
							}
						]
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error?.message || "API request failed");
			}

			const data = await response.json();
			console.log("OpenRouter API Response:", data);
			
			// Extract text from OpenRouter response
			let quizContent = data.choices[0]?.message?.content || "";
			
			console.log("Quiz Content:", quizContent);
			
			// Clean up the response - remove markdown code blocks if present
			quizContent = quizContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
			
			const quizData = JSON.parse(quizContent);
			
			if (!Array.isArray(quizData) || quizData.length === 0) {
				throw new Error("Invalid quiz format received");
			}

			displayQuiz(quizData);
		} catch (error) {
			console.error("Error generating quiz:", error);
			alert(`Failed to generate quiz: ${error.message}\n\nPlease try again or check the console for details.`);
		} finally {
			setGeneratingQuiz(false);
		}
	};

	const displayQuiz = (quizData) => {
		setGeneratedQuiz({
			title: `${formData.topic} - ${formData.subject}`,
			questions: quizData,
		});
		setCurrentQuestion(0);
		setSelectedAnswers({});
		setShowResults(false);
	};

	const handleAnswerSelect = (questionIndex, answer) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionIndex]: answer,
		}));
	};

	const handleNextQuestion = () => {
		if (currentQuestion < generatedQuiz.questions.length - 1) {
			setCurrentQuestion((prev) => prev + 1);
		}
	};

	const handlePreviousQuestion = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion((prev) => prev - 1);
		}
	};

	const handleSubmitQuiz = () => {
		setShowResults(true);
	};

	const calculateScore = () => {
		let correct = 0;
		generatedQuiz.questions.forEach((q, index) => {
			if (selectedAnswers[index] === q.correct) {
				correct++;
			}
		});
		return (correct / generatedQuiz.questions.length) * 100;
	};

	const closeQuiz = () => {
		setGeneratedQuiz(null);
		setCurrentQuestion(0);
		setSelectedAnswers({});
		setShowResults(false);
	};

	return (
		<main className="flex-1">
			<section className="py-16 md:py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="mx-auto mb-16 max-w-3xl">
						<h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3">
							<span>🎓</span>Quiz Generator
						</h1>
						<p className="text-lg text-gray-600">
							Test your knowledge with adaptive quizzes tailored to your learning level.
						</p>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg mb-12">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Create Custom Quiz</h2>
						<form className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={handleGenerateQuiz}>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Subject
								</label>
								<select
									name="subject"
									value={formData.subject}
									onChange={handleInputChange}
									className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
								>
									<option>Mathematics</option>
									<option>Physics</option>
									<option>Chemistry</option>
									<option>English</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Topic
								</label>
								<input
									type="text"
									name="topic"
									value={formData.topic}
									onChange={handleInputChange}
									placeholder="e.g., Algebra"
									required
									className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Questions
								</label>
								<input
									type="number"
									name="questions"
									value={formData.questions}
									onChange={handleInputChange}
									placeholder="10"
									min="5"
									max="20"
									required
									className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
								/>
							</div>
							<div className="flex items-end">
								<button
									type="submit"
									disabled={generatingQuiz}
									className="w-full py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
								>
									{generatingQuiz ? "Generating..." : "Generate Quiz"}
								</button>
							</div>
						</form>
					</div>

					<h2 className="text-2xl font-bold text-gray-900 mb-6">Available Quizzes</h2>
					<div className="grid gap-6 md:grid-cols-2">
						{quizzes.map((quiz) => (
							<div
								key={quiz.id}
								className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all"
							>
								<div className="mb-4">
									<div className="flex items-start justify-between mb-2">
										<h3 className="text-xl font-semibold text-gray-900">
											{quiz.title}
										</h3>
										<span
											className={`px-3 py-1 rounded-full text-xs font-semibold ${
												quiz.difficulty === "Easy"
													? "bg-green-100 text-green-700"
													: quiz.difficulty === "Medium"
													? "bg-yellow-100 text-yellow-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{quiz.difficulty}
										</span>
									</div>
									<p className="text-amber-700 text-sm">{quiz.subject}</p>
								</div>

								<div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
									<p className="text-gray-600 text-sm">
										🎯 {quiz.questions} questions
									</p>
									<p className="text-gray-600 text-sm">⏱️ {quiz.duration}</p>
									<p className="text-gray-600 text-sm">
										🏆 Best Score: {quiz.bestScore}%
									</p>
								</div>

								{quiz.url ? (
									<a
										href={quiz.url}
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all text-center"
									>
										Start Quiz
									</a>
								) : (
									<button className="w-full py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all">
										Start Quiz
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Generated Quiz Modal */}
			{generatedQuiz && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
						<div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
							<div className="flex justify-between items-start mb-2">
								<h2 className="text-2xl font-bold text-gray-900">
									{generatedQuiz.title}
								</h2>
								<button
									onClick={closeQuiz}
									className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
								>
									×
								</button>
							</div>
							<div className="flex items-center gap-4 text-sm text-gray-600">
								<span>
									Question {currentQuestion + 1} of {generatedQuiz.questions.length}
								</span>
								<div className="flex-1 bg-gray-200 rounded-full h-2">
									<div
										className="bg-amber-700 h-2 rounded-full transition-all"
										style={{
											width: `${
												((currentQuestion + 1) / generatedQuiz.questions.length) * 100
											}%`,
										}}
									/>
								</div>
							</div>
						</div>

						<div className="p-6">
							{!showResults ? (
								<>
									<div className="mb-6">
										<h3 className="text-xl font-semibold text-gray-900 mb-4">
											{generatedQuiz.questions[currentQuestion].question}
										</h3>
										<div className="space-y-3">
											{generatedQuiz.questions[currentQuestion].options.map(
												(option, idx) => {
													const optionLetter = option.charAt(0);
													return (
														<button
															key={idx}
															onClick={() =>
																handleAnswerSelect(currentQuestion, optionLetter)
															}
															className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
																selectedAnswers[currentQuestion] === optionLetter
																	? "border-amber-700 bg-amber-50"
																	: "border-gray-200 hover:border-amber-300 bg-white"
															}`}
														>
															{option}
														</button>
													);
												}
											)}
										</div>
									</div>

									<div className="flex justify-between items-center pt-4 border-t border-gray-200">
										<button
											onClick={handlePreviousQuestion}
											disabled={currentQuestion === 0}
											className="px-6 py-2 text-amber-700 font-semibold rounded-lg hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Previous
										</button>
										<div className="text-sm text-gray-600">
											{Object.keys(selectedAnswers).length} /{" "}
											{generatedQuiz.questions.length} answered
										</div>
										{currentQuestion === generatedQuiz.questions.length - 1 ? (
											<button
												onClick={handleSubmitQuiz}
												disabled={
													Object.keys(selectedAnswers).length !==
													generatedQuiz.questions.length
												}
												className="px-6 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
											>
												Submit Quiz
											</button>
										) : (
											<button
												onClick={handleNextQuestion}
												className="px-6 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
											>
												Next
											</button>
										)}
									</div>
								</>
							) : (
								<div className="text-center py-8">
									<div className="mb-6">
										<div className="text-6xl font-bold text-amber-700 mb-2">
											{calculateScore().toFixed(0)}%
										</div>
										<p className="text-xl text-gray-600">
											You got {Object.values(selectedAnswers).filter((answer, idx) => answer === generatedQuiz.questions[idx].correct).length} out of{" "}
											{generatedQuiz.questions.length} correct!
										</p>
									</div>

									<div className="space-y-4 text-left mb-6">
										{generatedQuiz.questions.map((q, idx) => (
											<div
												key={idx}
												className={`p-4 rounded-lg border-2 ${
													selectedAnswers[idx] === q.correct
														? "border-green-500 bg-green-50"
														: "border-red-500 bg-red-50"
												}`}
											>
												<div className="flex items-start gap-2 mb-2">
													<span className="text-lg">
														{selectedAnswers[idx] === q.correct ? "✓" : "✗"}
													</span>
													<div className="flex-1">
														<p className="font-semibold text-gray-900 mb-1">
															{q.question}
														</p>
														<p className="text-sm text-gray-600">
															Your answer: {selectedAnswers[idx]} | Correct: {q.correct}
														</p>
														<p className="text-sm text-gray-700 mt-2">
															{q.explanation}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>

									<button
										onClick={closeQuiz}
										className="px-8 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
									>
										Close Quiz
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</main>
	);
}