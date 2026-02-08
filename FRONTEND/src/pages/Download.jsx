import { useNavigate } from "react-router-dom";

export default function Download() {
	const navigate = useNavigate();

	const downloads = [
		{
			icon: "🪟",
			name: "Windows",
			description: "Study Planner for Windows 10 and later",
			version: "v1.0.2",
			size: "85 MB",
		},
		{
			icon: "🍎",
			name: "macOS",
			description: "Study Planner for macOS 10.12 and later",
			version: "v1.0.2",
			size: "92 MB",
		},
		{
			icon: "🐧",
			name: "Linux",
			description: "Study Planner for Ubuntu, Debian, and other distributions",
			version: "v1.0.2",
			size: "78 MB",
		},
		{
			icon: "🤖",
			name: "Android",
			description: "Study Planner for Android 8.0 and later",
			version: "v1.0.2",
			size: "42 MB",
		},
		{
			icon: "📱",
			name: "iOS",
			description: "Study Planner for iPhone and iPad",
			version: "v1.0.2",
			size: "48 MB",
		},
		{
			icon: "🌐",
			name: "Web",
			description: "Access Study Planner directly in your browser",
			version: "v1.0.2",
			size: "No installation required",
		},
	];

	const platforms = [
		{ name: "Windows", reqs: "Windows 10 or later, 2GB RAM, Internet connection" },
		{ name: "macOS", reqs: "macOS 10.12 or later, 2GB RAM, Internet connection" },
		{ name: "Linux", reqs: "Ubuntu 18.04+, Debian 9+, 2GB RAM, Internet connection" },
		{ name: "Mobile", reqs: "Android 8.0+, iOS 12.0+, Internet connection" },
	];

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-5xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4 text-center">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">⬇️ DOWNLOAD</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">
								Download Study Planner
							</h1>
							<p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
								Get Study Planner on your preferred device and start learning smarter today.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
							{downloads.map((download) => (
								<div
									key={download.name}
									className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all flex flex-col"
								>
									<div className="text-5xl sm:text-6xl mb-4">{download.icon}</div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
										{download.name}
									</h3>
									<p className="text-sm sm:text-base text-gray-600 mb-4 flex-grow">
										{download.description}
									</p>
									<div className="mt-auto pt-4 border-t border-gray-100">
										<p className="text-xs text-gray-500 mb-4">
											Version {download.version} • {download.size}
										</p>
										<button className="w-full bg-amber-700 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-amber-800 font-semibold transition-colors text-sm sm:text-base">
											Download
										</button>
									</div>
								</div>
							))}
						</div>

						<div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 sm:p-8 md:p-12 mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">System Requirements</h2>
							<div className="grid md:grid-cols-2 gap-6">
								{platforms.map((platform) => (
									<div key={platform.name}>
										<h3 className="font-bold text-gray-900 mb-2">{platform.name}</h3>
										<p className="text-sm sm:text-base text-gray-700">{platform.reqs}</p>
									</div>
								))}
							</div>
						</div>

						<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 sm:p-8">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why Download?</h2>
							<ul className="space-y-3 text-gray-700">
								<li className="flex gap-3">
									<span className="text-green-600 font-bold">✓</span>
									<span>Faster performance with offline mode support</span>
								</li>
								<li className="flex gap-3">
									<span className="text-green-600 font-bold">✓</span>
									<span>Native app experience optimized for your device</span>
								</li>
								<li className="flex gap-3">
									<span className="text-green-600 font-bold">✓</span>
									<span>Desktop notifications and reminders</span>
								</li>
								<li className="flex gap-3">
									<span className="text-green-600 font-bold">✓</span>
									<span>Seamless synchronization across devices</span>
								</li>
							</ul>
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
							Get Started Today
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Download Study Planner now and join thousands of students transforming their learning journey.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<button
								onClick={() => navigate("/subscription")}
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Get Started
							</button>
							<a
								href="/features"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base hover:bg-white/30 transition-all"
							>
								View Features
							</a>
						</div>
						<p className="text-white/80 text-xs sm:text-sm">14-day free trial • No credit card required</p>
					</div>
				</div>
			</section>
		</main>
	);
}
