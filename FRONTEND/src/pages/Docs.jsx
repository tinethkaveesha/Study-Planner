import { useState } from "react";

export default function Docs() {
	const [selectedCategory, setSelectedCategory] = useState("getting-started");

	const categories = [
		{
			id: "getting-started",
			name: "Getting Started",
			docs: [
				{ title: "Introduction", link: "#introduction" },
				{ title: "Installation", link: "#installation" },
				{ title: "First Steps", link: "#first-steps" },
			],
		},
		{
			id: "features",
			name: "Features",
			docs: [
				{ title: "Smart Scheduler", link: "#scheduler" },
				{ title: "Resource Curator", link: "#resources" },
				{ title: "Progress Tracker", link: "#tracker" },
				{ title: "Quiz Generator", link: "#quizzes" },
			],
		},
		{
			id: "api",
			name: "API Reference",
			docs: [
				{ title: "Authentication", link: "#auth" },
				{ title: "Endpoints", link: "#endpoints" },
				{ title: "Error Handling", link: "#errors" },
				{ title: "Rate Limits", link: "#limits" },
			],
		},
		{
			id: "guides",
			name: "Guides",
			docs: [
				{ title: "Creating a Study Plan", link: "#plan" },
				{ title: "Managing Courses", link: "#courses" },
				{ title: "Using Analytics", link: "#analytics" },
				{ title: "Collaboration", link: "#collab" },
			],
		},
	];

	const currentCategory = categories.find((cat) => cat.id === selectedCategory);

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-6xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">DOCS</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">
								Documentation
							</h1>
							<p className="text-base sm:text-xl text-gray-600">
								Everything you need to know about Study Planner.
							</p>
						</div>

						<div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
							<div className="lg:col-span-1">
								<h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-6">
									Categories
								</h2>
								<div className="space-y-2">
									{categories.map((category) => (
										<button
											key={category.id}
											onClick={() => setSelectedCategory(category.id)}
											className={`w-full text-left px-4 py-3 sm:py-4 rounded-lg font-semibold transition-all text-sm sm:text-base ${
												selectedCategory === category.id
													? "bg-gradient-to-r from-amber-700 to-orange-600 text-white shadow-lg"
													: "text-gray-700 hover:bg-amber-50 border border-transparent"
											}`}
										>
											{category.name}
										</button>
									))}
								</div>
							</div>

							<div className="lg:col-span-3">
								<div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all">
									<h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">
										{currentCategory.name}
									</h3>

									<div className="space-y-8">
										{currentCategory.docs.map((doc, idx) => (
											<div
												key={doc.title}
												className={`pb-8 ${
													idx !== currentCategory.docs.length - 1
														? "border-b border-gray-200"
														: ""
												}`}
											>
												<h4 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">
													{doc.title}
												</h4>
												<p className="text-gray-600 text-base mb-4 leading-relaxed">
													Comprehensive documentation for{" "}
													{doc.title.toLowerCase()}. This section
													covers all important details and best
													practices to help you get the most out of
													Study Planner.
												</p>
												<a
													href={doc.link}
													className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-800 transition-colors"
												>
													Read More →
												</a>
											</div>
										))}
									</div>

									<div className="mt-12 pt-8 border-t-2 border-gray-200">
										<h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
											Code Example
										</h4>
										<div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
											<pre className="font-mono">{`// Initialize Study Planner
import { StudyPlanner } from '@study-planner';

const planner = new StudyPlanner({
  apiKey: 'your-api-key',
  userId: 'your-user-id'
});

// Create a study session
const session = await planner.createSession({
  subject: 'Mathematics',
  duration: 60,
  difficulty: 'intermediate'
});`}</pre>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-amber-700 via-orange-600 to-red-600 relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<svg className="w-full h-full">
						<defs>
							<pattern
								id="grid"
								width="40"
								height="40"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 40 0 L 0 0 0 40"
									fill="none"
									stroke="white"
									strokeWidth="1"
								/>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
					</svg>
				</div>
				<div className="container mx-auto px-3 sm:px-4 relative z-10">
					<div className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-3xl mx-auto">
						<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
							Still Have Questions?
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Our support team is ready to help you with any questions about Study Planner.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="/support"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Contact Support
							</a>
							<a
								href="/api"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base hover:bg-white/30 transition-all"
							>
								View API Docs
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
