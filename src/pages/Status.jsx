import { useNavigate } from "react-router-dom";

export default function Status() {
	const navigate = useNavigate();

	const systemStatus = [
		{
			service: "API Servers",
			status: "operational",
			uptime: "99.99%",
			response: "45ms",
		},
		{
			service: "Website",
			status: "operational",
			uptime: "99.98%",
			response: "120ms",
		},
		{
			service: "Database",
			status: "operational",
			uptime: "99.99%",
			response: "15ms",
		},
		{
			service: "Analytics",
			status: "operational",
			uptime: "99.95%",
			response: "200ms",
		},
		{
			service: "Email Service",
			status: "operational",
			uptime: "99.97%",
			response: "250ms",
		},
		{
			service: "CDN",
			status: "operational",
			uptime: "99.99%",
			response: "50ms",
		},
	];

	const incidents = [
		{
			date: "December 15, 2023",
			title: "Scheduled Maintenance",
			description: "Completed database optimization. No data was lost.",
			status: "resolved",
		},
		{
			date: "December 1, 2023",
			title: "Brief API Downtime",
			description: "37-minute outage due to server migration. Issue resolved.",
			status: "resolved",
		},
		{
			date: "November 20, 2023",
			title: "Website Performance Improvement",
			description: "CDN upgrade completed for faster content delivery.",
			status: "resolved",
		},
	];

	const getStatusColor = (status) => {
		return status === "operational"
			? "bg-green-100 text-green-700"
			: "bg-yellow-100 text-yellow-700";
	};

	const getStatusDot = (status) => {
		return status === "operational" ? "bg-green-500" : "bg-yellow-500";
	};

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-4xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">⚡ STATUS</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">System Status</h1>
							<p className="text-base sm:text-xl text-gray-600">
								Monitor the health and uptime of Study Planner services.
							</p>
						</div>

						<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border border-green-300 p-6 sm:p-8 md:p-12 mb-12">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-4 w-4 rounded-full bg-green-500 animate-pulse"></div>
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
									All Systems Operational
								</h2>
							</div>
							<p className="text-gray-600 text-base sm:text-lg">Last updated: {new Date().toLocaleString()}</p>
						</div>

						<section className="mb-16">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">Service Status</h2>
							<div className="space-y-4">
								{systemStatus.map((service) => (
									<div
										key={service.service}
										className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all"
									>
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
											<div className="flex items-center gap-4">
												<div
													className={`h-3 w-3 rounded-full ${getStatusDot(
														service.status
													)}`}
												></div>
												<div>
													<h3 className="font-bold text-gray-900 text-lg">
														{service.service}
													</h3>
													<p className="text-sm text-gray-600">
														Response time: {service.response}
													</p>
												</div>
											</div>
											<div className="text-left sm:text-right">
												<span
													className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(
														service.status
													)}`}
												>
													{service.status.charAt(0).toUpperCase() +
														service.status.slice(1)}
												</span>
												<p className="text-sm text-gray-600 mt-2">
													Uptime: {service.uptime}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>

						<section>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">Recent Incidents</h2>
							<div className="space-y-4">
								{incidents.map((incident, idx) => (
									<div
										key={idx}
										className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all"
									>
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
											<div>
												<p className="text-xs sm:text-sm font-semibold text-gray-500">
													{incident.date}
												</p>
												<h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
													{incident.title}
												</h3>
											</div>
											<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0">
												Resolved
											</span>
										</div>
										<p className="text-gray-600 text-base">
											{incident.description}
										</p>
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
							Experience Reliable Learning
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Study Planner maintains 99.9% uptime to ensure you never miss your study sessions.
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
								Contact Support
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
