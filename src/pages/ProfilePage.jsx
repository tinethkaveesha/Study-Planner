import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { 
    getUserProgress, 
    getUserStudySessions, 
    getUserRealTimeStats,
    getAcademicProgress,
    getSubjectMarkAnalysis,
    getUserAssessments,
    getUserProfile
} from "../utils/userDataApi";

export default function ProfilePage() {
    const { user, userData, loading, isOnline, logout } = useAuth();
    const navigate = useNavigate();
    const [examType, setExamType] = useState("ordinary"); // Add exam type state
    const [profileData, setProfileData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [stats, setStats] = useState({ courses: 0, hoursStudied: 0, progress: 0 });
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    // Progress data states
    const [progressData, setProgressData] = useState({
        totalHours: 0,
        currentStreak: 0,
        overallProgress: 0,
        weeklyData: [0, 0, 0, 0, 0, 0, 0],
        weekLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        achievements: [],
        sessions: [],
        loading: true,
        error: null,
    });

    // Academic progress states
    const [academicProgress, setAcademicProgress] = useState(null);
    const [subjectAnalysis, setSubjectAnalysis] = useState({});
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

    // Load full profile data from Firestore including profile image
    useEffect(() => {
        if (!user) return;

        const loadProfileData = async () => {
            try {
                // Try multiple ways to get profile image
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    console.log("📸 User Data from Firestore:", data);
                    
                    setProfileData(data);
                    
                    // Check multiple possible field names for profile image
                    const imageUrl = data?.photoURL || 
                                    data?.profilePicture || 
                                    data?.profileImage || 
                                    data?.avatar || 
                                    data?.avatarUrl ||
                                    user?.photoURL;
                    
                    if (imageUrl) {
                        console.log("🖼️ Profile Image found:", imageUrl);
                        setImageLoadError(false);
                    } else {
                        console.log("⚠️ No profile image URL found in Firestore");
                        setImageLoadError(true);
                    }
                } else {
                    console.log("⚠️ User document not found");
                    setImageLoadError(true);
                }
            } catch (err) {
                console.error("❌ Error loading profile:", err);
                setImageLoadError(true);
            }
        };

        loadProfileData();
    }, [user]);

    // Real-time stats listener
    useEffect(() => {
        if (!user) return;

        const statsRef = doc(db, "users", user.uid, "stats", "overview");
        const unsubscribe = onSnapshot(
            statsRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setStats(docSnap.data());
                }
            },
            (err) => console.error("Stats error:", err)
        );

        return () => unsubscribe();
    }, [user]);

    // Load progress and academic data from Firestore Analytics
    const loadProgressData = async () => {
        if (!user) return;

        try {
            setRefreshing(true);
            console.log("📊 Loading analytics data for user:", user.uid);
            
            const statsData = await getUserRealTimeStats(user.uid);
            const progress = await getUserProgress(user.uid);
            const sessions = await getUserStudySessions(user.uid);
            const academic = await getAcademicProgress(user.uid, examType);
            const subjectMarks = await getSubjectMarkAnalysis(user.uid, examType);
            const assessmentScores = await getUserAssessments(user.uid);

            console.log("📈 Real-time Stats:", statsData);
            console.log("📊 Progress Data:", progress);
            console.log("⏱️ Sessions Count:", sessions?.length);
            console.log("🎓 Academic:", academic);

            // Calculate weekly data from sessions (last 7 days)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const weeklyData = [0, 0, 0, 0, 0, 0, 0];
            const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            
            if (sessions && sessions.length > 0) {
                sessions.forEach((session) => {
                    if (session.startTime) {
                        const sessionDate = new Date(session.startTime.toDate?.() || session.startTime);
                        sessionDate.setHours(0, 0, 0, 0);
                        
                        const dayDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
                        
                        if (dayDiff >= 0 && dayDiff < 7) {
                            const dayIndex = 6 - dayDiff;
                            weeklyData[dayIndex] += (session.duration || 0) / 60;
                        }
                    }
                });
            }

            console.log("📅 Weekly Data:", weeklyData);

            const achievements = [
                {
                    title: "🔥 7-Day Streak",
                    description: "Study for 7 consecutive days",
                    completed: (statsData?.currentStreak || 0) >= 7,
                    progress: `${Math.min(statsData?.currentStreak || 0, 7)}/7 days`,
                },
                {
                    title: "⏱️ 100 Hours",
                    description: "Complete 100 hours of study",
                    completed: (statsData?.totalStudyHours || 0) >= 100,
                    progress: `${Math.round(statsData?.totalStudyHours || 0)}/100 hours`,
                },
                {
                    title: "📅 Perfect Week",
                    description: "Complete all daily goals in a week",
                    completed: (statsData?.totalStudyHours || 0) >= 14 && (statsData?.currentStreak || 0) >= 7,
                    progress: weeklyData.reduce((a, b) => a + b, 0).toFixed(1) + "/14 hours",
                },
                {
                    title: "📚 Course Explorer",
                    description: "Access 5 different courses",
                    completed: (statsData?.activeCourses || 0) >= 5,
                    progress: `${statsData?.activeCourses || 0}/5 courses`,
                },
                {
                    title: "⭐ Excellent Scholar",
                    description: "Achieve 80%+ average across all subjects",
                    completed: (academic?.overallAverage || 0) >= 80,
                    progress: `${Math.round(academic?.overallAverage || 0)}%`,
                },
                {
                    title: "🏆 All-Rounder",
                    description: "Maintain consistent performance (all subjects ≥ 70%)",
                    completed: academic?.subjectScores?.every?.((s) => s.score >= 70),
                    progress: `${academic?.subjectScores?.filter?.((s) => s.score >= 70)?.length || 0}/${academic?.subjectScores?.length || 0} subjects`,
                },
            ];

            setProgressData({
                totalHours: Math.round((statsData?.totalStudyHours || progress?.totalHours || 0) * 10) / 10,
                currentStreak: statsData?.currentStreak || progress?.currentStreak || 0,
                overallProgress: Math.round(progress?.averageScore || academic?.overallAverage || statsData?.averageScore || 0),
                weeklyData,
                weekLabels,
                achievements,
                sessions: sessions?.slice(0, 10) || [],
                loading: false,
                error: null,
            });

            setAcademicProgress(academic);
            setSubjectAnalysis(subjectMarks || {});
            setAssessments(assessmentScores || []);

            console.log("✅ All analytics data loaded successfully!");
        } catch (error) {
            console.error("❌ Error loading progress:", error);
            setProgressData((prev) => ({
                ...prev,
                loading: false,
                error: "Failed to load progress data",
            }));
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadProgressData();
        const interval = setInterval(loadProgressData, 30000);
        return () => clearInterval(interval);
    }, [user, examType]);

    const handleSignOut = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            setError("Failed to sign out");
        }
    };

    const getUserInitial = () => {
        const name = profileData?.name || userData?.name || user?.displayName || "U";
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

    // Enhanced avatar component with proper error handling
    const AvatarComponent = () => {
        const [showImage, setShowImage] = useState(!imageLoadError && !!profileImage);

        const handleImageLoad = () => {
            console.log("✅ Profile image loaded successfully");
            setShowImage(true);
        };

        const handleImageError = (e) => {
            console.error("❌ Failed to load profile image:", e);
            setImageLoadError(true);
            setShowImage(false);
        };

        return (
            <div className="flex-shrink-0 relative z-10 group">
                {showImage && profileImage ? (
                    <>
                        <img
                            src={profileImage}
                            alt={profileData?.name || userData?.name || "Profile"}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            className="w-40 h-40 rounded-2xl border-4 border-white shadow-lg object-cover group-hover:shadow-2xl transition-all"
                        />
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white transition-colors bg-green-500"></div>
                    </>
                ) : (
                    <>
                        <div className={`w-40 h-40 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center group-hover:shadow-2xl transition-all cursor-pointer relative`}>
                            <span className="text-7xl font-black text-white drop-shadow-lg select-none">
                                {getUserInitial()}
                            </span>
                            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-700 shadow-md" title={user?.uid}>
                                ✓
                            </div>
                        </div>
                        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white transition-colors ${isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
                    </>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-700"></div>
                    <p className="mt-6 text-lg text-gray-700 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-lg text-red-600 font-medium">{error || "Please sign in to view your profile"}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 py-2 px-6 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Card with Cover */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 hover:shadow-2xl transition-shadow">
                    {/* Cover Image */}
                    <div className="h-40 sm:h-48 bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-20 -translate-y-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 translate-y-16"></div>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="px-6 sm:px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 mb-8">
                            {/* Avatar Component with Enhanced Error Handling */}
                            <AvatarComponent />

                            {/* User Basic Info */}
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-gray-900">{profileData?.name || userData?.name}</h1>
                                <p className="text-lg text-amber-700 font-medium mt-1">{profileData?.email || userData?.email}</p>
                                
                                {/* Image Debug Info */}
                                {imageLoadError && profileImage && (
                                    <p className="text-xs text-red-500 mt-2">🖼️ Image: {profileImage.substring(0, 40)}...</p>
                                )}
                                
                                <div className="flex gap-4 mt-4 flex-wrap">
                                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                        {isOnline ? "✓ Online" : "Offline"}
                                    </span>
                                    <span className="inline-block px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                                        {profileData?.subscriptionPlan || userData?.subscriptionPlan || "Free Plan"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    📅 Member since {new Date(userData.createdAt?.toDate?.() || userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>

                                {/* Exam Type Selector */}
                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">📚 Exam Type:</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {["ordinary", "scholarship", "advanced"].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setExamType(type)}
                                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                    examType === type
                                                        ? "bg-amber-600 text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                            >
                                                {type === "ordinary"
                                                    ? "O/L"
                                                    : type === "scholarship"
                                                    ? "Scholarship"
                                                    : "A/L"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Stats Grid from Firestore Analytics */}
                        <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-200">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center hover:shadow-lg transition-all">
                                <p className="text-3xl font-bold text-amber-700">{progressData.totalHours}h</p>
                                <p className="text-sm text-gray-600 mt-1">Total Study Hours</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center hover:shadow-lg transition-all">
                                <p className="text-3xl font-bold text-orange-700">{progressData.currentStreak}🔥</p>
                                <p className="text-sm text-gray-600 mt-1">Day Streak</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 text-center hover:shadow-lg transition-all">
                                <p className="text-3xl font-bold text-red-700">{progressData.overallProgress}%</p>
                                <p className="text-sm text-gray-600 mt-1">Overall Progress</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Account Details - Left Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between gap-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <span className="text-xl">👤</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100 hover:bg-gray-50 px-2 py-2 rounded transition-all">
                                    <span className="text-gray-600 font-medium">Full Name</span>
                                    <span className="font-semibold text-gray-900">{profileData?.name || userData?.name}</span>
                                </div>

                                <div className="flex justify-between items-center pb-4 border-b border-gray-100 hover:bg-gray-50 px-2 py-2 rounded transition-all">
                                    <span className="text-gray-600 font-medium">Email Address</span>
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base break-all">{profileData?.email || userData?.email}</span>
                                </div>

                                <div className="flex justify-between items-center pb-4 border-b border-gray-100 hover:bg-gray-50 px-2 py-2 rounded transition-all">
                                    <span className="text-gray-600 font-medium">Account Status</span>
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Active</span>
                                </div>

                                <div className="flex justify-between items-center hover:bg-gray-50 px-2 py-2 rounded transition-all">
                                    <span className="text-gray-600 font-medium">Member Since</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date((profileData?.createdAt || userData?.createdAt)?.toDate?.() || profileData?.createdAt || userData?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ...rest of the existing code... */}
                        {/* Weekly Progress Chart from Firestore */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">📊 Weekly Progress Analytics</h2>
                                <button
                                    onClick={loadProgressData}
                                    disabled={refreshing}
                                    className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all disabled:opacity-50"
                                    title="Refresh data from Firestore"
                                >
                                    {refreshing ? "⟳ Refreshing..." : "🔄 Refresh"}
                                </button>
                            </div>
                            
                            {progressData.weeklyData.reduce((a, b) => a + b, 0) === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>📭 No session data yet. Start a study session to see your progress!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-end h-48 bg-gradient-to-b from-gray-50 to-white rounded-lg p-6 border border-gray-200">
                                        {progressData.weeklyData.map((height, i) => {
                                            const maxHeight = Math.max(...progressData.weeklyData, 1);
                                            const percentage = (height / maxHeight) * 100;
                                            
                                            return (
                                                <div key={i} className="flex flex-col items-center flex-1 group">
                                                    <div className="relative w-full h-32 flex items-end justify-center gap-1 mb-2">
                                                        <div
                                                            className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-orange-500 transition-all group-hover:from-amber-700 group-hover:to-orange-600 group-hover:shadow-lg cursor-pointer relative"
                                                            style={{ height: `${percentage}%` }}
                                                            title={`${height.toFixed(1)} hours`}
                                                        >
                                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                {height.toFixed(1)}h
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-600">{progressData.weekLabels[i]}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="grid grid-cols-4 gap-3 mt-6">
                                        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                                            <p className="text-2xl font-bold text-blue-700">{progressData.weeklyData.reduce((a, b) => a + b, 0).toFixed(1)}</p>
                                            <p className="text-xs text-blue-600 mt-1">Week Total</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                                            <p className="text-2xl font-bold text-green-700">{(progressData.weeklyData.reduce((a, b) => a + b, 0) / 7).toFixed(1)}</p>
                                            <p className="text-xs text-green-600 mt-1">Daily Avg</p>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                                            <p className="text-2xl font-bold text-purple-700">{Math.max(...progressData.weeklyData).toFixed(1)}</p>
                                            <p className="text-xs text-purple-600 mt-1">Best Day</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                                            <p className="text-2xl font-bold text-orange-700">{progressData.weeklyData.filter(d => d > 0).length}</p>
                                            <p className="text-xs text-orange-600 mt-1">Active Days</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Achievements - continuing from existing code */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Achievements & Goals</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {progressData.achievements.map((achievement, idx) => (
                                    <div
                                        key={idx}
                                        className={`rounded-xl border-2 p-4 transition-all ${
                                            achievement.completed
                                                ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md"
                                                : "border-gray-300 bg-white hover:border-amber-200"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className="text-3xl">
                                                {achievement.completed ? "🏆" : "🎯"}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                                                    {achievement.title}
                                                </h3>
                                                <p className="text-gray-600 text-xs mt-1">
                                                    {achievement.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-gray-600">
                                                    {achievement.progress}
                                                </span>
                                                {achievement.completed && (
                                                    <span className="text-amber-600 text-xs font-bold">✓ Unlocked</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Academic Performance */}
                        {academicProgress && academicProgress.subjectScores && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow mb-8 border-t-4 border-amber-700">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Academic Performance</h2>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 text-center hover:shadow-md transition">
                                        <div className="text-3xl font-bold text-amber-700">
                                            {Math.round(academicProgress.overallAverage || 0)}%
                                        </div>
                                        <p className="text-xs text-amber-900 mt-1 font-semibold">Overall Avg</p>
                                    </div>
                                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-center hover:shadow-md transition">
                                        <div className="text-3xl font-bold text-blue-700">
                                            {academicProgress.subjectScores?.length || 0}
                                        </div>
                                        <p className="text-xs text-blue-900 mt-1 font-semibold">Subjects</p>
                                    </div>
                                    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-center hover:shadow-md transition">
                                        <div className="text-3xl font-bold text-green-700">
                                            {academicProgress.improvingSubjects || 0}
                                        </div>
                                        <p className="text-xs text-green-900 mt-1 font-semibold">Improving ↑</p>
                                    </div>
                                    <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-center hover:shadow-md transition">
                                        <div className="text-3xl font-bold text-red-700">
                                            {academicProgress.decreasingSubjects || 0}
                                        </div>
                                        <p className="text-xs text-red-900 mt-1 font-semibold">Declining ↓</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border-2 border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-4">📚 Subject Performance</h3>
                                    <div className="space-y-3">
                                        {academicProgress.subjectScores.map((subject) => (
                                            <div key={subject.name} className="bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-amber-200 hover:shadow-md transition">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{subject.name}</h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            📊 High: {subject.highest}% | Low: {subject.lowest}% | Tests: {subject.testsCount || 0}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-amber-700">{Math.round(subject.score)}%</div>
                                                        <div className={`text-sm font-bold ${
                                                            subject.trend === "↑" ? "text-green-600" : 
                                                            subject.trend === "↓" ? "text-red-600" : 
                                                            "text-gray-600"
                                                        }`}>
                                                            {subject.trend || "→"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all rounded-full ${
                                                            subject.score >= 80 ? "bg-green-500" :
                                                            subject.score >= 60 ? "bg-amber-500" :
                                                            "bg-red-500"
                                                        }`}
                                                        style={{ width: `${Math.min(subject.score, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Assessment Scores */}
                        {assessments && assessments.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Recent Assessment Scores</h3>
                                <div className="space-y-2">
                                    {assessments.slice(0, 8).map((assessment, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-amber-200 hover:shadow-md transition">
                                            <div>
                                                <p className="font-bold text-gray-900">{assessment.title || "Assessment"}</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {assessment.type || "Quiz"} • {assessment.subject || "General"} {assessment.date && `• ${new Date(assessment.date.toDate?.() || assessment.date).toLocaleDateString()}`}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="text-3xl font-bold text-amber-700">{Math.round(assessment.score || 0)}%</div>
                                                {assessment.correctAnswers && assessment.totalQuestions && (
                                                    <p className="text-xs text-gray-600 text-right">{assessment.correctAnswers}/{assessment.totalQuestions}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">⭐</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Subscription</h2>
                            </div>

                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                                <p className="text-gray-600 text-sm mb-2">Current Plan</p>
                                <p className="text-3xl font-bold text-amber-700 mb-4">{profileData?.subscriptionPlan || userData?.subscriptionPlan || "Free"}</p>
                                <button
                                    onClick={() => navigate("/subscription")}
                                    className="px-6 py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
                                >
                                    Upgrade Plan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions - Right Section */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">⚡</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate("/scheduler")}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <span>📅</span> Scheduler
                                </button>

                                <button
                                    onClick={() => navigate("/progress")}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <span>📊</span> View Progress
                                </button>

                                <button
                                    onClick={() => navigate("/analytics")}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <span>📈</span> Analytics
                                </button>

                                <button
                                    onClick={() => navigate("/subscription")}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <span>✨</span> Upgrade
                                </button>

                                <button
                                    onClick={() => navigate("/settings")}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <span>⚙️</span> Settings
                                </button>

                                <hr className="my-4" />

                                <button
                                    onClick={handleSignOut}
                                    className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <span>🚪</span> Sign Out
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-600 mb-2">Session Info:</p>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="text-xs font-mono text-gray-700 break-all">{user.uid.substring(0, 20)}...</p>
                                    <p className="text-xs text-gray-500 mt-1">✓ Verified Account</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}