import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserRealTimeStats, getUserActiveCourses } from "../utils/userDataApi";
import FeatureCard from "../components/FeatureCard.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartBar from "../components/ChartBar.jsx";
import HeroImage from "../components/HeroImage.jsx";
import bgImage from "../assets/hero-study.png";

const featuresList = [
	{
		icon: "📅",
		title: "Smart Scheduler",
		desc: "AI-powered scheduling that learns your patterns and optimizes your study time.",
		path: "/scheduler",
		bgColor: "bg-amber-100",
		hoverBg: "group-hover:bg-amber-700",
	},
	{
		icon: "📚",
		title: "Resource Curator",
		desc: "Curated learning materials personalized to your learning goals.",
		path: "/resources",
		bgColor: "bg-orange-100",
		hoverBg: "group-hover:bg-orange-600",
	},
	{
		icon: "🎯",
		title: "Progress Tracker",
		desc: "Beautiful dashboards with real-time insights into your learning journey.",
		path: "/progress",
		bgColor: "bg-red-100",
		hoverBg: "group-hover:bg-red-600",
	},
	{
		icon: "🧠",
		title: "Quiz Generator",
		desc: "Adaptive assessment engine that adjusts difficulty based on your performance.",
		path: "/quizzes",
		bgColor: "bg-yellow-100",
		hoverBg: "group-hover:bg-yellow-600",
	},
	{
		icon: "👥",
		title: "Study Groups",
		desc: "Connect with peers, collaborate, and grow together in community.",
		path: "/groups",
		bgColor: "bg-purple-100",
		hoverBg: "group-hover:bg-purple-600",
	},
	{
		icon: "📊",
		title: "Advanced Analytics",
		desc: "Data-driven insights showing patterns and personalized recommendations.",
		path: "/analytics",
		bgColor: "bg-green-100",
		hoverBg: "group-hover:bg-green-600",
	},
];

const testimonials = [
	{
		name: "Yenuli Chethya",
		role: "College Student",
		text: "My GPA improved by 0.8 points in just one semester!",
		avatar: "👩‍🎓",
	},
	{
		name: "Savinu Hansana",
		role: "High School Senior",
		text: "I went from struggling to maintaining a 4.0 GPA.",
		avatar: "👨‍🎓",
	},
	{
		name: "Senula Sasen",
		role: "Medical Student",
		text: "Makes med school manageable and even enjoyable.",
		avatar: "👨‍⚕️",
	},
];

const stats = [
	{ label: "Active Students", value: "50K+", icon: "👥", color: "bg-blue-100" },
	{ label: "Study Hours", value: "2.5M+", icon: "⏱️", color: "bg-purple-100" },
	{ label: "Avg GPA", value: "0.6+", icon: "📈", color: "bg-green-100" },
	{ label: "Success Rate", value: "94%", icon: "✨", color: "bg-amber-100" },
];

const chartData = {
	week: [
		{ height: 45, label: "Mon", color: "bg-blue-500" },
		{ height: 72, label: "Tue", color: "bg-blue-600" },
		{ height: 60, label: "Wed", color: "bg-amber-600" },
		{ height: 85, label: "Thu", color: "bg-amber-700" },
		{ height: 50, label: "Fri", color: "bg-orange-500" },
		{ height: 90, label: "Sat", color: "bg-orange-600" },
		{ height: 65, label: "Sun", color: "bg-red-500" },
	],
	month: [
		{ height: 30, label: "1", color: "bg-blue-500" },
		{ height: 45, label: "5", color: "bg-blue-600" },
		{ height: 60, label: "10", color: "bg-amber-600" },
		{ height: 75, label: "15", color: "bg-amber-700" },
		{ height: 55, label: "20", color: "bg-orange-500" },
		{ height: 85, label: "25", color: "bg-orange-600" },
		{ height: 70, label: "30", color: "bg-red-500" },
	],
	semester: [
		{ height: 40, label: "Week 1", color: "bg-blue-500" },
		{ height: 58, label: "Week 4", color: "bg-blue-600" },
		{ height: 72, label: "Week 8", color: "bg-amber-600" },
		{ height: 88, label: "Week 12", color: "bg-amber-700" },
		{ height: 65, label: "Week 14", color: "bg-orange-500" },
		{ height: 92, label: "Week 16", color: "bg-orange-600" },
	],
};

export default function Home() {
	const [activeTab, setActiveTab] = useState("week");
	const navigate = useNavigate();
	const { user } = useAuth();
	const [userStats, setUserStats] = useState(null);
	const [displayStats, setDisplayStats] = useState(stats);

	// Load user real-time stats if signed in
	useEffect(() => {
		if (user) {
			const loadUserStats = async () => {
				try {
					const stats = await getUserRealTimeStats(user.uid);
					const activeCourses = await getUserActiveCourses(user.uid);
					
					setUserStats(stats);
					setDisplayStats([
						{ 
							label: "Study Hours (This Month)", 
							value: `${Math.round(stats.totalStudyHours)}h`, 
							icon: "⏱️", 
							color: "bg-purple-100" 
						},
						{ 
							label: "Active Courses", 
							value: activeCourses || "0", 
							icon: "📚", 
							color: "bg-blue-100" 
						},
						{ 
							label: "Current Streak", 
							value: `${stats.currentStreak} days`, 
							icon: "🔥", 
							color: "bg-orange-100" 
						},
						{ 
							label: "Avg Score", 
							value: `${Math.round(stats.averageScore)}%`, 
							icon: "⭐", 
							color: "bg-amber-100" 
						},
					]);
				} catch (error) {
					console.error("Error loading user stats:", error);
				}
			};
			loadUserStats();
		}
	}, [user]);

	const handleGetStarted = () => {
		navigate("/subscription");
	};

	const handleViewAnalytics = () => {
		navigate("/analytics");
	};

	return (
		<main className="overflow-hidden">
			<section className="relative overflow-hidden py-8 sm:py-16 md:py-28 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber-200 opacity-20 blur-3xl" />
					<div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-orange-200 opacity-20 blur-3xl" />
				</div>
				<div className="container mx-auto px-3 sm:px-4 relative z-10">
					<div className="grid items-center gap-6 sm:gap-8 md:gap-12 lg:grid-cols-2">
						<div className="space-y-4 sm:space-y-6 md:space-y-8 animate-slide-in-left">
							<div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-amber-200 bg-white px-3 sm:px-5 py-1.5 sm:py-2 shadow-sm text-xs sm:text-sm">
								<span className="text-lg sm:text-xl">✨</span>
								<span className="font-semibold text-amber-700">Future of Learning</span>
								<span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
								<span className="gradient-text">Study Smarter.</span>
								<br />
								<span>Achieve More.</span>
							</h1>
							<p className="text-base sm:text-xl text-gray-600 leading-relaxed max-w-lg">
								Revolutionize your learning with AI-powered scheduling and personalized resources.
							</p>
							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
								<button
									onClick={handleGetStarted}
									className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 text-center text-sm sm:text-base min-h-10 sm:min-h-12"
								>
									Get Started →
								</button>
								<a
									href="#features"
									className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-amber-700 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 text-center text-sm sm:text-base min-h-10 sm:min-h-12"
								>
									Learn More
								</a>
							</div>
						</div>
						<div className="relative animate-float order-1 md:order-2">
                        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl">
                            <img 
                                src={bgImage}
                                alt="./study workspace with books and laptop"
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    	</div>
					</div>
				</div>
			</section>

			<section className="py-8 sm:py-12 md:py-16 bg-white border-y border-gray-200">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
						{displayStats.map((stat) => (
							<StatCard key={stat.label} {...stat} />
						))}
					</div>
				</div>
			</section>

			<section id="features" className="py-12 sm:py-16 md:py-24 bg-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="mx-auto mb-8 sm:mb-12 md:mb-20 max-w-3xl text-center space-y-3 sm:space-y-4 md:space-y-6">
						<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
							<span className="text-amber-700 font-semibold">✨ FEATURES</span>
						</div>
						<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900">
							Everything You Need to Excel
						</h2>
						<p className="text-base sm:text-xl text-gray-600">
							Powerful tools designed by educators for learners.
						</p>
					</div>
					<div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
						{featuresList.map((feature, index) => (
							<a key={feature.title} href={feature.path}>
								<FeatureCard feature={feature} index={index} />
							</a>
						))}
					</div>
				</div>
			</section>

			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="mx-auto mb-8 sm:mb-12 md:mb-16 max-w-3xl text-center space-y-2 sm:space-y-4">
						<span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs sm:text-sm font-semibold">
							ANALYTICS
						</span>
						<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900">Your Dashboard</h2>
						<p className="text-base sm:text-xl text-gray-600">
							Beautiful analytics to track your progress.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-8 sm:mb-12">
						{["week", "month", "semester"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-sm sm:text-base min-h-10 ${
									activeTab === tab
										? "bg-amber-700 text-white shadow-lg"
										: "bg-white text-gray-600 border border-gray-200"
								}`}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						))}
					</div>
					<div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
						<div className="lg:col-span-2 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 md:p-8 shadow-lg">
							<h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8">
								{activeTab === "week" && "Weekly Progress"}
								{activeTab === "month" && "Monthly Progress"}
								{activeTab === "semester" && "Semester Progress"}
							</h3>
							<div className="flex items-end gap-2 sm:gap-4 md:gap-6 justify-around overflow-x-auto pb-2">
								{chartData[activeTab].map((bar) => (
									<ChartBar key={bar.label} {...bar} />
								))}
							</div>
						</div>
						<div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 md:p-8 shadow-lg space-y-4 sm:space-y-6">
							<h3 className="text-lg sm:text-2xl font-bold text-gray-900">
								{activeTab === "week" && "This Week"}
								{activeTab === "month" && "This Month"}
								{activeTab === "semester" && "This Semester"}
							</h3>
							<div className="space-y-3 sm:space-y-5">
								<div>
									<div className="flex justify-between mb-2 text-xs sm:text-base">
										<span className="text-gray-600">Study Time</span>
										<span className="text-lg sm:text-2xl font-bold text-amber-700">18h</span>
									</div>
									<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
										<div className="h-full w-4/5 bg-gradient-to-r from-amber-600 to-orange-500"></div>
									</div>
								</div>
								<div>
									<div className="flex justify-between mb-2 text-xs sm:text-base">
										<span className="text-gray-600">Tasks Done</span>
										<span className="text-lg sm:text-2xl font-bold text-amber-700">12/15</span>
									</div>
									<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
										<div className="h-full w-4/5 bg-gradient-to-r from-blue-600 to-blue-500"></div>
									</div>
								</div>
								<div>
									<div className="flex justify-between mb-2 text-xs sm:text-base">
										<span className="text-gray-600">Quiz Score</span>
										<span className="text-lg sm:text-2xl font-bold text-amber-700">94%</span>
									</div>
									<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
										<div className="h-full w-full bg-gradient-to-r from-green-600 to-green-500"></div>
									</div>
								</div>
							</div>
							<button
								onClick={handleViewAnalytics}
								className="w-full py-2 sm:py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm sm:text-base min-h-10"
							>
								View Analytics →
							</button>
						</div>
					</div>
				</div>
			</section>

			<section className="py-12 sm:py-16 md:py-24 bg-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="mx-auto mb-8 sm:mb-12 md:mb-16 max-w-3xl text-center space-y-2 sm:space-y-4">
						<span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs sm:text-sm font-semibold">
							TESTIMONIALS
						</span>
						<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900">Loved Worldwide</h2>
					</div>
					<div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
						{testimonials.map((testimonial, idx) => (
							<div
								key={idx}
								className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all"
							>
								<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
									<div className="text-4xl sm:text-5xl flex-shrink-0">{testimonial.avatar}</div>
									<div className="min-w-0 flex-1">
										<p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{testimonial.name}</p>
										<p className="text-xs sm:text-sm text-gray-600 truncate">{testimonial.role}</p>
									</div>
								</div>
								<p className="text-gray-600 text-sm sm:text-base">"{testimonial.text}"</p>
								<div className="mt-4 flex gap-1">
									{[1, 2, 3, 4, 5].map((s) => (
										<span key={s} className="text-lg sm:text-2xl">⭐</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-amber-700 via-orange-600 to-red-600 relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<svg className="w-full h-full">
						<defs>
							<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
								<path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
					</svg>
				</div>
				<div className="container mx-auto px-3 sm:px-4 relative z-10">
					<div className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-4 sm:space-y-6 md:space-y-8">
						<h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
							Ready to Transform Your Learning?
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
							Join 50K+ students who've discovered smart learning.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<button
								onClick={handleGetStarted}
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base min-h-10 sm:min-h-12"
							>
								Get Started
							</button>
							<a
								href="#features"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base min-h-10 sm:min-h-12 flex items-center justify-center"
							>
								Learn More
							</a>
						</div>
						<p className="text-white/80 text-xs sm:text-sm">14-day free trial • No card required</p>
					</div>
				</div>
			</section>
		</main>
	);
}
