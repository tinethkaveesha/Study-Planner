import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logo.png";
import { useState } from "react";
import { FiBell } from "react-icons/fi";

/**
 * @typedef {Object} NavLink
 * @property {string} name
 * @property {string} path
 */

/**
 * @typedef {Object} HeaderProps
 * @property {boolean} showMobileMenu
 * @property {() => void} toggleMobileMenu
 * @property {() => void} openAuthModal
 * @property {() => void} toggleNotificationPanel
 * @property {NavLink[]} navLinks
 */

/**
 * @param {HeaderProps} props
 */
export default function Header({
	showMobileMenu,
	toggleMobileMenu,
	openAuthModal,
	toggleNotificationPanel,
	navLinks,
}) {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, userData } = useAuth();
	const [imageLoadError, setImageLoadError] = useState(false);

	const handleNavigation = (path) => {
		if (!user && path !== "/") {
			navigate("/subscription");
		} else {
			navigate(path);
		}
	};

	const getUserInitial = () => {
		const name = userData?.name || user?.displayName || "U";
		return name.charAt(0).toUpperCase();
	};

	const getAvatarGradient = () => {
		const initial = getUserInitial();
		const charCode = initial.charCodeAt(0);

		const gradients = [
			"from-amber-400 via-orange-400 to-red-400",
			"from-blue-400 via-cyan-400 to-teal-400",
			"from-green-400 via-emerald-400 to-lime-400",
			"from-purple-400 via-pink-400 to-rose-400",
			"from-indigo-400 via-purple-400 to-blue-400",
			"from-yellow-400 via-orange-400 to-amber-400",
			"from-teal-400 via-cyan-400 to-blue-400",
		];

		return gradients[charCode % 7];
	};

	const AvatarIcon = () => {
		const [showImage, setShowImage] = useState(!imageLoadError && !!userData?.photoURL);

		const handleImageLoad = () => {
			setShowImage(true);
		};

		const handleImageError = () => {
			setImageLoadError(true);
			setShowImage(false);
		};

		return (
			<>
				{showImage && userData?.photoURL ? (
					<img
						src={userData.photoURL}
						alt={userData.name}
						onLoad={handleImageLoad}
						onError={handleImageError}
						className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover flex-shrink-0"
					/>
				) : (
					<div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
						{getUserInitial()}
					</div>
				)}
			</>
		);
	};

	return (
		<header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md safe-area-top">
			<div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
				<Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
					<div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-xl flex-shrink-0">
						<img src={logo} alt="logo" />
					</div>
					<span className="text-base sm:text-xl font-bold text-gray-900 truncate">Study Planner</span>
				</Link>

				<nav className="hidden items-center gap-3 md:gap-6 md:flex text-xs sm:text-sm">
					{navLinks.map((link) => {
						const isActive = location.pathname === link.path;
						return (
							<button
								key={link.path}
								onClick={() => handleNavigation(link.path)}
								className="text-gray-600 hover:text-amber-700 font-medium transition-colors px-2 py-1 rounded"
							>
								{link.name}
							</button>
						);
					})}
				</nav>

				<div className="flex items-center gap-2 sm:gap-3">
					<button
						onClick={toggleNotificationPanel}
						className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 relative transition-colors"
					>
						<FiBell className="text-gray-600 text-lg" />
					</button>
					{user && userData ? (
						<div className="flex items-center gap-2 sm:gap-3">
							<button
								onClick={() => navigate("/profile")}
								className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition-all font-medium group min-h-10"
							>
								<AvatarIcon />
								<span className="hidden sm:inline text-amber-900 group-hover:text-amber-950 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
									{userData.name?.split(" ")[0]}
								</span>
							</button>
						</div>
					) : (
						<button
							onClick={openAuthModal}
							className="px-3 sm:px-6 py-1.5 sm:py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all font-semibold text-xs sm:text-sm min-h-10"
						>
							Sign In
						</button>
					)}
					<button
						className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
						onClick={toggleMobileMenu}
					>
						<span className="text-lg">☰</span>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{showMobileMenu && (
				<nav className="md:hidden border-t border-gray-200 bg-white">
					<div className="container mx-auto px-3 sm:px-4 py-2 space-y-1">
						{navLinks.map((link) => {
							const isActive = location.pathname === link.path;
							return (
								<Link
									key={link.name}
									to={link.path}
									onClick={toggleMobileMenu}
									className={`block py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm ${
										isActive
											? "text-gray-900 font-medium bg-amber-50"
											: "text-gray-600 hover:bg-gray-50"
									}`}
								>
									{link.name}
								</Link>
							);
						})}
					</div>
				</nav>
			)}
		</header>
	);
}
