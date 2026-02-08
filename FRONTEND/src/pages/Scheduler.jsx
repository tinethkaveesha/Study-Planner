import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getScheduledSessions, saveScheduledSession, deleteScheduledSession } from '../utils/userDataApi';
import { getCachedData, setCachedData } from '../utils/cacheUtils';

export default function Scheduler() {
	const { user } = useAuth();
	const [scheduledSessions, setScheduledSessions] = useState([]);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [showDayDetails, setShowDayDetails] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		subject: '',
		date: '',
		startTime: '',
		duration: '',
		priority: 'medium',
		notes: ''
	});

	// Helper function to get local date string (YYYY-MM-DD)
	const getLocalDateString = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	// Initialize from cache (localStorage with Firestore fallback)
	useEffect(() => {
		// Try localStorage first for quick load
		const localSessions = localStorage.getItem('scheduled_sessions');
		if (localSessions) {
			try {
				setScheduledSessions(JSON.parse(localSessions));
			} catch (e) {
				console.warn('Error loading from localStorage:', e);
			}
		}

		if (!user) {
			const todayStr = getLocalDateString(new Date());
			setFormData(prev => ({ ...prev, date: todayStr }));
			return;
		}

		const loadSessions = async () => {
			setIsLoading(true);
			try {
				const cachedSessions = await getCachedData(
					`scheduled_sessions_${user.uid}`,
					() => getScheduledSessions(user.uid),
					5 * 60 * 1000 // 5 minute cache TTL
				);
				setScheduledSessions(cachedSessions || []);
			} catch (error) {
				console.warn('Error loading scheduled sessions from Firestore:', error);
				// Keep whatever we have from localStorage
			} finally {
				setIsLoading(false);
			}
		};

		loadSessions();

		// Set today's date as default
		const todayStr = getLocalDateString(new Date());
		setFormData(prev => ({ ...prev, date: todayStr }));
	}, [user]);

	// Sync sessions to cache whenever they change
	useEffect(() => {
		// Save to localStorage
		if (scheduledSessions.length > 0) {
			localStorage.setItem('scheduled_sessions', JSON.stringify(scheduledSessions));
		}

		if (!user || scheduledSessions.length === 0) return;

		const syncToCache = async () => {
			try {
				await setCachedData(
					`scheduled_sessions_${user.uid}`,
					scheduledSessions,
					() => Promise.resolve() // Already saved via handleAddSession/handleDeleteSession
				);
			} catch (error) {
				console.warn('Error syncing sessions to cache:', error);
			}
		};

		syncToCache();
	}, [scheduledSessions, user]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleAddSession = async (e) => {
		e.preventDefault();
		if (!user) {
			alert('Please sign in to save sessions');
			return;
		}

		if (!formData.subject || !formData.date || !formData.startTime || !formData.duration) {
			alert('Please fill in all required fields');
			return;
		}

		try {
			const newSession = {
				id: Date.now().toString(),
				...formData,
				duration: parseFloat(formData.duration),
				completed: false
			};

			// Save to Firestore
			await saveScheduledSession(user.uid, newSession);

			const updatedSessions = [...scheduledSessions, newSession];
			setScheduledSessions(updatedSessions);

			// Update cache
			await setCachedData(
				`scheduled_sessions_${user.uid}`,
				updatedSessions,
				() => Promise.resolve()
			);

			setFormData({
				subject: '',
				date: getLocalDateString(new Date()),
				startTime: '',
				duration: '',
				priority: 'medium',
				notes: ''
			});

			alert('✅ Session scheduled successfully!');
		} catch (error) {
			console.error('Error adding session:', error);
			alert('Failed to schedule session: ' + error.message);
		}
	};

	const handleDeleteSession = async (id) => {
		if (!user) {
			alert('Please sign in to delete sessions');
			return;
		}

		try {
			// Delete from Firestore
			await deleteScheduledSession(user.uid, id);

			const updatedSessions = scheduledSessions.filter(s => s.id !== id);
			setScheduledSessions(updatedSessions);

			// Update cache
			await setCachedData(
				`scheduled_sessions_${user.uid}`,
				updatedSessions,
				() => Promise.resolve()
			);

			alert('✅ Session deleted successfully!');
		} catch (error) {
			console.error('Error deleting session:', error);
			alert('Failed to delete session: ' + error.message);
		}
	};

	const selectDate = (day) => {
		const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
		const dateStr = getLocalDateString(date);
		setSelectedDate(date);
		setFormData(prev => ({
			...prev,
			date: dateStr
		}));
		setShowDayDetails(true);
	};

	const previousMonth = () => {
		setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
	};

	const nextMonth = () => {
		setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
	};

	const renderCalendar = () => {
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		// Get today's date in local timezone
		const todayDate = new Date();
		const todayYear = todayDate.getFullYear();
		const todayMonth = todayDate.getMonth();
		const todayDay = todayDate.getDate();

		const days = [];
		for (let i = 0; i < firstDay; i++) days.push(null);
		for (let day = 1; day <= daysInMonth; day++) days.push(day);

		return days.map((day, idx) => {
			if (!day) return <div key={`empty-${idx}`}></div>;

			const isToday = year === todayYear && month === todayMonth && day === todayDay;
			const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
			const daySchedules = scheduledSessions.filter(s => s.date === dateStr);
			const hasSchedule = daySchedules.length > 0;

			return (
				<button
					key={day}
					onClick={() => selectDate(day)}
					className={`aspect-square flex items-center justify-center rounded-lg font-semibold transition-all cursor-pointer ${
						isToday
							? 'bg-amber-700 text-white ring-2 ring-amber-800'
							: hasSchedule
							? 'bg-amber-100 text-amber-900 border-2 border-amber-300 hover:bg-amber-200'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
					}`}
				>
					{day}
				</button>
			);
		});
	};

	const getTodaySchedule = () => {
		const todayStr = getLocalDateString(new Date());
		return scheduledSessions
			.filter(s => s.date === todayStr)
			.sort((a, b) => a.startTime.localeCompare(b.startTime));
	};

	const getUpcomingSchedule = () => {
		const today = getLocalDateString(new Date());

		return scheduledSessions
			.filter(s => s.date > today)
			.sort((a, b) => {
				const dateCompare = a.date.localeCompare(b.date);
				if (dateCompare !== 0) return dateCompare;
				return a.startTime.localeCompare(b.startTime);
			})
			.slice(0, 5);
	};

	const priorityConfig = {
		low: { emoji: '🟢', label: 'Low', bgColor: 'bg-green-100', textColor: 'text-green-700' },
		medium: { emoji: '🟡', label: 'Medium', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
		high: { emoji: '🔴', label: 'High', bgColor: 'bg-red-100', textColor: 'text-red-700' }
	};

	const monthName = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
	const todaySchedule = getTodaySchedule();
	const upcomingSchedule = getUpcomingSchedule();

	const calculateEndTime = (startTime, duration) => {
		const [hours, minutes] = startTime.split(':').map(Number);
		const totalMinutes = hours * 60 + minutes + (duration * 60);
		const endHours = Math.floor(totalMinutes / 60) % 24;
		const endMinutes = totalMinutes % 60;
		return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
	};

	const getDaySchedule = (date) => {
		const dateStr = getLocalDateString(date);
		return scheduledSessions
			.filter(s => s.date === dateStr)
			.sort((a, b) => a.startTime.localeCompare(b.startTime));
	};

	const isToday = selectedDate.toDateString() === new Date().toDateString();
	const daySchedules = getDaySchedule(selectedDate);
	const totalDuration = daySchedules.reduce((sum, s) => sum + s.duration, 0);
	const highPriorityCount = daySchedules.filter(s => s.priority === 'high').length;

	return (
		<main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
			<section className="py-16 md:py-24">
				<div className="container mx-auto px-4">
					{/* Page Header */}
					<div className="mx-auto mb-16 max-w-3xl">
						<h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3">
							<span>📅</span> Smart Scheduler
						</h1>
						<p className="text-lg text-gray-600">
							Plan your study sessions intelligently with AI-powered scheduling
						</p>
					</div>

					<div className="grid gap-8 lg:grid-cols-3">
						{/* Calendar Section */}
						<div className="lg:col-span-1 space-y-6">
							<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
								<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
									<span>📆</span> Calendar
								</h2>

								{/* Month Navigation */}
								<div className="flex items-center justify-between mb-6">
									<button
										onClick={previousMonth}
										className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
									>
										←
									</button>
									<h3 className="font-semibold text-center text-gray-900">{monthName}</h3>
									<button
										onClick={nextMonth}
										className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
									>
										→
									</button>
								</div>

								{/* Day Headers */}
								<div className="grid grid-cols-7 gap-2 mb-2">
									{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
										<div key={d} className="text-center text-xs font-semibold text-gray-600">
											{d}
										</div>
									))}
								</div>

								{/* Calendar Grid */}
								<div className="grid grid-cols-7 gap-2">
									{renderCalendar()}
								</div>
							</div>
						</div>

						{/* Schedule Details */}
						<div className="lg:col-span-2 space-y-6">
							{/* Add Session Form */}
							<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow">
								<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
									<span>➕</span> Schedule Study Session
								</h2>

								<form onSubmit={handleAddSession} className="space-y-4">
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Subject <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												name="subject"
												value={formData.subject}
												onChange={handleInputChange}
												placeholder="e.g., Mathematics"
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Date <span className="text-red-500">*</span>
											</label>
											<input
												type="date"
												name="date"
												value={formData.date}
												onChange={handleInputChange}
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all"
											/>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Start Time <span className="text-red-500">*</span>
											</label>
											<input
												type="time"
												name="startTime"
												value={formData.startTime}
												onChange={handleInputChange}
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all"
											/>
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Duration (hours) <span className="text-red-500">*</span>
											</label>
											<input
												type="number"
												name="duration"
												value={formData.duration}
												onChange={handleInputChange}
												min="0.5"
												step="0.5"
												placeholder="2"
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Priority Level
										</label>
										<select
											name="priority"
											value={formData.priority}
											onChange={handleInputChange}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
										>
											<option value="low">🟢 Low</option>
											<option value="medium">🟡 Medium</option>
											<option value="high">🔴 High</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Notes
										</label>
										<textarea
											name="notes"
											value={formData.notes}
											onChange={handleInputChange}
											placeholder="Add notes for this session..."
											rows="3"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all resize-none"
										></textarea>
									</div>

									<button
										type="submit"
										className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
									>
										📝 Add to Schedule
									</button>
								</form>
							</div>

							{/* Today's Schedule */}
							<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow">
								<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
									<span>🕐</span> Today's Sessions
								</h2>
								<div className="space-y-3">
									{todaySchedule.length === 0 ? (
										<p className="text-gray-600 text-center py-8">No sessions scheduled for today</p>
									) : (
										todaySchedule.map(session => {
											const config = priorityConfig[session.priority];
											const endTime = calculateEndTime(session.startTime, session.duration);
											return (
												<div
													key={session.id}
													className="flex items-start justify-between p-4 rounded-lg border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-transparent hover:shadow-md transition-all"
												>
													<div className="flex-1">
														<h4 className="font-semibold text-gray-900">{session.subject}</h4>
														<p className="text-sm text-gray-600">
															🕐 {session.startTime} - {endTime} • ⏱️ {session.duration}h
														</p>
														{session.notes && (
															<p className="text-sm text-gray-600 mt-2">{session.notes}</p>
														)}
													</div>
													<div className="flex items-center gap-3">
														<span className={`px-3 py-1 rounded-lg font-semibold text-sm ${config.bgColor} ${config.textColor}`}>
															{config.emoji}
														</span>
														<button
															onClick={() => handleDeleteSession(session.id)}
															className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
														>
															🗑️
														</button>
													</div>
												</div>
											);
										})
									)}
								</div>
							</div>

							{/* Upcoming Schedule */}
							<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow">
								<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
									<span>📋</span> Upcoming Sessions
								</h2>
								<div className="space-y-3">
									{upcomingSchedule.length === 0 ? (
										<p className="text-gray-600 text-center py-8">No upcoming sessions</p>
									) : (
										upcomingSchedule.map(session => {
											const [year, month, day] = session.date.split('-');
											const dateObj = new Date(year, month - 1, day);
											const dateStr = dateObj.toLocaleDateString('default', {
												weekday: 'short',
												month: 'short',
												day: 'numeric'
											});
											const config = priorityConfig[session.priority];

											return (
												<div
													key={session.id}
													className="flex items-start justify-between p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all"
												>
													<div className="flex-1">
														<h4 className="font-semibold text-gray-900">{session.subject}</h4>
														<p className="text-sm text-gray-600">
															📅 {dateStr} at {session.startTime}
														</p>
													</div>
													<span className={`px-3 py-1 rounded-lg font-semibold text-sm ${config.bgColor} ${config.textColor}`}>
														{config.emoji}
													</span>
												</div>
											);
										})
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Day Details Modal */}
			{showDayDetails && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-start mb-6">
							<div>
								<h2 className="text-3xl font-bold text-gray-900">
									{isToday ? "Today's Schedule" : "Schedule Details"}
								</h2>
								<p className="text-gray-600 mt-2">
									{selectedDate.toLocaleDateString('default', {
										weekday: 'long',
										month: 'long',
										day: 'numeric',
										year: 'numeric'
									})}
									{isToday && ' (Today)'}
								</p>
							</div>
							<button
								onClick={() => setShowDayDetails(false)}
								className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
							>
								✕
							</button>
						</div>

						{daySchedules.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-600 text-lg">No sessions scheduled for this day</p>
								<p className="text-gray-500 text-sm mt-2">Click "Add to Schedule" to create a new session</p>
							</div>
						) : (
							<>
								{/* Stats */}
								<div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
									<div className="text-center">
										<p className="text-2xl font-bold text-amber-700">{daySchedules.length}</p>
										<p className="text-xs text-gray-600 mt-1">Sessions</p>
									</div>
									<div className="text-center">
										<p className="text-2xl font-bold text-amber-700">{totalDuration}h</p>
										<p className="text-xs text-gray-600 mt-1">Total Duration</p>
									</div>
									<div className="text-center">
										<p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
										<p className="text-xs text-gray-600 mt-1">High Priority</p>
									</div>
								</div>

								{/* Sessions List */}
								<div className="space-y-4 mb-6">
									{daySchedules.map(session => {
										const config = priorityConfig[session.priority];
										const endTime = calculateEndTime(session.startTime, session.duration);

										return (
											<div
												key={session.id}
												className={`border-2 ${
													session.priority === 'low'
														? 'border-green-300 bg-green-100'
														: session.priority === 'medium'
														? 'border-yellow-300 bg-yellow-100'
														: 'border-red-300 bg-red-100'
												} rounded-lg p-5`}
											>
												<div className="flex justify-between items-start mb-3">
													<div>
														<h3 className="text-lg font-bold text-gray-900">{session.subject}</h3>
														<p className="text-sm text-gray-700 mt-1">
															🕐 {session.startTime} - {endTime} ({session.duration}h)
														</p>
													</div>
													<span className={`px-3 py-1 rounded-full font-semibold text-sm ${config.textColor}`}>
														{config.emoji} {config.label}
													</span>
												</div>
												{session.notes && (
													<div className="mt-3 p-3 bg-white rounded border-l-4 border-gray-300">
														<p className="text-sm text-gray-700">
															<strong>Notes:</strong> {session.notes}
														</p>
													</div>
												)}
												<button
													onClick={() => {
														handleDeleteSession(session.id);
														setShowDayDetails(false);
													}}
													className="mt-3 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition-all"
												>
													🗑️ Delete
												</button>
											</div>
										);
									})}
								</div>
							</>
						)}

						<button
							onClick={() => setShowDayDetails(false)}
							className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</main>
	);
}
