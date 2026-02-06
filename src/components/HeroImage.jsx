export default function HeroSection() {
	return (
		<svg width="400" height="400" viewBox="0 0 400 400" className="w-full h-full">
			{/* Background gradient */}
			<defs>
				<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#d97706" />
					<stop offset="100%" stopColor="#ea580c" />
				</linearGradient>
				<linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#fbbf24" />
					<stop offset="100%" stopColor="#f59e0b" />
				</linearGradient>
			</defs>

			{/* Main circle */}
			<circle cx="200" cy="200" r="180" fill="url(#grad1)" opacity="0.1" />
			<circle cx="200" cy="200" r="150" fill="url(#grad2)" opacity="0.15" />

			{/* Books */}
			<g transform="translate(120, 140)">
				<rect x="0" y="20" width="35" height="100" fill="#d97706" rx="4" />
				<rect x="40" y="10" width="35" height="110" fill="#ea580c" rx="4" />
				<rect x="80" y="25" width="35" height="95" fill="#f59e0b" rx="4" />

				{/* Book details */}
				<line x1="5" y1="40" x2="30" y2="40" stroke="white" strokeWidth="2" opacity="0.5" />
				<line x1="5" y1="60" x2="30" y2="60" stroke="white" strokeWidth="2" opacity="0.5" />

				<line x1="45" y1="30" x2="70" y2="30" stroke="white" strokeWidth="2" opacity="0.5" />
				<line x1="45" y1="50" x2="70" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />

				<line x1="85" y1="45" x2="110" y2="45" stroke="white" strokeWidth="2" opacity="0.5" />
				<line x1="85" y1="65" x2="110" y2="65" stroke="white" strokeWidth="2" opacity="0.5" />
			</g>

			{/* Brain/Light bulb concept */}
			<g transform="translate(180, 80)">
				<circle cx="20" cy="15" r="15" fill="url(#grad1)" />
				<path d="M 20 30 Q 15 40 20 50" stroke="url(#grad1)" strokeWidth="3" fill="none" />
				<circle cx="20" cy="55" r="5" fill="url(#grad1)" />
			</g>

			{/* Star accent */}
			<g transform="translate(80, 100)">
				<polygon points="0,-8 2,-2 8,-1 3,3 5,9 0,5 -5,9 -3,3 -8,-1 -2,-2" fill="#fbbf24" />
			</g>

			{/* Decorative elements */}
			<circle cx="320" cy="120" r="8" fill="#f59e0b" opacity="0.6" />
			<circle cx="350" cy="280" r="6" fill="#d97706" opacity="0.5" />
			<circle cx="70" cy="300" r="7" fill="#ea580c" opacity="0.5" />

			{/* Text label */}
			<text x="200" y="350" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#1f2937">
				Study Planner
			</text>
		</svg>
	);
}
