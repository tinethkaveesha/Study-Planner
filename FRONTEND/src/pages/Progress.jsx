import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
	getUserProgress, 
	getUserStudySessions, 
	getUserRealTimeStats,
	getAcademicProgress,
	getSubjectMarkAnalysis,
	getUserAssessments
} from "../utils/userDataApi";
import { getCachedData } from "../utils/cacheUtils";
import { FiBarChart2, FiTarget, FiBook } from "react-icons/fi";
import { GiTrophyCup } from "react-icons/gi";

export default function Progress() {
	const { user } = useAuth();
	const [examType, setExamType] = useState("ordinary"); // Add exam type state
	const [progressData, setProgressData] = useState({
		totalHours: 0,
		currentStreak: 0,
		overallProgress: 0,
		weeklyData: [0, 0, 0, 0, 0, 0, 0],
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
		if (!user) return;

		const loadProgressData = async () => {
			try {
				console.log("Starting to load progress data for user:", user.uid, "exam type:", examType);
				
				// Load with cache for performance
				let stats, progress, sessions, academic, subjectMarks, assessmentScores;

				try {
					console.log("Loading real-time stats...");
					stats = await getCachedData(
						`user_stats_${user.uid}`,
						() => getUserRealTimeStats(user.uid),
						5 * 60 * 1000
					) || {
						totalStudyHours: 0,
						activeCourses: 0,
						currentStreak: 0,
						completedTasks: 0,
						averageScore: 0,
					};
					console.log("Stats loaded:", stats);
				} catch (statsError) {
					console.warn("Error loading stats, using defaults:", statsError);
					stats = {
						totalStudyHours: 0,
						activeCourses: 0,
						currentStreak: 0,
						completedTasks: 0,
						averageScore: 0,
					};
				}

				try {
					console.log("Loading user progress...");
					progress = await getCachedData(
						`user_progress_${user.uid}`,
						() => getUserProgress(user.uid),
						5 * 60 * 1000
					) || { averageScore: 0 };
					console.log("Progress loaded:", progress);
				} catch (progressError) {
					console.warn("Error loading progress, using defaults:", progressError);
					progress = { averageScore: 0 };
				}

				try {
					console.log("Loading study sessions...");
					sessions = await getCachedData(
						`study_sessions_${user.uid}`,
						() => getUserStudySessions(user.uid),
						5 * 60 * 1000
					) || [];
					console.log("Sessions loaded:", sessions.length);
				} catch (sessionsError) {
					console.warn("Error loading sessions, using empty array:", sessionsError);
					sessions = [];
				}

				try {
					console.log("Loading academic progress for exam type:", examType);
					academic = await getCachedData(
						`academic_progress_${user.uid}_${examType}`,
						() => getAcademicProgress(user.uid, examType),
						5 * 60 * 1000
					) || null;
					console.log("Academic progress loaded:", academic);
				} catch (academicError) {
					console.warn("Error loading academic progress:", academicError);
					academic = null;
				}

				try {
					console.log("Loading subject mark analysis for exam type:", examType);
					subjectMarks = await getCachedData(
						`subject_marks_${user.uid}_${examType}`,
						() => getSubjectMarkAnalysis(user.uid, examType),
						5 * 60 * 1000
					) || {};
					console.log("Subject marks loaded:", Object.keys(subjectMarks).length);
				} catch (marksError) {
					console.warn("Error loading subject marks:", marksError);
					subjectMarks = {};
				}

				try {
					console.log("Loading assessments...");
					assessmentScores = await getCachedData(
						`assessments_${user.uid}`,
						() => getUserAssessments(user.uid),
						5 * 60 * 1000
					) || [];
					console.log("Assessments loaded:", assessmentScores.length);
				} catch (
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					assessmentsError
				) {
					console.warn("Error loading assessments:", assessmentScores);
					assessmentScores = [];
				}

				// Calculate weekly data from sessions
				const today = new Date();
				const weeklyData = [0, 0, 0, 0, 0, 0, 0];
				
				if (sessions && Array.isArray(sessions)) {
					sessions.forEach((session) => {
						try {
							const sessionDate = new Date(session.startTime);
							const dayDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
							if (dayDiff >= 0 && dayDiff < 7) {
								const dayIndex = 6 - dayDiff; // Most recent is last
								weeklyData[dayIndex] += (session.duration || 0) / 60; // Convert minutes to hours
							}
						} catch (e) {
							console.warn("Error processing session:", session, e);
						}
					});
				}

				// Calculate achievements
				const achievements = [
					{
						title: "7-Day Streak",
						description: "Study for 7 consecutive days",
						completed: (stats?.currentStreak || 0) >= 7,
					},
					{
						title: "100 Hours",
						description: "Complete 100 hours of study",
						completed: (stats?.totalStudyHours || 0) >= 100,
					},
					{
						title: "Perfect Week",
						description: "Complete all daily goals in a week",
						completed: (stats?.totalStudyHours || 0) >= 14 && (stats?.currentStreak || 0) >= 7,
					},
					{
						title: "Course Explorer",
						description: "Access 5 different courses",
						completed: (stats?.activeCourses || 0) >= 5,
					},
					{
						title: "Excellent Scholar",
						description: "Achieve 80%+ average across all subjects",
						completed: academic?.overallAverage >= 80,
					},
					{
						title: "All-Rounder",
						description: "Maintain consistent performance (all subjects ≥ 70%)",
						completed: academic?.subjectScores?.length > 0 && academic?.subjectScores?.every((s) => s.score >= 70),
					},
				];

				setProgressData({
					totalHours: Math.round((stats?.totalStudyHours || 0) * 10) / 10,
					currentStreak: stats?.currentStreak || 0,
					overallProgress: Math.round(progress?.averageScore || academic?.overallAverage || 0),
					weeklyData,
					achievements,
					sessions: sessions.slice(0, 10) || [], // Last 10 sessions
					loading: false,
					error: null,
				});

				setAcademicProgress(academic);
				setSubjectAnalysis(subjectMarks || {});
				setAssessments(assessmentScores || []);
				
				console.log("Progress data loaded successfully");
			} catch (error) {
				console.error("❌ Error loading progress:", error);
				setProgressData((prev) => ({
					...prev,
					loading: false,
					error: `Failed to load progress data: ${error.message}`,
				}));
			}
		};

		loadProgressData();

		// Refresh data every 30 seconds
		const interval = setInterval(loadProgressData, 30000);
		return () => clearInterval(interval);
	}, [user, examType]);

	if (!user) {
		return (
			<main className="flex-1">
				<section className="py-16 md:py-24 bg-white">
					<div className="container mx-auto px-4 text-center">
						<p className="text-lg text-gray-600">Please sign in to view your progress.</p>
					</div>
				</section>
			</main>
		);
	}

	if (progressData.error) {
		return (
			<main className="flex-1">
				<section className="py-16 md:py-24 bg-white">
					<div className="container mx-auto px-4 text-center">
						<p className="text-lg text-red-600">{progressData.error}</p>
					</div>
				</section>
			</main>
		);
	}

	// Debug info
	const hasActivityData = progressData.totalHours > 0;
	const hasAcademicData = academicProgress && Object.keys(subjectAnalysis).length > 0;

	if (progressData.loading) {
		return (
			<main className="flex-1">
				<section className="py-16 md:py-24 bg-white">
					<div className="container mx-auto px-4 text-center">
						<p className="text-lg text-gray-600">Loading your progress data...</p>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="flex-1">
			<section className="py-16 md:py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="mx-auto mb-16 max-w-3xl">
						<h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3">
							<FiTarget className="text-amber-600" /> Progress Tracker
						</h1>
						<p className="text-lg text-gray-600">
							Monitor your learning journey and celebrate your achievements.
						</p>
					</div>

					{/* Exam Type Selector */}
					<div className="mx-auto mb-12 max-w-3xl">
						<label className="block text-sm font-semibold text-gray-700 mb-3">
							<FiBook className="inline mr-1 text-amber-700" /> Select Exam Type:
						</label>
						<div className="flex gap-3 flex-wrap">
							{["ordinary", "scholarship", "advanced"].map((type) => (
								<button
									key={type}
									onClick={() => setExamType(type)}
									className={`px-4 py-2 rounded-lg font-medium transition-colors ${
										examType === type
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-800 hover:bg-gray-300"
									}`}
								>
									{type === "ordinary"
										? "Ordinary Level (O/L)"
										: type === "scholarship"
										? "Scholarship"
										: "Advanced Level (A/L)"}
								</button>
							))}
						</div>
					</div>

					{/* Getting Started Guide */}
					{!hasActivityData && !hasAcademicData && (
						<div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 shadow-lg mb-12">
							<h2 className="text-xl font-bold text-blue-900 mb-4">Getting Started</h2>
							<p className="text-blue-900 mb-4">Your progress tracking is empty. Here's how to get started:</p>
							<div className="space-y-3 text-blue-900">
								<div className="flex gap-3">
									<span className="font-bold text-lg">1️⃣</span>
									<div>
										<p className="font-semibold">Track Study Time</p>
										<p className="text-sm text-blue-800">Just use the app normally! Your study hours are automatically tracked.</p>
									</div>
								</div>
								<div className="flex gap-3">
									<span className="font-bold text-lg">2️⃣</span>
									<div>
										<p className="font-semibold">Record Your Marks</p>
										<p className="text-sm text-blue-800">Go to <a href="/analytics" className="underline font-semibold">Analytics</a> page → Enter your Term 1, 2, 3 scores → Click "Save Marks to Firestore"</p>
									</div>
								</div>
								<div className="flex gap-3">
									<span className="font-bold text-lg">3️⃣</span>
									<div>
										<p className="font-semibold">See Your Progress</p>
										<p className="text-sm text-blue-800">Refresh this page to see your academic performance and achievements!</p>
									</div>
								</div>
							</div>
							<button
								onClick={() => window.location.href = '/analytics'}
								className="mt-6 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold"
							>
								Go to Analytics →
							</button>
						</div>
					)}

					<div className="grid gap-6 md:grid-cols-3 mb-12">
						<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
							<div className="text-4xl font-bold text-amber-700 mb-2">
								{progressData.totalHours}
							</div>
							<p className="text-gray-600">Total Hours Studied</p>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
							<div className="text-4xl font-bold text-amber-700 mb-2">
								{progressData.currentStreak}
							</div>
							<p className="text-gray-600">Current Streak (Days)</p>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
							<div className="text-4xl font-bold text-amber-700 mb-2">
								{progressData.overallProgress}%
							</div>
							<p className="text-gray-600">Overall Progress</p>
						</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg mb-12">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Progress</h2>
						<div className="flex gap-6 items-end">
							{progressData.weeklyData.map((height, i) => (
								<div key={i} className="flex flex-col items-center flex-1">
									<div className="w-full h-32 bg-gray-100 rounded-lg flex items-end justify-center mb-2">
										<div
											className="w-full rounded-lg bg-amber-700 transition-all hover:bg-amber-800"
											style={{ height: `${Math.min(height, 100)}%` }}
										></div>
									</div>
									<span className="text-xs text-gray-500">Day {i + 1}</span>
								</div>
							))}
						</div>
					</div>

					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
						<div className="grid gap-6 md:grid-cols-2">
							{progressData.achievements.map((achievement, idx) => (
								<div
									key={idx}
									className={`rounded-2xl border p-6 ${
										achievement.completed
											? "border-amber-200 bg-amber-50"
											: "border-gray-200 bg-white"
									}`}
								>
									<div className="flex items-start gap-4">
										<div className="text-3xl">
											{achievement.completed ? <GiTrophyCup className="text-amber-600" /> : <FiTarget className="text-amber-600" />}
										</div>
										<div>
											<h3 className="font-semibold text-gray-900">
												{achievement.title}
											</h3>
											<p className="text-gray-600 text-sm mt-1">
												{achievement.description}
											</p>
											{achievement.completed && (
												<p className="text-amber-700 text-sm font-semibold mt-2">
													✓ Completed
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Academic Performance Section */}
					{academicProgress && Object.keys(subjectAnalysis).length > 0 && (
						<div className="mt-16 pt-16 border-t border-gray-200">
							<h2 className="text-3xl font-bold text-gray-900 mb-8"><FiBarChart2 className="inline mr-2 text-amber-600" /> Academic Performance</h2>
							
							{/* Overview Cards */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
								<div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
									<div className="text-3xl font-bold text-amber-700">
										{academicProgress.overallAverage}%
									</div>
									<p className="text-sm text-amber-900 mt-2">Overall Average</p>
								</div>
								<div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
									<div className="text-3xl font-bold text-blue-700">
										{academicProgress.totalSubjects}
									</div>
									<p className="text-sm text-blue-900 mt-2">Subjects</p>
								</div>
								<div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
									<div className="text-3xl font-bold text-green-700">
										{academicProgress.improvingSubjects}
									</div>
									<p className="text-sm text-green-900 mt-2">Improving ↑</p>
								</div>
								<div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
									<div className="text-3xl font-bold text-red-700">
										{academicProgress.decreasingSubjects}
									</div>
									<p className="text-sm text-red-900 mt-2">Declining ↓</p>
								</div>
							</div>

							{/* Subject Performance */}
							<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg mb-12">
								<h3 className="text-xl font-bold text-gray-900 mb-6">Subject-wise Performance</h3>
								<div className="space-y-4">
									{academicProgress.subjectScores.map((subject) => (
										<div key={subject.name} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200">
											<div className="flex items-center justify-between mb-2">
												<div className="flex-1">
													<h4 className="font-bold text-gray-900">{subject.name}</h4>
													<p className="text-xs text-gray-600">
														High: {subject.highest}% | Low: {subject.lowest}%
													</p>
												</div>
												<div className="text-right">
													<div className="text-2xl font-bold text-amber-700">{subject.score}%</div>
													<div className={`text-lg font-bold ${
														subject.trend === "↑" ? "text-green-600" : 
														subject.trend === "↓" ? "text-red-600" : 
														"text-gray-600"
													}`}>
														{subject.trend}
													</div>
												</div>
											</div>
											<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-amber-700 transition-all"
													style={{ width: `${subject.score}%` }}
												></div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Recent Assessments */}
					{assessments && assessments.length > 0 && (
						<div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
							<h3 className="text-xl font-bold text-gray-900 mb-6">Recent Assessment Scores</h3>
							<div className="space-y-3">
								{assessments.slice(0, 8).map((assessment, idx) => (
									<div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
										<div>
											<p className="font-semibold text-gray-900">{assessment.title || "Quiz"}</p>
											<p className="text-xs text-gray-600">{assessment.type || "Assessment"} • {assessment.subject || "General"}</p>
										</div>
										<div className="text-right">
											<div className="text-2xl font-bold text-amber-700">{assessment.score}%</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
