import { useNavigate } from "react-router-dom";

export default function BlogCard({ post, isAuthor, onDelete, onPostClick }) {
    const navigate = useNavigate();

    const truncateContent = (content, limit = 150) => {
        return content.length > limit ? content.substring(0, limit) + "..." : content;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
            {/* Image */}
            {post.imageUrl && (
                <div className="h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
            )}

            {/* Content */}
            <div className="p-6">
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold mb-3">
                    {post.category}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-amber-700 transition-colors">
                    {post.title}
                </h3>

                {/* Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateContent(post.content)}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 py-4 border-y border-gray-200">
                    {post.authorPhoto && (
                        <img
                            src={post.authorPhoto}
                            alt={post.authorName}
                            className="w-10 h-10 rounded-full"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                            {post.authorName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 py-4 text-sm text-gray-600">
                    <span>Views: {post.views || 0}</span>
                    <span>Likes: {post.likes || 0}</span>
                    <span>Comments: {post.comments || 0}</span>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 2).map((tag, idx) => (
                            <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                        {post.tags.length > 2 && (
                            <span className="text-xs px-2 py-1 text-gray-600">
                                +{post.tags.length - 2} more
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onPostClick}
                        className="flex-1 px-4 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
                    >
                        Read More
                    </button>
                    {isAuthor && (
                        <>
                            <button
                                onClick={() => navigate(`/blog/edit/${post.id}`)}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Edit
                            </button>
                            <button
                                onClick={onDelete}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
