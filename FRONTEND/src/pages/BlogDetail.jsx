import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    getBlogPost,
    getBlogComments,
    addBlogComment,
    deleteBlogComment,
    toggleBlogPostLike,
    incrementBlogPostViews,
} from "../utils/blogApi";

export default function BlogDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user, userData } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [commentText, setCommentText] = useState("");
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

    // Fetch post and comments
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const postData = await getBlogPost(postId);
                setPost(postData);
                setLikesCount(postData.likes || 0);

                // Increment views
                await incrementBlogPostViews(postId);

                // Fetch comments
                const commentsData = await getBlogComments(postId);
                setComments(commentsData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [postId]);

    const handleLike = async () => {
        if (!user) {
            alert("Please sign in to like posts");
            return;
        }

        try {
            await toggleBlogPostLike(postId, !isLiked);
            setIsLiked(!isLiked);
            setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please sign in to comment");
            return;
        }

        if (commentText.trim() === "") {
            alert("Comment cannot be empty");
            return;
        }

        try {
            setSubmittingComment(true);
            await addBlogComment(postId, {
                authorId: user.uid,
                authorName: userData?.name || "Anonymous",
                authorPhoto: userData?.photoURL || "",
                content: commentText,
            });

            // Refresh comments
            const updatedComments = await getBlogComments(postId);
            setComments(updatedComments);
            setCommentText("");
        } catch (err) {
            setError("Failed to add comment");
            console.error(err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            await deleteBlogComment(commentId, postId);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (err) {
            setError("Failed to delete comment");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-700"></div>
                    <p className="mt-6 text-lg text-gray-700 font-medium">Loading post...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-xl text-red-600 font-medium mb-4">Post not found</p>
                    <button
                        onClick={() => navigate("/blog")}
                        className="px-6 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
                    >
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/blog")}
                    className="mb-6 text-amber-700 font-semibold hover:underline flex items-center gap-2"
                >
                    ← Back to Blog
                </button>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
                        {error}
                    </div>
                )}

                {/* Post Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    {/* Header Image */}
                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-96 object-cover"
                        />
                    )}

                    {/* Post Content */}
                    <div className="p-8 sm:p-12">
                        {/* Category Badge */}
                        <span className="inline-block px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4">
                            {post.category}
                        </span>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {post.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-200 text-gray-600">
                            <div className="flex items-center gap-3">
                                {post.authorPhoto && (
                                    <img
                                        src={post.authorPhoto}
                                        alt={post.authorName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{post.authorName}</p>
                                    <p className="text-sm">
                                        {new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6 text-sm">
                                <span>👁️ {post.views || 0} views</span>
                                <span>💬 {post.comments || 0} comments</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose max-w-none mt-8 mb-8">
                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </p>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {post.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 py-6 border-t border-gray-200">
                            <button
                                onClick={handleLike}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    isLiked
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {isLiked ? "❤️" : "🤍"} {likesCount}
                            </button>
                            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all">
                                📤 Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 sm:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        💬 Comments ({comments.length})
                    </h2>

                    {/* Add Comment Form */}
                    {user ? (
                        <form onSubmit={handleAddComment} className="mb-8 pb-8 border-b border-gray-200">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-700 resize-none"
                                rows="3"
                            ></textarea>
                            <button
                                type="submit"
                                disabled={submittingComment}
                                className="mt-4 px-6 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all disabled:opacity-50"
                            >
                                {submittingComment ? "Posting..." : "Post Comment"}
                            </button>
                        </form>
                    ) : (
                        <div className="mb-8 pb-8 border-b border-gray-200 bg-amber-50 rounded-lg p-4">
                            <p className="text-gray-700 mb-4">Sign in to comment on this post</p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
                            >
                                Sign In
                            </button>
                        </div>
                    )}

                    {/* Comments List */}
                    {comments.length > 0 ? (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="pb-6 border-b border-gray-200 last:border-b-0"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            {comment.authorPhoto && (
                                                <img
                                                    src={comment.authorPhoto}
                                                    alt={comment.authorName}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {comment.authorName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(
                                                        comment.createdAt?.toDate?.() || comment.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {user?.uid === comment.authorId && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-600 hover:text-red-800 font-semibold text-sm"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
