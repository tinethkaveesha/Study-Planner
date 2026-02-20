import { useState } from "react";
import { FaComments, FaEnvelope, FaMobileAlt, FaRocket, FaHandshake } from 'react-icons/fa';

export default function Support() {
	const [expandedFaq, setExpandedFaq] = useState(null);

	const faqs = [
		{
			question: "How do I get started?",
			answer: "Sign up for an account, verify your email, and start creating your study schedule. Our onboarding guide will walk you through all the features.",
		},
		{
			question: "Is there a free trial?",
			answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to get started.",
		},
		{
			question: "Can I cancel anytime?",
			answer: "Absolutely. Your subscription can be cancelled at any time from your account settings. No questions asked.",
		},
		{
			question: "How is my data protected?",
			answer: "We use industry-standard encryption and follow GDPR/CCPA compliance. See our Security page for detailed information.",
		},
		{
			question: "Can I download my data?",
			answer: "Yes, you can export all your study data in CSV or JSON format from your account settings.",
		},
		{
			question: "How do I update my profile?",
			answer: "Go to Settings > Profile to update your information. Changes take effect immediately.",
		},
	];

	const supportChannels = [
		{
			icon: <FaComments className="text-4xl sm:text-5xl" />,
			title: "Chat Support",
			desc: "Available 24/7 for quick questions",
			contact: "Chat with us",
		},
		{
			icon: <FaEnvelope className="text-4xl sm:text-5xl" />,
			title: "Email Support",
			desc: "Detailed responses within 24 hours",
			contact: "teamispekka@gmail.com",
		},
		{
			icon: <FaMobileAlt className="text-4xl sm:text-5xl" />,
			title: "Phone Support",
			desc: "Weekdays 9AM - 6PM EST",
			contact: "+94 (767) 524-003",
		},
		{
			icon: <FaRocket className="text-4xl sm:text-5xl" />,
			title: "Knowledge Base",
			desc: "Articles and guides for self-service",
			contact: "Browse Articles",
		},
	];

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-4xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold"><FaHandshake className="inline mr-2" /> SUPPORT</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">
								Support & Help
							</h1>
							<p className="text-base sm:text-xl text-gray-600">
								We're here to help. Find answers and get support whenever you need it.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16">
							{supportChannels.map((channel) => (
								<div
									key={channel.title}
									className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all"
								>
										<div className="text-amber-700 mb-4">{channel.icon}</div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{channel.title}</h3>
									<p className="text-sm sm:text-base text-gray-600 mb-4">{channel.desc}</p>
									<a
										href="#"
										className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-800 transition-colors text-sm sm:text-base"
									>
										{channel.contact} →
									</a>
								</div>
							))}
						</div>

						<section>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">
								Frequently Asked Questions
							</h2>
							<div className="space-y-4">
								{faqs.map((faq, idx) => (
									<div
										key={idx}
										className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-amber-200 transition-all"
									>
										<button
											onClick={() =>
												setExpandedFaq(expandedFaq === idx ? null : idx)
											}
											className="w-full p-6 sm:p-8 flex justify-between items-start sm:items-center hover:bg-amber-50 transition-colors text-left"
										>
											<p className="font-semibold text-gray-900 text-base sm:text-lg">
												{faq.question}
											</p>
											<span
												className={`text-2xl transition-transform flex-shrink-0 ml-4 ${
													expandedFaq === idx ? "rotate-180" : ""
												}`}
											>
												▼
											</span>
										</button>
										{expandedFaq === idx && (
											<div className="px-6 pb-6 sm:px-8 sm:pb-8 text-gray-600 border-t border-gray-200 text-base">
												{faq.answer}
											</div>
										)}
									</div>
								))}
							</div>
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
							Ready to Get Started?
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Join thousands of students who are already transforming their learning journey with Study Planner.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="/subscription"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Get Started
							</a>
							<a
								href="/contact"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base hover:bg-white/30 transition-all"
							>
								Contact Us
							</a>
						</div>
						<p className="text-white/80 text-xs sm:text-sm">14-day free trial • No credit card required</p>
					</div>
				</div>
			</section>
		</main>
	);
}
