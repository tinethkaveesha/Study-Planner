export default function FeatureCard({ feature, index }) {
	return (
		<div
			className="group rounded-lg sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-8 hover:shadow-2xl hover:border-amber-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2 animate-scale-in"
			style={{ animationDelay: `${index * 100}ms` }}
		>
			<div
				className={`mb-4 sm:mb-6 h-12 sm:h-16 w-12 sm:w-16 rounded-lg sm:rounded-xl ${feature.bgColor} flex items-center justify-center text-2xl sm:text-4xl ${feature.hoverBg} group-hover:text-white transition-all duration-300 group-hover:shadow-lg flex-shrink-0`}
			>
				{feature.icon}
			</div>
			<h3 className="mb-2 sm:mb-3 text-base sm:text-xl font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
				{feature.title}
			</h3>
			<p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">{feature.desc}</p>
			<div className="flex items-center gap-2 text-amber-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-sm sm:text-base">
				<span>Learn more</span>
				<span>→</span>
			</div>
		</div>
	);
}
