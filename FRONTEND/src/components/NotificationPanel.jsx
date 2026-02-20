import { useState, useEffect } from "react";
import { getBlogPosts } from "../utils/blogApi";

export default function NotificationPanel({ isOpen, onClose }) {
	const [blogPosts, setBlogPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!isOpen) return;

		const loadBlogPosts = async () => {
			try {
				setLoading(true);
				setError("");
				const posts = await getBlogPosts(10); // Fetch latest 10 blog posts
				setBlogPosts(posts);
			} catch (err) {
				console.error("Error loading blog posts:", err);
				setError("Failed to load blog posts");
				setBlogPosts([]);
			} finally {
				setLoading(false);
			}
		};

		loadBlogPosts();
	}, [isOpen]);

	const formatDate = (timestamp) => {
		if (!timestamp) return "Recently";
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	};

	return (
		<>
			{isOpen && (
				<>
					<div className="fixed inset-0 bg-black/20 z-30 md:bg-transparent" onClick={onClose}></div>
					<div className="fixed bottom-0 left-0 right-0 md:right-0 md:top-16 md:bottom-auto md:left-auto md:h-screen w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-gray-200 shadow-2xl transform z-40 overflow-y-auto rounded-t-2xl md:rounded-none max-h-[90vh] md:max-h-none">
						<div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl md:rounded-none">
							<h2 className="text-lg sm:text-xl font-bold text-gray-900">Latest Blog Posts</h2>
							<p className="text-xs sm:text-sm text-gray-600 mt-1">Stay updated with study tips and insights</p>
						</div>
						
						{loading ? (
							<div className="p-6 text-center">
								<div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-amber-200 border-t-amber-700"></div>
								<p className="text-gray-600 text-xs sm:text-sm mt-4">Loading blog posts...</p>
							</div>
						) : error ? (
							<div className="p-6 text-center text-red-600">
								<p className="text-xs sm:text-sm">{error}</p>
							</div>
						) : blogPosts.length === 0 ? (
							<div className="p-6 text-center text-gray-500">
								<div className="text-4xl mb-2">�</div>
								<p className="text-xs sm:text-sm">No blog posts yet</p>
								<p className="text-xs text-gray-400 mt-2">Check back soon for interesting study tips!</p>
							</div>
						) : (
							<div className="divide-y divide-gray-100">
								{blogPosts.map((post) => (
									<div key={post.id} className="p-3 sm:p-4 hover:bg-amber-50 transition-colors cursor-pointer group">
										<div className="flex gap-2 sm:gap-3">
											<div className="flex-shrink-0 mt-0 sm:mt-1">
												<span className="text-xl sm:text-2xl font-semibold">
													{post.category === "Tips" ? "💡" :
													post.category === "Motivation" ? "✨" :
													post.category === "Study" ? "📚" :
													post.category === "News" ? "📰" : "♾️"}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-amber-700">
													{post.title}
												</h3>
												<p className="text-gray-600 text-xs mt-1 line-clamp-2">
													{post.excerpt || post.content?.substring(0, 80) || "Check out this post"}
												</p>
												<div className="flex items-center gap-2 mt-1.5 flex-wrap">
													{post.category && (
														<span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
															{post.category}
														</span>
													)}
													<span className="text-gray-400 text-xs">
														{formatDate(post.createdAt)}
													</span>
													{post.views > 0 && (
														<span className="text-gray-400 text-xs">
															Views: {post.views}
														</span>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
						
						{!loading && blogPosts.length > 0 && (
							<div className="p-3 sm:p-4 text-center border-t border-gray-200 sticky bottom-0 bg-white">
								<button
									onClick={onClose}
									className="text-xs sm:text-sm text-amber-700 hover:text-amber-800 font-medium min-h-10 px-4 py-2"
								>
									Close Panel
								</button>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
}
