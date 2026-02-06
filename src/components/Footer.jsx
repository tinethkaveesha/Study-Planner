import { FaDiscord, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from "../assets/Logo.png";

export default function Footer() {
	return (
		<footer className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-8 sm:py-12 md:py-16">
			<div className="container mx-auto px-3 sm:px-4">
				<div className="grid gap-6 sm:gap-8 md:grid-cols-4 mb-6 sm:mb-8">
					<div className="space-y-3 sm:space-y-4">
						<div className="flex items-center gap-2">
							<div className="flex h-6 sm:h-8 w-6 sm:w-8 items-center justify-center rounded flex-shrink-0">
								<img src={logo} alt="logo" />
							</div>
							<span className="text-base sm:text-lg font-bold text-gray-900">Study Planner</span>
						</div>
						<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
							Your intelligent e-learning companion for smarter, more productive study sessions.
						</p>
						<div className="flex gap-3">
							<a href="https://discord.gg/Sb4ESssy" className="text-gray-400 hover:text-amber-700 transition-colors">
								<FaDiscord size={18} />
							</a>
							<a href="https://www.instagram.com/team_p.e.k.k.a/" className="text-gray-400 hover:text-amber-700 transition-colors">
								<FaInstagram size={18} />
							</a>
							<a href="https://www.linkedin.com/in/team-p-e-k-k-a-7193833aa/" className="text-gray-400 hover:text-amber-700 transition-colors">
								<FaLinkedin size={18} />
							</a>
						</div>
					</div>
					<div>
						<h4 className="mb-3 sm:mb-4 font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
							Product
						</h4>
						<ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							<li>
								<a href="/features" className="text-gray-600 hover:text-amber-700 transition-colors">
									Features
								</a>
							</li>
							<li>
								<a href="/subscription" className="text-gray-600 hover:text-amber-700 transition-colors">
									Pricing
								</a>
							</li>
							<li>
								<a href="/download" className="text-gray-600 hover:text-amber-700 transition-colors">
									Download
								</a>
							</li>
							<li>
								<a href="/integrations" className="text-gray-600 hover:text-amber-700 transition-colors">
									Integrations
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-3 sm:mb-4 font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
							Company
						</h4>
						<ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							<li>
								<a href="https://team-pekka.netlify.app/" className="text-gray-600 hover:text-amber-700 transition-colors">
									About
								</a>
							</li>
							<li>
								<a href="/blog" className="text-gray-600 hover:text-amber-700 transition-colors">
									Blog
								</a>
							</li>
							<li>
								<a href="/careers" className="text-gray-600 hover:text-amber-700 transition-colors">
									Careers
								</a>
							</li>
							<li>
								<a href="/contact" className="text-gray-600 hover:text-amber-700 transition-colors">
									Contact
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-3 sm:mb-4 font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
							Legal
						</h4>
						<ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							<li>
								<a href="/terms-of-service" className="text-gray-600 hover:text-amber-700 transition-colors">
									Terms
								</a>
							</li>
							<li>
								<a href="/privacy" className="text-gray-600 hover:text-amber-700 transition-colors">
									Privacy
								</a>
							</li>
							<li>
								<a href="/cookies" className="text-gray-600 hover:text-amber-700 transition-colors">
									Cookies
								</a>
							</li>
							<li>
								<a href="/security" className="text-gray-600 hover:text-amber-700 transition-colors">
									Security
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-8 sm:mt-12 pt-4 sm:pt-8 border-t border-gray-200">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">© 2026 Study Planner. All rights reserved.</p>
						<div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 justify-center sm:justify-end">
							<a href="/support" className="hover:text-amber-700 transition-colors">
								Support
							</a>
							<a href="/docs" className="hover:text-amber-700 transition-colors">
								Docs
							</a>
							<a href="/status" className="hover:text-amber-700 transition-colors">
								Status
							</a>
							<a href="/api" className="hover:text-amber-700 transition-colors">
								API
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
