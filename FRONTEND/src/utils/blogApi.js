/**
 * Blog API utilities for Firebase Firestore
 * Handles all blog-related database operations
 */

import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDocs,
    query,
    orderBy,
    where,
    getDoc,
    writeBatch,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Create a new blog post
 * @param {Object} postData - Blog post data
 * @returns {Promise<string>} Document ID of created post
 */
export async function createBlogPost(postData) {
    try {
        const docRef = await addDoc(collection(db, "blog_posts"), {
            ...postData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            likes: 0,
            comments: 0,
            views: 0,
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating blog post:", error);
        throw error;
    }
}

/**
 * Get all blog posts with pagination
 * @param {number} limit - Number of posts to fetch
 * @returns {Promise<Array>} Array of blog posts
 */
export async function getBlogPosts(limit = 10) {
    try {
        const q = query(
            collection(db, "blog_posts"),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
    }
}

/**
 * Get a single blog post by ID
 * @param {string} postId - Blog post ID
 * @returns {Promise<Object>} Blog post data
 */
export async function getBlogPost(postId) {
    try {
        const docRef = doc(db, "blog_posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            };
        } else {
            throw new Error("Blog post not found");
        }
    } catch (error) {
        console.error("Error fetching blog post:", error);
        throw error;
    }
}

/**
 * Update a blog post
 * @param {string} postId - Blog post ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export async function updateBlogPost(postId, updateData) {
    try {
        const docRef = doc(db, "blog_posts", postId);
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating blog post:", error);
        throw error;
    }
}

/**
 * Delete a blog post
 * @param {string} postId - Blog post ID
 * @returns {Promise<void>}
 */
export async function deleteBlogPost(postId) {
    try {
        // Delete post
        await deleteDoc(doc(db, "blog_posts", postId));

        // Delete associated comments
        const commentsQuery = query(
            collection(db, "blog_comments"),
            where("postId", "==", postId)
        );
        const commentsSnapshot = await getDocs(commentsQuery);

        const batch = writeBatch(db);
        commentsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        console.error("Error deleting blog post:", error);
        throw error;
    }
}

/**
 * Get blog posts by category
 * @param {string} category - Blog category
 * @returns {Promise<Array>} Array of blog posts in category
 */
export async function getBlogPostsByCategory(category) {
    try {
        const q = query(
            collection(db, "blog_posts"),
            where("category", "==", category),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching posts by category:", error);
        throw error;
    }
}

/**
 * Get blog posts by author
 * @param {string} authorId - Author user ID
 * @returns {Promise<Array>} Array of blog posts by author
 */
export async function getBlogPostsByAuthor(authorId) {
    try {
        const q = query(
            collection(db, "blog_posts"),
            where("authorId", "==", authorId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching posts by author:", error);
        throw error;
    }
}

/**
 * Add a comment to a blog post
 * @param {string} postId - Blog post ID
 * @param {Object} commentData - Comment data
 * @returns {Promise<string>} Document ID of created comment
 */
export async function addBlogComment(postId, commentData) {
    try {
        const docRef = await addDoc(collection(db, "blog_comments"), {
            postId,
            ...commentData,
            createdAt: serverTimestamp(),
            likes: 0,
        });

        // Increment comment count on post
        const postRef = doc(db, "blog_posts", postId);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
            await updateDoc(postRef, {
                comments: (postDoc.data().comments || 0) + 1,
            });
        }

        return docRef.id;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}

/**
 * Get comments for a blog post
 * @param {string} postId - Blog post ID
 * @returns {Promise<Array>} Array of comments
 */
export async function getBlogComments(postId) {
    try {
        const q = query(
            collection(db, "blog_comments"),
            where("postId", "==", postId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
}

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @param {string} postId - Blog post ID
 * @returns {Promise<void>}
 */
export async function deleteBlogComment(commentId, postId) {
    try {
        await deleteDoc(doc(db, "blog_comments", commentId));

        // Decrement comment count on post
        const postRef = doc(db, "blog_posts", postId);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
            await updateDoc(postRef, {
                comments: Math.max(0, (postDoc.data().comments || 1) - 1),
            });
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

/**
 * Like/Unlike a blog post
 * @param {string} postId - Blog post ID
 * @param {boolean} isLike - True to like, false to unlike
 * @returns {Promise<void>}
 */
export async function toggleBlogPostLike(postId, isLike) {
    try {
        const postRef = doc(db, "blog_posts", postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            const currentLikes = postDoc.data().likes || 0;
            await updateDoc(postRef, {
                likes: isLike ? currentLikes + 1 : Math.max(0, currentLikes - 1),
            });
        }
    } catch (error) {
        console.error("Error updating likes:", error);
        throw error;
    }
}

/**
 * Increment blog post views
 * @param {string} postId - Blog post ID
 * @returns {Promise<void>}
 */
export async function incrementBlogPostViews(postId) {
    try {
        const postRef = doc(db, "blog_posts", postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            await updateDoc(postRef, {
                views: (postDoc.data().views || 0) + 1,
            });
        }
    } catch (error) {
        console.error("Error incrementing views:", error);
        // Don't throw - this is non-critical
    }
}

/**
 * Search blog posts by title or content
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching blog posts
 */
export async function searchBlogPosts(searchTerm) {
    try {
        const allPosts = await getBlogPosts();
        const searchLower = searchTerm.toLowerCase();

        return allPosts.filter((post) => {
            const titleMatch = post.title?.toLowerCase().includes(searchLower);
            const contentMatch = post.content?.toLowerCase().includes(searchLower);
            const tagsMatch = post.tags?.some((tag) =>
                tag.toLowerCase().includes(searchLower)
            );

            return titleMatch || contentMatch || tagsMatch;
        });
    } catch (error) {
        console.error("Error searching blog posts:", error);
        throw error;
    }
}

/**
 * Get trending blog posts
 * @param {number} limit - Number of posts to return
 * @returns {Promise<Array>} Array of trending posts
 */
export async function getTrendingBlogPosts(limit = 5) {
    try {
        const allPosts = await getBlogPosts();
        return allPosts
            .sort((a, b) => {
                const scoreA = (a.views || 0) + (a.likes || 0) * 2;
                const scoreB = (b.views || 0) + (b.likes || 0) * 2;
                return scoreB - scoreA;
            })
            .slice(0, limit);
    } catch (error) {
        console.error("Error fetching trending posts:", error);
        throw error;
    }
}
