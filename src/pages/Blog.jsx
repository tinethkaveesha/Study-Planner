import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBlogPosts, getBlogPostsByCategory, deleteBlogPost, searchBlogPosts } from "../utils/blogApi";
import BlogCard from "../components/BlogCard";
import CreateBlogModal from "../components/CreateBlogModal";

const CATEGORIES = ["All", "Study Tips", "Motivation", "Resources", "News", "Technology"];

export default function Blog() {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch blog posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                let data;

                if (selectedCategory === "All") {
                    data = await getBlogPosts();
                } else {
                    data = await getBlogPostsByCategory(selectedCategory);
                }

                setPosts(data);
                setFilteredPosts(data);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [selectedCategory, refreshKey]);

    // Handle search
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter((post) => {
                const titleMatch = post.title?.toLowerCase().includes(searchTerm.toLowerCase());
                const contentMatch = post.content?.toLowerCase().includes(searchTerm.toLowerCase());
                return titleMatch || contentMatch;
            });
            setFilteredPosts(filtered);
        }
    }, [searchTerm, posts]);

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await deleteBlogPost(postId);
            setPosts(posts.filter((p) => p.id !== postId));
        } catch (err) {
            setError("Failed to delete post");
        }
    };

    const handlePostCreated = () => {
        setShowCreateModal(false);
        setRefreshKey((prev) => prev + 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-700"></div>
                    <p className="mt-6 text-lg text-gray-700 font-medium">Loading blog posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        📚 Study Planner Blog
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Insights, tips, and stories from our learning community
                    </p>

                    {user && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        >
                            ✍️ Write a Post
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
                        {error}
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-700 transition-all"
                    />
                </div>

                {/* Category Filter */}
                <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setSearchTerm("");
                            }}
                            className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                                selectedCategory === category
                                    ? "bg-amber-700 text-white shadow-lg"
                                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-700"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <BlogCard
                                key={post.id}
                                post={post}
                                isAuthor={user?.uid === post.authorId}
                                onDelete={() => handleDeletePost(post.id)}
                                onPostClick={() => navigate(`/blog/${post.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600 mb-4">
                            {searchTerm ? "No posts found matching your search" : "No posts yet"}
                        </p>
                        {!user && (
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
                            >
                                Sign in to Read Posts
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Blog Modal */}
            {showCreateModal && (
                <CreateBlogModal
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={handlePostCreated}
                    user={user}
                    userData={userData}
                />
            )}
        </div>
    );
}
