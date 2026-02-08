export default function ChartBar({ height, label, color = "bg-amber-700" }) {
	return (
		<div className="flex flex-col items-center group">
			<div className="w-12 h-32 bg-gray-100 rounded-lg flex items-end overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
				<div
					className={`w-12 rounded-lg ${color} transition-all duration-500 group-hover:brightness-110`}
					style={{ height: `${height}%` }}
				></div>
			</div>
			<span className="mt-3 text-sm font-medium text-gray-600 group-hover:text-amber-700 transition-colors">
				{label}
			</span>
		</div>
	);
}
