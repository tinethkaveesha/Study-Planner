import { Link } from "react-router-dom";
import { FaDiscord, FaInstagram, FaLinkedin } from "react-icons/fa";

/**
 * @typedef {Object} FooterLink
 * @property {string} name
 * @property {string} path
 * @property {boolean} [external] - Whether the link is external
 */

/**
 * @typedef {Object} FooterProps
 * @property {FooterLink[]} productLinks
 * @property {FooterLink[]} companyLinks
 * @property {FooterLink[]} legalLinks
 * @property {FooterLink[]} bottomLinks
 */

/**
 * @param {FooterProps} props
 */
export default function Footer({ productLinks, companyLinks, legalLinks, bottomLinks }) {
	return (
		<footer className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-8 sm:py-12 md:py-16">
			<div className="container mx-auto px-3 sm:px-4">
				<div className="grid gap-6 sm:gap-8 md:grid-cols-4 mb-6 sm:mb-8">
					<div className="space-y-3 sm:space-y-4">
						<div className="flex items-center gap-2">
							<div className="flex h-6 sm:h-8 w-6 sm:w-8 items-center justify-center rounded flex-shrink-0">
								<img src="/Logo.png" alt="logo" />
							</div>
							<span className="text-base sm:text-lg font-bold text-gray-900">Study Planner</span>
						</div>
						<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
							Your intelligent e-learning companion for smarter, more productive study sessions.
						</p>
						<div className="flex gap-3">
							<a 
								href="https://discord.gg/Sb4ESssy" 
								target="_blank" 
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-amber-700 transition-colors"
							>
								<FaDiscord size={18} />
							</a>
							<a 
								href="https://www.instagram.com/team_p.e.k.k.a/" 
								target="_blank" 
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-amber-700 transition-colors"
							>
								<FaInstagram size={18} />
							</a>
							<a 
								href="https://www.linkedin.com/in/team-p-e-k-k-a-7193833aa/" 
								target="_blank" 
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-amber-700 transition-colors"
							>
								<FaLinkedin size={18} />
							</a>
						</div>
					</div>
					<div>
						<h4 className="mb-3 sm:mb-4 font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
							Product
						</h4>
						<ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							{productLinks.map((link) => (
								<li key={link.path}>
									{link.external ? (
										<a 
											href={link.path} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-gray-600 hover:text-amber-700 transition-colors"
										>
											{link.name}
										</a>
									) : (
										<Link to={link.path} className="text-gray-600 hover:text-amber-700 transition-colors">
											{link.name}
										</Link>
									)}
								</li>
							))}
						</ul>
					</div>
					<div>
						<h4 className="mb-3 sm:mb-4 font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
							Company
						</h4>
						<ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							{companyLinks.map((link) => (
								<li key={link.path}>
									{link.external ? (
										<a 
											href={link.path} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-gray-600 hover:text-amber-700 transition-colors"
										>
											{link.name}
										</a>
									) : (
										<Link to={link.path} className="text-gray-600 hover:text-amber-700 transition-colors">
											{link.name}
										</Link>
									)}
								</li>
							))}
						</ul>
					</div>
					<div>
						<h4 className="mb-3 sm:mb-4 font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
							Legal
						</h4>
						<ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							{legalLinks.map((link) => (
								<li key={link.path}>
									<Link to={link.path} className="text-gray-600 hover:text-amber-700 transition-colors">
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="mt-8 sm:mt-12 pt-4 sm:pt-8 border-t border-gray-200">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">© 2026 Study Planner. All rights reserved.</p>
						<div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 justify-center sm:justify-end">
							{bottomLinks.map((link) => (
								<Link 
									key={link.path}
									to={link.path} 
									className="hover:text-amber-700 transition-colors"
								>
									{link.name}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}