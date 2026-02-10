export default function StatCard({ label, value, icon, iconComponent, color }) {
	const IconComponent = iconComponent;
	
	return (
		<div className="rounded-lg sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-amber-200">
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate">{label}</p>
					<p className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
						{value}
					</p>
				</div>
				<div className={`text-xl sm:text-2xl p-2 sm:p-3 rounded-lg flex-shrink-0 ${color} group-hover:scale-110 transition-transform flex items-center justify-center`}>
					{IconComponent ? <IconComponent className="w-5 sm:w-6 h-5 sm:h-6" /> : icon}
				</div>
			</div>
			<div className="mt-3 sm:mt-4 h-1 w-0 bg-gradient-to-r from-amber-700 to-orange-600 rounded-full group-hover:w-full transition-all duration-500"></div>
		</div>
	);
}
