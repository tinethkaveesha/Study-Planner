import { useNavigate } from "react-router-dom";
import { FaCalendar, FaComments, FaBell, FaLaptop, FaEnvelope, FaLink, FaRocket, FaMobileAlt } from 'react-icons/fa';

export default function Integrations() {
	const navigate = useNavigate();

	const integrations = [
		{
			icon: <FaCalendar className="text-4xl sm:text-5xl" />,
			name: "Google Calendar",
			description: "Sync your Study Planner schedule with Google Calendar for seamless time management.",
			status: "Available",
		},
		{
			icon: <FaComments className="text-4xl sm:text-5xl" />,
			name: "Microsoft Teams",
			description: "Collaborate with study groups directly through Microsoft Teams integration.",
			status: "Available",
		},
		{
			icon: <FaBell className="text-4xl sm:text-5xl" />,
			name: "Slack",
			description: "Get reminders and notifications about your study sessions right in Slack.",
			status: "Available",
		},
		{
			icon: <FaLaptop className="text-4xl sm:text-5xl" />,
			name: "GitHub",
			description: "Integrate your coding projects and track progress on programming assignments.",
			status: "Available",
		},
		{
			icon: <FaEnvelope className="text-4xl sm:text-5xl" />,
			name: "Outlook",
			description: "Connect your Outlook calendar to stay synchronized with your study schedule.",
			status: "Available",
		},
		{
			icon: <FaLink className="text-4xl sm:text-5xl" />,
			name: "REST API",
			description: "Build custom integrations with our powerful REST API and webhooks.",
			status: "Available",
		},
		{
			icon: <FaRocket className="text-4xl sm:text-5xl" />,
			name: "Zapier",
			description: "Automate workflows with thousands of apps through Zapier integration.",
			status: "Coming Soon",
		},
		{
			icon: <FaMobileAlt className="text-4xl sm:text-5xl" />,
			name: "WhatsApp",
			description: "Receive study reminders and notifications via WhatsApp.",
			status: "Coming Soon",
		},
	];

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-5xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4 text-center">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">INTEGRATIONS</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">
								Integrations
							</h1>
							<p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
								Connect Study Planner with your favorite tools and services.
							</p>
						</div>

						<div className="mb-12">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Available Integrations</h2>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
								{integrations.map((integration) => (
									<div
										key={integration.name}
										className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all"
									>
										<div className="flex items-start justify-between gap-4 mb-4">
											<div className="text-amber-700">{integration.icon}</div>
											<span
												className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0 ${
													integration.status === "Available"
														? "bg-green-100 text-green-700"
														: "bg-amber-100 text-amber-700"
												}`}
											>
												{integration.status}
											</span>
										</div>
										<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
											{integration.name}
										</h3>
										<p className="text-sm sm:text-base text-gray-600 mb-4">
											{integration.description}
										</p>
										{integration.status === "Available" && (
											<button className="text-amber-700 hover:text-amber-800 font-semibold text-sm">
												Learn More →
											</button>
										)}
									</div>
								))}
							</div>
						</div>

						<div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 sm:p-8 md:p-12">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Custom Integration</h2>
							<p className="text-gray-700 mb-6">
								Need a custom integration? Our powerful REST API allows you to build anything. Access webhooks, real-time data, and more.
							</p>
							<a
								href="/api"
								className="inline-block px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
							>
								View API Documentation →
							</a>
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
							Power Your Workflow
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Seamlessly integrate Study Planner with the tools you already use.
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
								Request Integration
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
