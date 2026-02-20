export default function Privacy() {
	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4 max-w-3xl">
					<div className="mb-12 space-y-2 sm:space-y-4">
						<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
							<span className="text-amber-700 font-semibold">PRIVACY</span>
						</div>
						<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">Privacy Policy</h1>
						<p className="text-base sm:text-lg text-gray-600">Last updated: January 2024</p>
					</div>
					
					<div className="space-y-8 text-gray-700">
						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Data Collection</h2>
							<p className="leading-relaxed">
								Study Planner collects information you provide directly, including account details, study schedules, and preferences. We only collect data necessary to improve your experience and provide our services.
							</p>
						</section>

						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Data</h2>
							<ul className="space-y-3 list-disc list-inside">
								<li>Provide and maintain our services</li>
								<li>Personalize your study experience</li>
								<li>Send notifications and updates</li>
								<li>Analyze usage patterns to improve features</li>
								<li>Communicate with you about changes to our services</li>
							</ul>
						</section>

						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
							<p className="leading-relaxed">
								We implement industry-standard security measures to protect your data. Your information is encrypted in transit and at rest. We regularly review and update our security practices.
							</p>
						</section>

						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing</h2>
							<p className="leading-relaxed">
								We do not sell your personal data. We may share information with trusted partners only when necessary to provide services, and only under strict confidentiality agreements.
							</p>
						</section>

						<section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
							<p className="leading-relaxed">
								You have the right to access, update, or delete your personal data. You may also opt-out of non-essential communications at any time. Contact us for any privacy-related requests at teamispekka@gmail.com.
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
							Your Privacy Matters
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							We're committed to protecting your personal information and giving you control over your data.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="/security"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Security Details
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
