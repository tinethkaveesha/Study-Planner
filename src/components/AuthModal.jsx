import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { initializeUserData } from "../utils/userDataApi";

// Admin credentials
const ADMIN_EMAIL = "admin2010@gmail.com";
const ADMIN_REDIRECT_URL = "https://github.com/tinethkaveesha/admin"; // Replace with your actual admin URL

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: "", password: "", name: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
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
                    // Redirect to admin dashboard
                    window.location.href = ADMIN_REDIRECT_URL;
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

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Prevent admin from using Google Sign-In
            if (user.email === ADMIN_EMAIL) {
                setError("Admin account cannot use Google Sign-In. Please use email/password.");
                setLoading(false);
                return;
            }

            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName || "User",
                email: user.email,
                photoURL: user.photoURL || null,
                createdAt: new Date(),
                subscriptionPlan: null,
            }, { merge: true });

            // Initialize user data if new user (will overwrite if user already has data)
            try {
                await initializeUserData(user.uid, {
                    name: user.displayName || "User",
                    email: user.email,
                });
            } catch (err) {
                // User data may already exist, which is fine
                console.log("User data already initialized");
            }

            setFormData({ email: "", password: "", name: "", confirm: "" });
            onClose();
            navigate("/profile");
            setLoading(false);
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
                        <p className="text-gray-600 text-xs sm:text-sm">
                            {isLogin ? "Sign in to continue learning" : "Join thousands of students"}
                        </p>
                    </div>

                    {error && <div className="mb-4 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm">{error}</div>}

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-2 sm:py-3 mb-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-10 sm:min-h-11"
                    >
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="hidden xs:inline">{`${isLogin ? "Sign in" : "Sign up"} with Google`}</span>
                        <span className="inline xs:hidden">{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
                    </button>

                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                        <div className="relative flex justify-center text-xs sm:text-sm"><span className="px-2 bg-white text-gray-500">or</span></div>
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
                            {isLogin ? "Sign In" : "Create Account"}
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