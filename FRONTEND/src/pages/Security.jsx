import { useNavigate } from "react-router-dom";

export default function Security() {
	const navigate = useNavigate();

	const securityFeatures = [
		{
			icon: "🔐",
			title: "End-to-End Encryption",
			desc: "All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols.",
		},
		{
			icon: "🛡️",
			title: "Data Protection",
			desc: "Your personal information is protected with advanced security measures and regular security audits.",
		},
		{
			icon: "🔒",
			title: "Password Security",
			desc: "Passwords are hashed and salted using bcrypt. We never store plain-text passwords.",
		},
		{
			icon: "👁️",
			title: "Privacy First",
			desc: "We comply with GDPR, CCPA, and other data protection regulations. Your data is never sold.",
		},
		{
			icon: "📋",
			title: "Regular Audits",
			desc: "Third-party security audits are conducted quarterly to identify and fix vulnerabilities.",
		},
		{
			icon: "⚠️",
			title: "Vulnerability Reports",
			desc: "We have a responsible disclosure program. Report security issues to teamispekka@gmail.com",
		},
	];

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-4xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">🔐 SECURITY</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">Our Security</h1>
							<p className="text-base sm:text-xl text-gray-600">
								Your security and privacy are our top priorities. Learn about how we protect your data.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16">
							{securityFeatures.map((feature) => (
								<div
									key={feature.title}
									className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all"
								>
									<div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
									<p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
								</div>
							))}
						</div>

						<div className="space-y-6 sm:space-y-8">
							<section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl border border-amber-200 p-6 sm:p-8 md:p-12">
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">🏆 Certifications & Standards</h2>
								<ul className="space-y-3 text-gray-700">
									<li className="flex items-center gap-3 text-base sm:text-lg">
										<span className="text-amber-700 font-bold text-xl">✓</span>
										<span>ISO 27001 Certified</span>
									</li>
									<li className="flex items-center gap-3 text-base sm:text-lg">
										<span className="text-amber-700 font-bold text-xl">✓</span>
										<span>SOC 2 Type II Compliant</span>
									</li>
									<li className="flex items-center gap-3 text-base sm:text-lg">
										<span className="text-amber-700 font-bold text-xl">✓</span>
										<span>GDPR Compliant</span>
									</li>
									<li className="flex items-center gap-3 text-base sm:text-lg">
										<span className="text-amber-700 font-bold text-xl">✓</span>
										<span>CCPA Compliant</span>
									</li>
									<li className="flex items-center gap-3 text-base sm:text-lg">
										<span className="text-amber-700 font-bold text-xl">✓</span>
										<span>Regular Penetration Testing</span>
									</li>
								</ul>
							</section>

							<section className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:p-12 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Infrastructure Security</h2>
								<p className="text-gray-600 text-base sm:text-lg leading-relaxed">
									Our infrastructure is hosted on secure cloud servers with automatic backups, redundancy, and disaster recovery protocols in place. We use firewalls, intrusion detection systems, and DDoS protection to keep our platform safe.
								</p>
							</section>

							<section className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:p-12 hover:shadow-lg hover:border-amber-200 transition-all">
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Incident Response</h2>
								<p className="text-gray-600 text-base sm:text-lg leading-relaxed">
									In the unlikely event of a security incident, our team is ready to respond within 24 hours. We maintain detailed incident logs and will notify affected users transparently.
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
							Study with Confidence
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Your data is secure with us. We maintain the highest standards of security and privacy.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="/subscription"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Get Started
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
