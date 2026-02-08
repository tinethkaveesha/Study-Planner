import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getJoinedGroups, createStudyGroup, joinStudyGroup, leaveStudyGroup, deleteStudyGroup } from "../utils/userDataApi";
import { getCachedData, setCachedData } from "../utils/cacheUtils";

export default function Groups() {
	const { user } = useAuth();
	const [groups, setGroups] = useState([
		{
			id: 1,
			name: "Math Wizards",
			subject: "Mathematics",
			members: 12,
			nextSession: "2026-02-05 3:00 PM",
			icon: "🧮",
			description: "A dedicated group for mastering advanced mathematics concepts and solving complex problems together.",
			createdBy: "John Doe",
			memberList: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack", "Kate", "Leo"],
		},
		{
			id: 2,
			name: "Physics Explorers",
			subject: "Physics",
			members: 8,
			nextSession: "2026-02-06 4:00 PM",
			icon: "⚡",
			description: "Explore the fundamental principles of physics through experiments, discussions, and collaborative learning.",
			createdBy: "Sarah Smith",
			memberList: ["Mike", "Nancy", "Oscar", "Paula", "Quinn", "Robert", "Susan", "Tom"],
		},
		{
			id: 3,
			name: "Chemistry Lab",
			subject: "Chemistry",
			members: 15,
			nextSession: "2026-02-07 5:00 PM",
			icon: "⚗️",
			description: "Virtual chemistry lab where students conduct experiments, share findings, and discuss chemical reactions.",
			createdBy: "Emily Johnson",
			memberList: ["Alex", "Bella", "Chris", "Daisy", "Ethan", "Fiona", "George", "Hannah", "Isaac", "Julia", "Kevin", "Lisa", "Mark", "Nina", "Oliver"],
		},
		{
			id: 4,
			name: "Literature Club",
			subject: "English",
			members: 10,
			nextSession: "2026-02-08 2:00 PM",
			icon: "📚",
			description: "Discuss classic and contemporary literature, share book reviews, and explore different writing styles.",
			createdBy: "Michael Brown",
			memberList: ["Patricia", "Quincy", "Rachel", "Samuel", "Tina", "Victor", "Wendy", "Xavier", "Yara", "Zoe"],
		},
	]);
	const [newGroup, setNewGroup] = useState({ name: "", subject: "Mathematics", description: "" });
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [joinedGroups, setJoinedGroups] = useState([]);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Load joined groups from Firestore + cache on mount
	useEffect(() => {
		// Also try to load from localStorage for backward compatibility
		const savedJoinedGroups = localStorage.getItem("joinedStudyGroups");
		if (savedJoinedGroups) {
			try {
				// normalize to strings to avoid type issues later
				const parsed = JSON.parse(savedJoinedGroups || "[]");
				setJoinedGroups(Array.isArray(parsed) ? parsed.map(String) : []);
			} catch (e) {
				console.warn("Error loading joined groups from localStorage:", e);
			}
		}

		if (!user) return;

		const loadGroups = async () => {
			setIsLoading(true);
			try {
				const cachedGroups = await getCachedData(
					`joined_groups_${user.uid}`,
					() => getJoinedGroups(user.uid),
					5 * 60 * 1000 // 5 minute cache TTL
				);
				// normalize ids to strings
				const groupIds = (cachedGroups?.map(g => String(g.id ?? g.groupId)) ) || [];
				setJoinedGroups(groupIds);
				
				// Also merge with existing groups
				if (cachedGroups && cachedGroups.length > 0) {
					setGroups(prev => [
						...prev,
						...cachedGroups.filter(g => !prev.find(pg => String(pg.id) === String(g.id ?? g.groupId) || String(pg.groupId) === String(g.id ?? g.groupId)))
					]);
				}
			} catch (error) {
				console.warn('Error loading study groups from Firestore:', error);
				// Keep using default groups
			} finally {
				setIsLoading(false);
			}
		};

		loadGroups();
	}, [user]);

	// Save joined groups to localStorage
	useEffect(() => {
		localStorage.setItem("joinedStudyGroups", JSON.stringify(joinedGroups));
	}, [joinedGroups]);

	const handleCreateGroup = async (e) => {
		e.preventDefault();
		
		if (!user) {
			alert("Please sign in to create a group");
			return;
		}

		if (!newGroup.name.trim() || !newGroup.description.trim()) {
			alert("Please fill in all fields");
			return;
		}

		try {
			const groupId = await createStudyGroup(user.uid, {
				name: newGroup.name,
				subject: newGroup.subject,
				description: newGroup.description,
				maxMembers: 30,
			});

			const gid = String(groupId);
			const createdGroup = {
				id: gid,
				groupId: gid,
				name: newGroup.name,
				subject: newGroup.subject,
				description: newGroup.description,
				icon: ["🧮", "⚡", "⚗️", "📚"][["Mathematics", "Physics", "Chemistry", "English"].indexOf(newGroup.subject)] || "📚",
				members: 1,
				nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString(),
				createdBy: user?.displayName || "Unknown",
				memberList: [user?.displayName || "You"],
				role: "owner",
				joinedAt: new Date().toISOString(),
			};

			const updatedGroups = [...groups, createdGroup];
			setGroups(updatedGroups);
			setJoinedGroups([...joinedGroups, gid]);

			// Update cache
			await setCachedData(
				`joined_groups_${user.uid}`,
				updatedGroups,
				() => Promise.resolve()
			);

			setNewGroup({ name: "", subject: "Mathematics", description: "" });
			setShowCreateForm(false);
			alert("✅ Group created successfully!");
		} catch (error) {
			console.error("Error creating group:", error);

			// Fallback: if permission error, create a local pending group and persist locally
			const msg = (error && (error.message || "")).toString().toLowerCase();
			if (msg.includes("permission") || msg.includes("insufficient")) {
				const localId = `local-${Date.now()}`;
				const createdGroup = {
					id: localId,
					groupId: localId,
					name: newGroup.name,
					subject: newGroup.subject,
					description: newGroup.description,
					icon: ["🧮", "⚡", "⚗️", "📚"][["Mathematics", "Physics", "Chemistry", "English"].indexOf(newGroup.subject)] || "📚",
					members: 1,
					nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString(),
					createdBy: user?.displayName || "Unknown",
					memberList: [user?.displayName || "You"],
					role: "owner",
					joinedAt: new Date().toISOString(),
					pendingSync: true,
				};

				const updatedGroups = [...groups, createdGroup];
				setGroups(updatedGroups);
				setJoinedGroups([...joinedGroups, localId]);

				// persist pending creations for later sync
				try {
					const pending = JSON.parse(localStorage.getItem("pendingStudyGroups") || "[]");
					pending.push(createdGroup);
					localStorage.setItem("pendingStudyGroups", JSON.stringify(pending));

					// update cached joined groups so UI stays consistent
					await setCachedData(
						`joined_groups_${user.uid}`,
						updatedGroups,
						() => Promise.resolve()
					);
				} catch (e) {
					console.warn("Error saving pending group locally:", e);
				}

				setNewGroup({ name: "", subject: "Mathematics", description: "" });
				setShowCreateForm(false);
				alert("✅ Group created locally (pending sync). It will be synced when permissions are available.");
				return;
			}

			alert("Failed to create group: " + (error?.message || error));
		}
	};

	const handleJoinGroup = async (groupId) => {
		if (!user) {
			alert("Please sign in to join a group");
			return;
		}

		const gid = String(groupId);
		if (joinedGroups.includes(gid)) {
			alert("You have already joined this group!");
			return;
		}

		// If this is a local pending group, just update locally (no remote call)
		if (gid.startsWith("local-")) {
			try {
				const updatedJoinedGroups = [...joinedGroups, gid];
				setJoinedGroups(updatedJoinedGroups);

				const updatedGroups = groups.map((group) =>
					String(group.id) === gid || String(group.groupId) === gid
						? {
							...group,
							members: (group.members || 0) + 1,
							memberList: [...(group.memberList || []), user?.displayName || "New Member"],
						}
						: group
				);
				setGroups(updatedGroups);

				await setCachedData(
					`joined_groups_${user.uid}`,
					updatedGroups,
					() => Promise.resolve()
				);

				alert("✅ Joined local (pending) group successfully!");
			} catch (error) {
				console.error("Error joining local group:", error);
				alert("Failed to join local group: " + (error?.message || String(error)));
			}
			return;
		}

		try {
			await joinStudyGroup(user.uid, groupId);

			const updatedJoinedGroups = [...joinedGroups, gid];
			setJoinedGroups(updatedJoinedGroups);

			const updatedGroups = groups.map((group) =>
				String(group.id) === gid || String(group.groupId) === gid
					? {
						...group,
						members: (group.members || 0) + 1,
						memberList: [...(group.memberList || []), user?.displayName || "New Member"],
					}
					: group
			);
			setGroups(updatedGroups);

			// Update cache
			await setCachedData(
				`joined_groups_${user.uid}`,
				updatedGroups,
				() => Promise.resolve()
			);

			alert("✅ Joined group successfully!");
		} catch (error) {
			console.error("Error joining group:", error);
			const msg = error?.message || String(error);
			alert("Failed to join group: " + msg);
		}
	};

	return (
		<main className="flex-1">
			<section className="py-16 md:py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="mx-auto mb-16 max-w-3xl">
						<h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3">
							<span>👥</span>Study Groups
						</h1>
						<p className="text-lg text-gray-600">
							Connect with fellow students, share notes, and study together.
						</p>
					</div>

					{/* Create Group Section */}
					{!showCreateForm ? (
						<button
							onClick={() => setShowCreateForm(true)}
							className="mb-12 px-8 py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
						>
							+ Create New Group
						</button>
					) : (
						<div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-lg mb-12">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
								<button
									onClick={() => setShowCreateForm(false)}
									className="text-gray-500 hover:text-gray-700 text-2xl"
								>
									✕
								</button>
							</div>
							<form onSubmit={handleCreateGroup} className="grid gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Group Name *
									</label>
									<input
										type="text"
										placeholder="e.g., Advanced Calculus Study Circle"
										value={newGroup.name}
										onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
										className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
									/>
								</div>
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Subject *
										</label>
										<select
											value={newGroup.subject}
											onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
											className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
										>
											<option>Mathematics</option>
											<option>Physics</option>
											<option>Chemistry</option>
											<option>English</option>
										</select>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Description *
									</label>
									<textarea
										placeholder="Describe what this group is about..."
										value={newGroup.description}
										onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
										rows="4"
										className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent resize-none"
									/>
								</div>
								<div className="flex gap-3 pt-4">
									<button
										type="submit"
										className="flex-1 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
									>
										Create Group
									</button>
									<button
										type="button"
										onClick={() => setShowCreateForm(false)}
										className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					)}

					{/* Groups List */}
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						{joinedGroups.length > 0 && `(${joinedGroups.length} Joined) `}Available Groups
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{groups.map((group) => (
							<div
								key={group.id}
								className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
							>
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center gap-3">
										<span className="text-4xl">{group.icon}</span>
										<div>
											<h3 className="text-lg font-semibold text-gray-900">
												{group.name}
											</h3>
											<p className="text-amber-700 text-sm font-medium">{group.subject}</p>
										</div>
									</div>
									{group.pendingSync ? (
										<span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
											Pending
										</span>
									) : (
										joinedGroups.includes(String(group.id)) && (
											<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
												Joined
											</span>
										)
									)}
								</div>

								<div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
									<p className="text-gray-600 text-sm line-clamp-2">{group.description}</p>
									<p className="text-gray-600 text-sm">👥 {group.members} members</p>
									<p className="text-gray-600 text-sm">
										📅 {new Date(group.nextSession).toLocaleDateString()}
									</p>
								</div>

								<div className="space-y-2">
									{!joinedGroups.includes(String(group.id)) ? (
										<button
											onClick={() => handleJoinGroup(group.id)}
											className="w-full py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
										>
											Join Group
										</button>
									) : (
										<button
											disabled
											className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg opacity-70 cursor-not-allowed"
										>
											✓ Joined
										</button>
									)}
									<button
										onClick={() => setSelectedGroup(group)}
										className="w-full py-2 border border-amber-700 text-amber-700 font-semibold rounded-lg hover:bg-amber-50 transition-all"
									>
										View Details
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Group Details Modal */}
			{selectedGroup && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="bg-gradient-to-r from-amber-700 to-orange-600 p-6 flex justify-between items-start">
							<div className="flex items-center gap-4">
								<span className="text-5xl">{selectedGroup.icon}</span>
								<div>
									<h2 className="text-3xl font-bold text-white">{selectedGroup.name}</h2>
									<p className="text-amber-100">{selectedGroup.subject}</p>
								</div>
							</div>
							<button
								onClick={() => setSelectedGroup(null)}
								className="text-white text-2xl hover:bg-white/20 p-1 rounded"
							>
								✕
							</button>
						</div>

						<div className="p-8 space-y-6">
							<div>
								<h3 className="text-lg font-bold text-gray-900 mb-2">About This Group</h3>
								<p className="text-gray-600 leading-relaxed">{selectedGroup.description}</p>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-amber-50 rounded-xl p-4">
									<p className="text-gray-600 text-sm mb-1">Created By</p>
									<p className="text-lg font-semibold text-gray-900">{selectedGroup.createdBy}</p>
								</div>
								<div className="bg-orange-50 rounded-xl p-4">
									<p className="text-gray-600 text-sm mb-1">Total Members</p>
									<p className="text-lg font-semibold text-gray-900">{selectedGroup.members}</p>
								</div>
								<div className="bg-red-50 rounded-xl p-4">
									<p className="text-gray-600 text-sm mb-1">Next Session</p>
									<p className="text-lg font-semibold text-gray-900">{new Date(selectedGroup.nextSession).toLocaleDateString()}</p>
								</div>
								<div className="bg-pink-50 rounded-xl p-4">
									<p className="text-gray-600 text-sm mb-1">Session Time</p>
									<p className="text-lg font-semibold text-gray-900">{new Date(selectedGroup.nextSession).toLocaleTimeString()}</p>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-bold text-gray-900 mb-4">Members ({selectedGroup.memberList.length})</h3>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
									{selectedGroup.memberList.map((member, idx) => (
										<div
											key={idx}
											className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-3 text-center hover:shadow-md transition-all"
										>
											<div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 mx-auto mb-2 flex items-center justify-center text-white font-bold">
												{member[0]?.toUpperCase()}
											</div>
											<p className="text-sm font-medium text-gray-900 truncate">{member}</p>
										</div>
									))}
								</div>
							</div>

							<div className="flex gap-3 pt-6 border-t border-gray-200">
								{!joinedGroups.includes(String(selectedGroup.id)) ? (
									<button
										onClick={() => {
											handleJoinGroup(selectedGroup.id);
											setSelectedGroup(null);
										}}
										className="flex-1 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all"
									>
										Join This Group
									</button>
								) : (
									<button
										disabled
										className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg opacity-70 cursor-not-allowed"
									>
										✓ Already Joined
									</button>
								)}
								<button
									onClick={() => setSelectedGroup(null)}
									className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
