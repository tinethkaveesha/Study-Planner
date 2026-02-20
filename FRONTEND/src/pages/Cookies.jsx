export default function Cookies() {
	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4 max-w-3xl">
					<div className="mb-12 space-y-2 sm:space-y-4">
						<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
						<span className="text-amber-700 font-semibold">COOKIES</span>
						</div>
						<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">Cookie Policy</h1>
						<p className="text-base sm:text-lg text-gray-600">Last updated: January 2024</p>
					</div>
					
					<div className="space-y-8 text-gray-700">
						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
							<p className="leading-relaxed">
								Cookies are small text files stored on your device that help us remember information about your visit to Study Planner. They enable us to enhance your experience and provide better services.
							</p>
						</section>

						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
							<ul className="space-y-4">
								<li className="flex gap-4">
									<span className="font-bold text-amber-700 flex-shrink-0">Essential:</span>
									<span>Required for the site to function properly, including authentication and security.</span>
								</li>
								<li className="flex gap-4">
									<span className="font-bold text-amber-700 flex-shrink-0">Analytics:</span>
									<span>Help us understand how users interact with Study Planner to improve functionality.</span>
								</li>
								<li className="flex gap-4">
									<span className="font-bold text-amber-700 flex-shrink-0">Preferences:</span>
									<span>Remember your settings and choices to personalize your experience.</span>
								</li>
								<li className="flex gap-4">
									<span className="font-bold text-amber-700 flex-shrink-0">Marketing:</span>
									<span>Track your preferences to deliver relevant content and advertisements.</span>
								</li>
							</ul>
						</section>

						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
							<p className="leading-relaxed">
								Most browsers allow you to control cookies through settings. You can clear existing cookies or prevent new ones from being stored. Please note that disabling certain cookies may affect the functionality of Study Planner.
							</p>
						</section>

						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
							<p className="leading-relaxed">
								For questions about our cookie policy, please contact us at teamispekka@gmail.com or visit our <a href="/contact" className="text-amber-700 hover:text-amber-800 underline font-semibold">Contact page</a>.
							</p>
						</section>
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
							Transparent & Compliant
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							We're committed to being transparent about how we use cookies and respecting your preferences.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="/privacy"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Privacy Policy
							</a>
							<a
								href="/contact"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base hover:bg-white/30 transition-all"
							>
								Contact Us
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
