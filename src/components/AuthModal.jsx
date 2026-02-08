import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { initializeUserData } from "../utils/userDataApi";
import { FcGoogle } from "react-icons/fc";

// Admin credentials
const ADMIN_EMAIL = "admin2010@gmail.com";
const ADMIN_REDIRECT_URL = "https://admin-pekkka.netlify.app/";

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: "", password: "", name: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if this is admin account
            if (user.email === ADMIN_EMAIL) {
                onClose();
                setTimeout(() => {
                    window.location.replace(ADMIN_REDIRECT_URL);
                }, 100);
                setLoading(false);
                return;
            }

            // Check if user document exists in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // New user - create profile
                await setDoc(userDocRef, {
                    name: user.displayName || "User",
                    email: user.email,
                    createdAt: new Date(),
                    subscriptionPlan: null,
                    photoURL: user.photoURL || null,
                });

                // Initialize user progress, analytics, groups, and settings
                await initializeUserData(user.uid, {
                    name: user.displayName || "User",
                    email: user.email,
                });
            }

            onClose();
            navigate("/profile");
            setLoading(false);
        } catch (err) {
            console.error("Google sign-in error:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                // Sign in
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                
                // Check if this is admin account
                if (formData.email === ADMIN_EMAIL) {
                    // Reset form and close modal
                    setFormData({ email: "", password: "", name: "", confirm: "" });
                    onClose();
                    
                    // Use setTimeout to ensure state updates complete before redirect
                    setTimeout(() => {
                        // Use replace instead of href to prevent back button issues
                        window.location.replace(ADMIN_REDIRECT_URL);
                    }, 100);
                    
                    setLoading(false);
                } else {
                    // Regular user - redirect to profile
                    setFormData({ email: "", password: "", name: "", confirm: "" });
                    onClose();
                    navigate("/profile");
                }
                setLoading(false);
            } else {
                // Sign up
                if (formData.password !== formData.confirm) {
                    setError("Passwords don't match");
                    setLoading(false);
                    return;
                }

                // Prevent admin account creation through signup
                if (formData.email === ADMIN_EMAIL) {
                    setError("This email is reserved. Please use a different email.");
                    setLoading(false);
                    return;
                }

                // Create user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                
                // Store user profile in Firestore
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    name: formData.name,
                    email: formData.email,
                    createdAt: new Date(),
                    subscriptionPlan: null,
                    photoURL: null,
                });

                // Initialize user progress, analytics, groups, and settings
                await initializeUserData(userCredential.user.uid, {
                    name: formData.name,
                    email: formData.email,
                });
                
                setFormData({ email: "", password: "", name: "", confirm: "" });
                onClose();
                navigate("/profile");
                setLoading(false);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40 modal-backdrop" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 text-lg sm:text-xl min-h-10 min-w-10 flex items-center justify-center"
                    >
                        ✕
                    </button>

                    <div className="text-center mb-4 sm:mb-8 pr-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                            {isLogin ? "Welcome to Study Planner" : "Create Your Account"}
                        </h2>
                    </div>

                    {error && <div className="mb-4 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm">{error}</div>}

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-2 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 text-xs sm:text-sm min-h-10 sm:min-h-11 flex items-center justify-center gap-2 mb-4"
                    >
                        <FcGoogle className="text-lg sm:text-xl" />
                        {isLogin ? "Continue with Google" : "Sign up with Google"}
                    </button>

                    {/* Divider */}
                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent text-xs sm:text-sm min-h-10"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent text-xs sm:text-sm min-h-10"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent text-xs sm:text-sm min-h-10"
                                placeholder="••••••••"
                            />
                        </div>
                        {!isLogin && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirm"
                                    value={formData.confirm}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent text-xs sm:text-sm min-h-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 sm:py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all disabled:opacity-50 text-xs sm:text-sm min-h-10 sm:min-h-11"
                        >
                            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                        </button>
                    </form>

                    <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
                        <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-amber-700 hover:text-amber-800 font-medium ml-1"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}