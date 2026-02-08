import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
	const navigate = useNavigate();

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-4xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">📜 TERMS</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">Terms of Service</h1>
							<p className="text-base sm:text-lg text-gray-600">Last updated: January 2024</p>
						</div>

						<div className="space-y-6 sm:space-y-8 text-gray-700">
							<section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
								<p className="leading-relaxed text-base sm:text-lg">
									By accessing and using the Study Planner application, you accept and agree to be bound by and comply with these Terms of Service. If you do not agree to abide by the above, please do not use this service.
								</p>
							</section>

							<section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">2. Use License</h2>
								<p className="leading-relaxed text-base sm:text-lg mb-4">
									Permission is granted to temporarily download one copy of the materials (information or software) on Study Planner for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
								</p>
								<ul className="list-disc list-inside space-y-2 text-base sm:text-lg">
									<li>Modify or copy the materials</li>
									<li>Use the materials for any commercial purpose or for any public display</li>
									<li>Attempt to decompile or reverse engineer any software contained on Study Planner</li>
									<li>Remove any copyright or other proprietary notations from the materials</li>
									<li>Transfer the materials to another person or mirror the materials on any other server</li>
								</ul>
							</section>

							<section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
								<p className="leading-relaxed text-base sm:text-lg">
									The materials on Study Planner are provided on an 'as is' basis. Study Planner makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
								</p>
							</section>

							<section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">4. Limitations</h2>
								<p className="leading-relaxed text-base sm:text-lg">
									In no event shall Study Planner or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Study Planner.
								</p>
							</section>

							<section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
								<p className="leading-relaxed text-base sm:text-lg">
									The materials appearing on Study Planner could include technical, typographical, or photographic errors. Study Planner does not warrant that any of the materials on the website are accurate, complete, or current.
								</p>
							</section>

							<section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">6. Links</h2>
								<p className="leading-relaxed text-base sm:text-lg">
									Study Planner has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Study Planner of the site. Use of any such linked website is at the user's own risk.
								</p>
							</section>

							<section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">7. Modifications</h2>
								<p className="leading-relaxed text-base sm:text-lg">
									Study Planner may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
								</p>
							</section>

							<section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
								<p className="leading-relaxed text-base sm:text-lg">
									These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Study Planner operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
								</p>
							</section>
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
							Questions About Our Terms?
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							We're happy to clarify anything. Contact us if you have questions.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="/contact"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Contact Us
							</a>
							<a
								href="/privacy"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base hover:bg-white/30 transition-all"
							>
								Privacy Policy
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
