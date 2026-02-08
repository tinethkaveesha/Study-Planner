import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component - Automatically scrolls to top when route changes
 * This ensures users start at the top of each page when navigating
 * 
 * @param {Object} props
 * @param {boolean} [props.smooth=false] - Enable smooth scrolling instead of instant
 */
export default function ScrollToTop({ smooth = false }) {
	const { pathname } = useLocation();

	useEffect(() => {
		// Scroll to top when pathname changes
		if (smooth) {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			});
		} else {
			// Instant scroll (default) - more standard for page transitions
			window.scrollTo(0, 0);
		}
	}, [pathname, smooth]);

	return null;
}