import { useNavigate } from "react-router-dom";

export default function Features() {
	const navigate = useNavigate();

	const features = [
		{
			icon: "📅",
			title: "Smart Scheduler",
			description: "Intelligently organize your study sessions with our AI-powered scheduling system that adapts to your pace and learning style.",
		},
		{
			icon: "📊",
			title: "Advanced Analytics",
			description: "Track your progress with detailed insights and analytics to identify strengths and areas for improvement.",
		},
		{
			icon: "📚",
			title: "Resource Library",
			description: "Access curated learning materials, notes, and study guides all in one place, organized by subject.",
		},
		{
			icon: "👥",
			title: "Study Groups",
			description: "Collaborate with peers, share resources, and complete group projects seamlessly with integrated communication.",
		},
		{
			icon: "🧠",
			title: "Interactive Quizzes",
			description: "Test your knowledge with AI-generated quizzes and get instant feedback for better learning outcomes.",
		},
		{
			icon: "📱",
			title: "Cross-Platform",
			description: "Study anywhere, anytime with our responsive design on desktop, tablet, and mobile devices.",
		},
	];

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-5xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4 text-center">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">✨ FEATURES</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">
								Powerful Features
							</h1>
							<p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
								Study Planner comes equipped with everything you need for effective and productive learning.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
							{features.map((feature, idx) => (
								<div
									key={idx}
									className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all"
								>
									<div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
										{feature.title}
									</h3>
									<p className="text-sm sm:text-base text-gray-600">
										{feature.description}
									</p>
								</div>
							))}
						</div>

						<div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 sm:p-8 md:p-12 mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Why Choose Study Planner?</h2>
							<div className="grid md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<h3 className="font-bold text-gray-900">Built by Educators</h3>
									<p className="text-gray-700">Created in collaboration with teachers and educational experts to ensure maximum effectiveness.</p>
								</div>
								<div className="space-y-4">
									<h3 className="font-bold text-gray-900">AI-Powered Learning</h3>
									<p className="text-gray-700">Machine learning algorithms adapt to your learning pace and style for personalized experience.</p>
								</div>
								<div className="space-y-4">
									<h3 className="font-bold text-gray-900">Privacy First</h3>
									<p className="text-gray-700">Your data is encrypted and secure. We never sell your information to third parties.</p>
								</div>
								<div className="space-y-4">
									<h3 className="font-bold text-gray-900">24/7 Support</h3>
									<p className="text-gray-700">Our dedicated support team is available around the clock to help you succeed.</p>
								</div>
							</div>
						</div>

						<div className="text-center">
							<button
								onClick={() => navigate("/subscription")}
								className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
							>
								Start Your Journey
							</button>
						</div>
					</div>
				</div>
			</section>

			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-amber-700 via-orange-600 to-red-600 relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<svg className="w-full h-full">
						<defs>
							<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
								<path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
					</svg>
				</div>
				<div className="container mx-auto px-3 sm:px-4 relative z-10">
					<div className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-3xl mx-auto">
						<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
							Ready to Experience Smarter Learning?
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Join thousands of students who are transforming their education with Study Planner.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<button
								onClick={() => navigate("/subscription")}
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Get Started
							</button>
							<a
								href="/contact"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base hover:bg-white/30 transition-all"
							>
								Learn More
							</a>
						</div>
						<p className="text-white/80 text-xs sm:text-sm">14-day free trial • No credit card required</p>
					</div>
				</div>
			</section>
		</main>
	);
}
