import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getAcademicProgress, getUserAssessments, recordSubjectMarks } from "../utils/userDataApi";
import { getCachedData, setCachedData } from "../utils/cacheUtils";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
} from "recharts";

export default function Analytics() {
	const [examType, setExamType] = useState("ordinary");
	const [marksData, setMarksData] = useState({});
	const [customSubjects, setCustomsubjects] = useState([]);
	const [newSubject, setNewSubject] = useState("");
	const [isLoaded, setIsLoaded] = useState(false);
	const [generatedStudyPlan, setGeneratedStudyPlan] = useState(null);
	
	// Firestore data states
	const { user } = useAuth();
	const [academicProgress, setAcademicProgress] = useState(null);
	const [recentAssessments, setRecentAssessments] = useState([]);
	const [progressLoading, setProgressLoading] = useState(false);
	
	// Store all exam type data separately to prevent data loss on type switch
	const [allMarksDataByType, setAllMarksDataByType] = useState({
		ordinary: { marksData: {}, customSubjects: [] },
		scholarship: { marksData: {}, customSubjects: [] },
		advanced: { marksData: {}, customSubjects: [] },
	});

	// Track which marks have pending changes and last saved timestamps
	const [pendingMarks, setPendingMarks] = useState(new Set());
	const [lastSaved, setLastSaved] = useState({});
	const [isSaving, setIsSaving] = useState(false);

	const subjectConfig = {
		scholarship: [
			"English",
			"Sinhala",
			"Mathematics",
			"Environmental Studies",
			"Tamil",
			"Religion",
		],
		ordinary: [
			"Mathematics",
			"Science",
			"English",
			"Sinhala",
			"Religion",
			"History",
			"OP-1",
			"OP-2",
			"OP-3",
		],
		advanced: { streams: ["Maths", "Science", "Commerce", "Technology", "Arts"] },
	};

	const STORAGE_KEY = "studyPlannerMarks";

	// Helper to get exam-type specific storage key
	const getExamTypeKey = useCallback((type) => `${STORAGE_KEY}_${type}_${user?.uid}`, [user?.uid]);

	// Helper function to load marks from Firestore and reconstruct  
	const loadMarksFromFirestore = async (uid, type) => {
		try {
			const analysis = await getAcademicProgress(uid, type);
			const reconstructedMarks = {};
			const timestamps = {};

			// If we have subject scores, reconstruct marks
			if (analysis?.subjectScores && analysis.subjectScores.length > 0) {
				analysis.subjectScores.forEach((subject) => {
					if (subject.score > 0) {
						reconstructedMarks[subject.name] = {
							term1: Math.round(subject.score * 0.35) || subject.highest || subject.score,
							term2: Math.round(subject.score * 0.35) || 0,
							term3: Math.round(subject.score * 0.30) || 0,
						};
						timestamps[subject.name] = new Date().toLocaleString();
					}
				});
			}

			return { marks: reconstructedMarks, timestamps };
		} catch (error) {
			console.warn("Error loading marks from Firestore:", error);
			return { marks: {}, timestamps: {} };
		}
	};

	// Load marks from cache (localStorage with Firestore fallback) - EXAM TYPE SPECIFIC
	useEffect(() => {
		if (!user) {
			setIsLoaded(true);
			return;
		}

		const loadMarksFromCache = async () => {
			try {
				const loadedData = { ...allMarksDataByType };
				let hasData = false;

				// Try loading each exam type from localStorage first (faster)
				["ordinary", "scholarship", "advanced"].forEach((type) => {
					const key = getExamTypeKey(type);
					const stored = localStorage.getItem(key);
					if (stored) {
						try {
							const parsed = JSON.parse(stored);
							loadedData[type] = {
								marksData: parsed.marksData || {},
								customSubjects: parsed.customSubjects || [],
							};
							hasData = true;
						} catch (e) {
							console.warn(`Error parsing ${type} marks:`, e);
						}
					}
				});

				// Load real-time marks from Firestore for all exam types
				let ordinaryTimestamps = {};
				if (user) {
					try {
						for (const type of ["ordinary", "scholarship", "advanced"]) {
							const { marks: firestoreMarks, timestamps } = await loadMarksFromFirestore(user.uid, type);
							if (Object.keys(firestoreMarks).length > 0) {
								loadedData[type] = {
									marksData: firestoreMarks,
									customSubjects: loadedData[type].customSubjects,
								};
							}
							// Store timestamps for ordinary level (current display)
							if (type === "ordinary") {
								ordinaryTimestamps = timestamps;
							}
						}
					} catch (error) {
						console.warn("Error loading from Firestore:", error);
					}
				}

				setAllMarksDataByType(loadedData);
				
				// Load the ordinary level data by default
				const ordinaryData = loadedData.ordinary;
				setMarksData(ordinaryData.marksData || {});
				setCustomsubjects(ordinaryData.customSubjects || []);
				setLastSaved(ordinaryTimestamps);
				
				console.log("✅ All marks data loaded:", loadedData);
			} catch (error) {
				console.error("Error loading marks data:", error);
			}
			setIsLoaded(true);
		};

		loadMarksFromCache();
	}, [user]);

	// Load academic progress from Firestore - FILTER BY EXAM TYPE
	useEffect(() => {
		if (!user) return;

		const loadAcademicData = async () => {
			setProgressLoading(true);
			try {
				const progress = await getAcademicProgress(user.uid, examType);
				const assessments = await getUserAssessments(user.uid);
				
				setAcademicProgress(progress);
				setRecentAssessments(assessments);
			} catch (error) {
				console.error("Error loading academic progress:", error);
			} finally {
				setProgressLoading(false);
			}
		};

		loadAcademicData();
	}, [user, examType]);

	// Update cache when marks change (for current exam type) - EXAM TYPE SPECIFIC
	useEffect(() => {
		if (isLoaded && user) {
			// Save current exam type data to allMarksDataByType
			setAllMarksDataByType((prev) => ({
				...prev,
				[examType]: { marksData, customSubjects },
			}));

			// Save to localStorage with exam-type-specific key
			const key = getExamTypeKey(examType);
			localStorage.setItem(key, JSON.stringify({ marksData, customSubjects }));
			localStorage.setItem(`${key}_ts`, new Date().toISOString());
		}
	}, [marksData, customSubjects, examType, isLoaded, user, getExamTypeKey]);

	const handleExamTypeChange = (type) => {
		// Save current exam type marks before switching
		setAllMarksDataByType((prev) => ({
			...prev,
			[examType]: { marksData, customSubjects },
		}));

		// Switch to new exam type
		setExamType(type);
		
		// Load saved marks for this exam type
		const typeData = allMarksDataByType[type];
		setMarksData(typeData?.marksData || {});
		setCustomsubjects(typeData?.customSubjects || []);
		setGeneratedStudyPlan(null);
	};

	const getSubjects = () => {
		if (examType === "advanced") return customSubjects;
		return subjectConfig[examType] || [];
	};

	const handleMarksChange = (subject, term, value) => {
		const numValue = Math.max(0, Math.min(100, Number(value) || 0));
		setMarksData((prev) => ({
			...prev,
			[subject]: { ...prev[subject], [term]: numValue },
		}));
		
		// Mark this subject as having pending changes
		setPendingMarks((prev) => new Set([...prev, subject]));
	};

	// Auto-save marks to Firestore when user stops typing (debounced)
	const autoSaveMarks = useCallback(async () => {
		if (!user || pendingMarks.size === 0 || isSaving) return;

		setIsSaving(true);
		try {
			let savedCount = 0;
			
			for (const subject of Array.from(pendingMarks)) {
				if (marksData[subject]) {
					for (const term in marksData[subject]) {
						if (marksData[subject][term] > 0) {
							await recordSubjectMarks(user.uid, {
								subject,
								examType,
								term: term === "term1" ? "Term 1" : term === "term2" ? "Term 2" : "Term 3",
								score: marksData[subject][term],
							});
							savedCount++;
						}
					}
				}
			}

			if (savedCount > 0) {
				// Update saved timestamp
				const newTimestamps = { ...lastSaved };
				Array.from(pendingMarks).forEach((subject) => {
					newTimestamps[subject] = new Date().toLocaleString();
				});
				setLastSaved(newTimestamps);
				
				// Clear pending marks
				setPendingMarks(new Set());
				console.log(`✅ Auto-saved ${savedCount} marks`);
			}
		} catch (error) {
			console.error("Error auto-saving marks:", error);
		} finally {
			setIsSaving(false);
		}
	}, [user, marksData, pendingMarks, examType, lastSaved, isSaving]);

	// Auto-save debounce effect (save 2 seconds after user stops editing)
	useEffect(() => {
		const timer = setTimeout(() => {
			if (pendingMarks.size > 0) {
				autoSaveMarks();
			}
		}, 2000);

		return () => clearTimeout(timer);
	}, [pendingMarks, autoSaveMarks]);

	const addCustomSubject = () => {
		if (newSubject.trim() && !customSubjects.includes(newSubject)) {
			setCustomsubjects([...customSubjects, newSubject]);
			setNewSubject("");
		}
	};

	const removeCustomSubject = (subject) => {
		setCustomsubjects(customSubjects.filter((s) => s !== subject));
		const updated = { ...marksData };
		delete updated[subject];
		setMarksData(updated);
	};

	const saveMarksToFirestore = async () => {
		if (!user) {
			alert("Please sign in to save marks");
			return;
		}

		setIsSaving(true);
		try {
			let savedCount = 0;
			
			// Save marks for each subject and term with exam type
			for (const subject of getSubjects()) {
				if (marksData[subject]) {
					for (const term in marksData[subject]) {
						if (marksData[subject][term] > 0) {
							await recordSubjectMarks(user.uid, {
								subject,
								examType,
								term: term === "term1" ? "Term 1" : term === "term2" ? "Term 2" : "Term 3",
								score: marksData[subject][term],
							});
							savedCount++;
						}
					}
				}
			}

			if (savedCount > 0) {
				// Update allMarksDataByType with the saved data
				setAllMarksDataByType((prev) => ({
					...prev,
					[examType]: { marksData, customSubjects },
				}));

				// Save to localStorage with exam-type-specific key
				const key = getExamTypeKey(examType);
				localStorage.setItem(key, JSON.stringify({ marksData, customSubjects }));
				localStorage.setItem(`${key}_ts`, new Date().toISOString());
				
				// Update timestamps for all subjects
				const newTimestamps = { ...lastSaved };
				getSubjects().forEach((subject) => {
					if (marksData[subject]) {
						newTimestamps[subject] = new Date().toLocaleString();
					}
				});
				setLastSaved(newTimestamps);
				setPendingMarks(new Set());

				alert(`✅ Saved ${savedCount} marks to Firestore for ${examType.toUpperCase()}! Check Progress page to see your academic performance.`);
				// Reload academic progress for current exam type
				const progress = await getAcademicProgress(user.uid, examType);
				const assessments = await getUserAssessments(user.uid);
				setAcademicProgress(progress);
				setRecentAssessments(assessments);
			} else {
				alert("No marks to save. Please enter some scores first.");
			}
		} catch (error) {
			console.error("Error saving marks:", error);
			alert("Failed to save marks: " + error.message);
		} finally {
			setIsSaving(false);
		}
	};

	const calculateAverage = (subject) => {
		const marks = marksData[subject];
		if (!marks) return 0;
		const values = Object.values(marks).filter((v) => v > 0);
		return values.length > 0
			? (values.reduce((a, b) => a + b) / values.length).toFixed(1)
			: 0;
	};

	const calculateSubjectPerformance = () => {
		return getSubjects()
			.map((subject) => {
				const avg = calculateAverage(subject);
				const trend = avg >= 80 ? "↑" : avg >= 60 ? "→" : "↓";
				return { subject, score: avg, trend };
			})
			.sort((a, b) => b.score - a.score);
	};

	const generateStudyPlan = () => {
		const performance = calculateSubjectPerformance();
		const plan = performance.map((item) => {
			let hoursPerWeek = 0;
			let priority = "";
			let recommendation = "";

			if (item.score >= 80) {
				hoursPerWeek = 1.5;
				priority = "Low - Maintain";
				recommendation = "Focus on consolidation and advanced topics";
			} else if (item.score >= 60) {
				hoursPerWeek = 3;
				priority = "Medium - Improve";
				recommendation = "Review weak areas and practice more problems";
			} else if (item.score >= 40) {
				hoursPerWeek = 5;
				priority = "High - Critical";
				recommendation = "Intensive study with expert guidance needed";
			} else {
				hoursPerWeek = 7;
				priority = "Critical - Urgent";
				recommendation = "Consider tuition and study groups";
			}

			return {
				subject: item.subject,
				currentScore: item.score,
				priority,
				hoursPerWeek,
				recommendation,
			};
		});

		setGeneratedStudyPlan(plan);
	};

	const getChartData = () => {
		const subjects = getSubjects();
		return [
			{
				name: "Term 1",
				...subjects.reduce(
					(acc, s) => ({ ...acc, [s]: marksData[s]?.term1 || 0 }),
					{}
				),
			},
			{
				name: "Term 2",
				...subjects.reduce(
					(acc, s) => ({ ...acc, [s]: marksData[s]?.term2 || 0 }),
					{}
				),
			},
			{
				name: "Term 3",
				...subjects.reduce(
					(acc, s) => ({ ...acc, [s]: marksData[s]?.term3 || 0 }),
					{}
				),
			},
		];
	};

	const downloadStudyPlan = () => {
		if (!generatedStudyPlan) return;

		let content = "STUDY PLAN FOR NEXT TERM\n";
		content += "=".repeat(50) + "\n\n";
		content += `Generated on: ${new Date().toLocaleDateString()}\n`;
		content += `Examination Type: ${
			examType.charAt(0).toUpperCase() + examType.slice(1)
		}\n\n`;

		const totalHours = generatedStudyPlan
			.reduce((sum, item) => sum + item.hoursPerWeek, 0)
			.toFixed(1);
		content += `Total Weekly Study Hours: ${totalHours} hours\n`;
		content += "=".repeat(50) + "\n\n";

		generatedStudyPlan.forEach((plan, idx) => {
			content += `${idx + 1}. ${plan.subject}\n`;
			content += "-".repeat(40) + "\n";
			content += `   Current Score: ${plan.currentScore}%\n`;
			content += `   Priority: ${plan.priority}\n`;
			content += `   Recommended Hours/Week: ${plan.hoursPerWeek} hours\n`;
			content += `   Recommendation: ${plan.recommendation}\n\n`;
		});

		content += "=".repeat(50) + "\n";
		content += "TIPS FOR SUCCESS\n";
		content += "=".repeat(50) + "\n";
		content += "• Allocate more hours to subjects with lower scores\n";
		content += "• Take regular breaks during study sessions\n";
		content += "• Review weak concepts daily\n";
		content += "• Join study groups for subjects you struggle with\n";

		const element = document.createElement("a");
		const file = new Blob([content], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `Study_Plan_${new Date()
			.toISOString()
			.split("T")[0]}.txt`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	if (!isLoaded)
		return <div className="flex-1 py-16 text-center">Loading...</div>;

	const subjectPerformance = calculateSubjectPerformance();
	const chartData = getChartData();
	const subjects = getSubjects();
	const totalHours = generatedStudyPlan
		? generatedStudyPlan.reduce((sum, item) => sum + item.hoursPerWeek, 0).toFixed(1)
		: 0;

	return (
		<main className="flex-1">
			<section className="py-16 md:py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="mx-auto mb-16 max-w-3xl">
						<h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3">
							<span>📊</span>Analytics
						</h1>
						<p className="text-lg text-gray-600">
							Understand your learning patterns and optimize your study sessions.
						</p>
					</div>

					{/* Academic Progress from Firestore */}
					{user && academicProgress && (
						<div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 shadow-lg mb-12">
							<h2 className="text-2xl font-bold text-amber-900 mb-8">
								📈 Your Academic Performance
							</h2>
							
							{/* Overview Cards */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
								<div className="bg-white rounded-lg p-4 border border-amber-200">
									<div className="text-3xl font-bold text-amber-700 mb-1">
										{academicProgress.overallAverage}%
									</div>
									<p className="text-sm text-amber-900">Overall Average</p>
								</div>
								<div className="bg-white rounded-lg p-4 border border-amber-200">
									<div className="text-3xl font-bold text-amber-700 mb-1">
										{academicProgress.totalSubjects}
									</div>
									<p className="text-sm text-amber-900">Subjects</p>
								</div>
								<div className="bg-white rounded-lg p-4 border border-green-200">
									<div className="text-3xl font-bold text-green-700 mb-1">
										{academicProgress.improvingSubjects}
									</div>
									<p className="text-sm text-green-900">Improving ↑</p>
								</div>
								<div className="bg-white rounded-lg p-4 border border-red-200">
									<div className="text-3xl font-bold text-red-700 mb-1">
										{academicProgress.decreasingSubjects}
									</div>
									<p className="text-sm text-red-900">Declining ↓</p>
								</div>
							</div>

							{/* Subject Scores Chart */}
							{academicProgress.subjectScores.length > 0 && (
								<div className="bg-white rounded-lg p-6 mb-8">
									<h3 className="text-lg font-bold text-gray-900 mb-4">
										Subject-wise Performance
									</h3>
									<ResponsiveContainer width="100%" height={300}>
										<BarChart data={academicProgress.subjectScores}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis domain={[0, 100]} />
											<Tooltip />
											<Bar dataKey="score" fill="#b45309" />
										</BarChart>
									</ResponsiveContainer>
								</div>
							)}

							{/* Subject Details */}
							<div className="space-y-3">
								<h3 className="text-lg font-bold text-gray-900">Score Breakdown</h3>
								{academicProgress.subjectScores.length > 0 ? (
									academicProgress.subjectScores.map((subject) => (
										<div key={subject.name} className="bg-white rounded-lg p-4">
											<div className="flex items-center justify-between mb-2">
												<div className="flex-1">
													<h4 className="font-semibold text-gray-900">
														{subject.name}
													</h4>
													<p className="text-xs text-gray-600">
														High: {subject.highest}% | Low: {subject.lowest}%
													</p>
												</div>
												<div className="text-right">
													<div className="text-2xl font-bold text-amber-700">
														{subject.score}%
													</div>
													<div
														className={`text-lg font-bold ${
															subject.trend === "↑"
																? "text-green-600"
																: subject.trend === "↓"
																? "text-red-600"
																: "text-gray-600"
														}`}
													>
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
									))
								) : (
									<p className="text-gray-600 text-sm italic">
										No assessment data yet. Take quizzes to start tracking your progress.
									</p>
								)}
							</div>

							{/* Recent Assessments */}
							{recentAssessments && recentAssessments.length > 0 && (
								<div className="mt-8 bg-white rounded-lg p-6">
									<h3 className="text-lg font-bold text-gray-900 mb-4">
										Recent Assessments
									</h3>
									<div className="space-y-2">
										{recentAssessments.slice(0, 5).map((assessment, idx) => (
											<div
												key={idx}
												className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
											>
												<div>
													<p className="font-semibold text-gray-900">
														{assessment.title || "Quiz"}
													</p>
													<p className="text-xs text-gray-600">
														{assessment.type || "Assessment"}
													</p>
												</div>
												<div className="text-lg font-bold text-amber-700">
													{assessment.score}%
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{/* Sign-in prompt */}
					{!user && (
						<div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 shadow-lg mb-12">
							<p className="text-blue-900 text-center">
								Sign in to view your real-time academic progress and performance analytics.
							</p>
						</div>
					)}

					{/* Exam Type Selection */}
					<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg mb-12">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Select Your Examination Type
						</h2>
						<div className="flex gap-4 flex-wrap">
							{[
								{ id: "scholarship", label: "Scholarship Examination" },
								{ id: "ordinary", label: "Ordinary Level (O/L)" },
								{ id: "advanced", label: "Advanced Level (A/L)" },
							].map((exam) => (
								<button
									key={exam.id}
									onClick={() => handleExamTypeChange(exam.id)}
									className={`px-6 py-3 rounded-lg font-semibold transition-all ${
										examType === exam.id
											? "bg-amber-700 text-white shadow-lg"
											: "bg-gray-100 text-gray-900 hover:bg-gray-200"
									}`}
								>
									{exam.label}
								</button>
							))}
						</div>
					</div>

					{/* Advanced Level Stream Selection */}
					{examType === "advanced" && (
						<div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 shadow-lg mb-12">
							<h3 className="text-xl font-bold text-blue-900 mb-4">
								Add Your Subjects
							</h3>
							<div className="flex gap-2 mb-4">
								<input
									type="text"
									value={newSubject}
									onChange={(e) => setNewSubject(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && addCustomSubject()}
									placeholder="Enter subject name (e.g., Mathematics, Physics)"
									className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									onClick={addCustomSubject}
									className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
								>
									Add Subject
								</button>
							</div>
							<div className="flex flex-wrap gap-2">
								{customSubjects.map((subject) => (
									<div
										key={subject}
										className="bg-blue-100 px-4 py-2 rounded-lg flex items-center gap-2"
									>
										<span className="font-semibold text-blue-900">{subject}</span>
										<button
											onClick={() => removeCustomSubject(subject)}
											className="text-blue-600 hover:text-blue-900 font-bold"
										>
											×
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Marks Input Table */}
					{subjects.length > 0 && (
						<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg mb-12">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Enter Your Marks
							</h2>
							<div className="overflow-x-auto">
								<table className="w-full text-left">
									<thead>
										<tr className="border-b-2 border-gray-300 bg-gray-50">
											<th className="px-4 py-3 font-bold text-gray-900">
												Subject
											</th>
											<th className="px-4 py-3 font-bold text-gray-900 text-center">
												Term 1
											</th>
											<th className="px-4 py-3 font-bold text-gray-900 text-center">
												Term 2
											</th>
											<th className="px-4 py-3 font-bold text-gray-900 text-center">
												Term 3
											</th>
											<th className="px-4 py-3 font-bold text-gray-900 text-center">
												Average
											</th>
											<th className="px-4 py-3 font-bold text-gray-900 text-center">
												Save Status
											</th>
										</tr>
									</thead>
									<tbody>
										{subjects.map((subject) => (
											<tr
												key={subject}
												className="border-b border-gray-200 hover:bg-gray-50"
											>
												<td className="px-4 py-4 font-semibold text-gray-900">
													{subject}
												</td>
												{["term1", "term2", "term3"].map((term) => (
													<td key={term} className="px-4 py-4 text-center">
														<input
															type="number"
															min="0"
															max="100"
															value={marksData[subject]?.[term] || ""}
															onChange={(e) =>
																handleMarksChange(subject, term, e.target.value)
															}
															placeholder="0-100"
															className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
														/>
													</td>
												))}
												<td className="px-4 py-4 text-center font-bold text-amber-700">
													{calculateAverage(subject)}
												</td>
												<td className="px-4 py-4 text-center">
													{pendingMarks.has(subject) ? (
														<span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded inline-block">
															💾 Saving...
														</span>
													) : lastSaved[subject] ? (
														<div className="text-xs">
															<span className="font-semibold text-green-600">✅ Saved</span>
															<br />
															<span className="text-gray-500 text-xs">{lastSaved[subject]}</span>
														</div>
													) : (
														<span className="text-xs text-gray-400 italic">Not saved yet</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{subjects.length > 0 && Object.keys(marksData).length > 0 && (
								<div className="mt-6 flex gap-4 flex-wrap">
									<button
										onClick={saveMarksToFirestore}
										className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all font-semibold"
									>
										💾 Save Marks to Firestore
									</button>
									<button
										onClick={generateStudyPlan}
										className="px-8 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all font-semibold"
									>
										Generate Study Plan for Next Term
									</button>
								</div>
							)}
						</div>
					)}

					{/* Line Chart for Marks Trend */}
					{subjects.length > 0 && Object.keys(marksData).length > 0 && (
						<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg mb-12">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Marks Trend Analysis
							</h2>
							<ResponsiveContainer width="100%" height={400}>
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis domain={[0, 100]} />
									<Tooltip />
									<Legend />
									{subjects.slice(0, 5).map((subject, idx) => (
										<Line
											key={subject}
											type="monotone"
											dataKey={subject}
											stroke={[
												"#d97706",
												"#0891b2",
												"#06b6d4",
												"#8b5cf6",
												"#ec4899",
											][idx]}
											connectNulls
										/>
									))}
								</LineChart>
							</ResponsiveContainer>
						</div>
					)}

					{/* Subject Performance Analysis */}
					{subjects.length > 0 && Object.keys(marksData).length > 0 && (
						<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg mb-12">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Subject Performance Overview
							</h2>
							<div className="space-y-4">
								{subjectPerformance.map((item) => (
									<div key={item.subject}>
										<div className="flex items-center justify-between mb-2">
											<span className="font-semibold text-gray-900">
												{item.subject}
											</span>
											<div className="flex items-center gap-2">
												<span className="text-2xl font-bold text-amber-700">
													{item.score}%
												</span>
												<span
													className={`font-semibold ${
														item.score >= 80
															? "text-green-600"
															: item.score >= 60
															? "text-yellow-600"
															: "text-red-600"
													}`}
												>
													{item.trend}
												</span>
											</div>
										</div>
										<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-amber-700 transition-all"
												style={{ width: `${item.score}%` }}
											></div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Generated Study Plan for Next Term */}
					{generatedStudyPlan && (
						<div className="rounded-2xl border border-green-200 bg-green-50 p-8 shadow-lg mb-12">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-green-900">
									📚 Recommended Study Plan for Next Term
								</h2>
								<button
									onClick={downloadStudyPlan}
									className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all font-semibold flex items-center gap-2"
								>
									📥 Download Plan
								</button>
							</div>
							<div className="mb-6 p-4 bg-green-100 rounded-lg">
								<p className="text-green-900 font-semibold">
									Total Weekly Study Hours:{" "}
									<span className="text-2xl text-green-700">{totalHours} hours</span>
								</p>
							</div>
							<div className="space-y-4">
								{generatedStudyPlan.map((plan) => (
									<div
										key={plan.subject}
										className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all"
									>
										<div className="flex items-center justify-between mb-2">
											<h3 className="font-bold text-green-900 text-lg">
												{plan.subject}
											</h3>
											<span
												className={`px-3 py-1 rounded-full text-sm font-semibold ${
													plan.priority.includes("Low")
														? "bg-green-200 text-green-900"
														: plan.priority.includes("Medium")
														? "bg-yellow-200 text-yellow-900"
														: plan.priority.includes("High")
														? "bg-orange-200 text-orange-900"
														: "bg-red-200 text-red-900"
												}`}
											>
												{plan.priority}
											</span>
										</div>
										<p className="text-sm text-gray-600 mb-2">
											Current Score:{" "}
											<span className="font-bold text-amber-700">
												{plan.currentScore}%
											</span>
										</p>
										<p className="text-sm text-gray-700 mb-2">
											📖 Recommended Hours/Week:{" "}
											<span className="font-bold">{plan.hoursPerWeek}h</span>
										</p>
										<p className="text-sm text-green-800 italic">
											💡 {plan.recommendation}
										</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Insights & Recommendations */}
					<div className="grid gap-6 md:grid-cols-2">
						<div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
							<h3 className="text-lg font-bold text-amber-900 mb-3">
								💡 Your Insights
							</h3>
							<ul className="space-y-2 text-amber-900 text-sm">
								<li>
									• Enter your marks to get personalized insights
								</li>
								<li>• Generate a study plan based on your performance</li>
								<li>• Track your progress across all terms</li>
								<li>• Focus on improvement areas for better results</li>
							</ul>
						</div>

						<div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
							<h3 className="text-lg font-bold text-blue-900 mb-3">
								📊 Tips for Success
							</h3>
							<ul className="space-y-2 text-blue-900 text-sm">
								<li>• Allocate more hours to subjects with lower scores</li>
								<li>• Take regular breaks during study sessions</li>
								<li>• Review weak concepts daily</li>
								<li>• Join study groups for subjects you struggle with</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
