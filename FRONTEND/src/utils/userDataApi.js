import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    increment,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Initialize all user data documents when user signs up
 * Creates: users, user progress, analytics, and groups collections
 * @param {string} userId - Firebase User ID
 * @param {Object} userData - User profile data
 */
export async function initializeUserData(userId, userData) {
    try {
        // 1. Initialize user progress document
        await setDoc(doc(db, "users", userId, "progress", "overview"), {
            userId,
            studyGoal: "Not set",
            totalStudyHours: 0,
            streakDays: 0,
            lastStudyDate: null,
            completedTasks: 0,
            totalTasks: 0,
            averageScore: 0,
            subjects: [],
            sessions: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // 2. Initialize user analytics document
        await setDoc(doc(db, "users", userId, "analytics", "overview"), {
            userId,
            weeklyProgress: {
                week1: 0,
                week2: 0,
                week3: 0,
                week4: 0,
            },
            monthlyStats: {
                studyTime: 0,
                tasksCompleted: 0,
                averageScore: 0,
            },
            semesterStats: {
                studyTime: 0,
                tasksCompleted: 0,
                averageScore: 0,
            },
            topSubjects: [],
            weakAreas: [],
            learningPatterns: {},
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // 3. Initialize user groups document
        await setDoc(doc(db, "users", userId, "groups", "membership"), {
            userId,
            joinedGroups: [],
            ownedGroups: [],
            groupInvites: [],
            totalGroupsJoined: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // 4. Initialize user preferences/settings
        await setDoc(doc(db, "users", userId, "settings", "preferences"), {
            userId,
            theme: "light",
            notifications: true,
            emailUpdates: true,
            privacy: "public",
            dailyGoal: 120, // minutes
            preferredStudyTime: "morning",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // 5. Initialize user schedule collection (empty initial doc to create collection)
        await setDoc(doc(db, "users", userId, "schedule", "_metadata"), {
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return { success: true, message: "User data initialized" };
    } catch (error) {
        console.error("Error initializing user data:", error);
        throw error;
    }
}

/**
 * Get user progress data
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} User progress data
 */
export async function getUserProgress(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user progress:", error);
        throw error;
    }
}

/**
 * Update user progress
 * @param {string} userId - Firebase User ID
 * @param {Object} updateData - Progress data to update
 */
export async function updateUserProgress(userId, updateData) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating user progress:", error);
        throw error;
    }
}

/**
 * Add study session to user progress
 * @param {string} userId - Firebase User ID
 * @param {Object} sessionData - Study session details
 */
export async function addStudySession(userId, sessionData) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        await updateDoc(docRef, {
            sessions: arrayUnion({
                ...sessionData,
                createdAt: serverTimestamp(),
            }),
            totalStudyHours: increment(sessionData.duration || 0),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding study session:", error);
        throw error;
    }
}

/**
 * Get user analytics
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} User analytics data
 */
export async function getUserAnalytics(userId) {
    try {
        const docRef = doc(db, "users", userId, "analytics", "overview");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user analytics:", error);
        throw error;
    }
}

/**
 * Update user analytics
 * @param {string} userId - Firebase User ID
 * @param {Object} updateData - Analytics data to update
 */
export async function updateUserAnalytics(userId, updateData) {
    try {
        const docRef = doc(db, "users", userId, "analytics", "overview");
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating user analytics:", error);
        throw error;
    }
}

/**
 * Get user groups membership
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} User groups data
 */
export async function getUserGroups(userId) {
    try {
        const docRef = doc(db, "users", userId, "groups", "membership");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user groups:", error);
        throw error;
    }
}

/**
 * Add user to a study group
 * @param {string} userId - Firebase User ID
 * @param {string} groupId - Group ID to join
 * @param {Object} groupData - Basic group info
 */
export async function joinGroup(userId, groupId, groupData) {
    try {
        const docRef = doc(db, "users", userId, "groups", "membership");
        await updateDoc(docRef, {
            joinedGroups: arrayUnion({
                groupId,
                ...groupData,
                joinedAt: serverTimestamp(),
            }),
            totalGroupsJoined: increment(1),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error joining group:", error);
        throw error;
    }
}

/**
 * Remove user from a study group
 * @param {string} userId - Firebase User ID
 * @param {string} groupId - Group ID to leave
 */
export async function leaveGroup(userId, groupId) {
    try {
        const docRef = doc(db, "users", userId, "groups", "membership");
        const userDoc = await getDoc(docRef);
        
        if (userDoc.exists()) {
            const joinedGroups = userDoc.data().joinedGroups || [];
            const updatedGroups = joinedGroups.filter(g => g.groupId !== groupId);
            
            await updateDoc(docRef, {
                joinedGroups: updatedGroups,
                totalGroupsJoined: increment(-1),
                updatedAt: serverTimestamp(),
            });
        }
    } catch (error) {
        console.error("Error leaving group:", error);
        throw error;
    }
}

/**
 * Get user preferences/settings
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} User settings
 */
export async function getUserSettings(userId) {
    try {
        const docRef = doc(db, "users", userId, "settings", "preferences");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user settings:", error);
        throw error;
    }
}

/**
 * Update user settings
 * @param {string} userId - Firebase User ID
 * @param {Object} updateData - Settings to update
 */
export async function updateUserSettings(userId, updateData) {
    try {
        const docRef = doc(db, "users", userId, "settings", "preferences");
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating user settings:", error);
        throw error;
    }
}

/**
 * Increment user task completion
 * @param {string} userId - Firebase User ID
 */
export async function incrementTaskCompletion(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        await updateDoc(docRef, {
            completedTasks: increment(1),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error incrementing task:", error);
        throw error;
    }
}

/**
 * Update user study streak
 * @param {string} userId - Firebase User ID
 * @param {number} streakDays - Number of consecutive study days
 */
export async function updateStudyStreak(userId, streakDays) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        await updateDoc(docRef, {
            streakDays,
            lastStudyDate: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating study streak:", error);
        throw error;
    }
}

/**
 * Get all active users (for admin/analytics)
 * @returns {Promise<Array>} Array of user documents
 */
export async function getAllUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
}

/**
 * Delete all user data (when account is deleted)
 * @param {string} userId - Firebase User ID
 */
export async function deleteUserData(userId) {
    try {
        // Delete subcollections
        const progressRef = collection(db, "users", userId, "progress");
        const analyticsRef = collection(db, "users", userId, "analytics");
        const groupsRef = collection(db, "users", userId, "groups");
        const settingsRef = collection(db, "users", userId, "settings");

        // Get all docs in subcollections and delete them
        const progressDocs = await getDocs(progressRef);
        progressDocs.forEach(doc => doc.ref.delete());

        const analyticsDocs = await getDocs(analyticsRef);
        analyticsDocs.forEach(doc => doc.ref.delete());

        const groupsDocs = await getDocs(groupsRef);
        groupsDocs.forEach(doc => doc.ref.delete());

        const settingsDocs = await getDocs(settingsRef);
        settingsDocs.forEach(doc => doc.ref.delete());

        // Delete user document
        await doc(db, "users", userId).delete();
    } catch (error) {
        console.error("Error deleting user data:", error);
        throw error;
    }
}

/**
 * Get user schedule
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} User schedule data
 */
export async function getUserSchedule(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "schedule");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user schedule:", error);
        throw error;
    }
}

/**
 * Get all user study sessions
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Array>} Array of study sessions
 */
export async function getUserStudySessions(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().sessions || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching study sessions:", error);
        throw error;
    }
}

/**
 * Get user study hours (real-time calculated)
 * @param {string} userId - Firebase User ID
 * @returns {Promise<number>} Total study hours
 */
export async function getUserStudyHours(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().totalStudyHours || 0;
        }
        return 0;
    } catch (error) {
        console.error("Error fetching study hours:", error);
        throw error;
    }
}

/**
 * Get user active courses (clicked resources)
 * @param {string} userId - Firebase User ID
 * @returns {Promise<number>} Number of active courses
 */
export async function getUserActiveCourses(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const resources = docSnap.data().resources || [];
            // Get unique courses
            const uniqueCourses = new Set(resources.map(r => r.courseId)).size;
            return uniqueCourses;
        }
        return 0;
    } catch (error) {
        console.error("Error fetching active courses:", error);
        throw error;
    }
}

/**
 * Get user clicked resources
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Array>} Array of clicked resources
 */
export async function getUserResources(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().resources || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
    }
}

/**
 * Initialize schedule document for user
 * @param {string} userId - Firebase User ID
 */
export async function initializeUserSchedule(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "schedule");
        
        await setDoc(docRef, {
            userId,
            sessions: [],
            totalScheduledHours: 0,
            completedSessions: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error("Error initializing user schedule:", error);
        // Don't throw - it's okay if this fails
    }
}

/**
 * Add a schedule item
 * @param {string} userId - Firebase User ID
 * @param {Object} scheduleData - Schedule details
 */
export async function addScheduleItem(userId, scheduleData) {
    try {
        const docRef = doc(db, "users", userId, "progress", "schedule");
        
        await updateDoc(docRef, {
            sessions: arrayUnion({
                id: Date.now().toString(),
                ...scheduleData,
                completed: false,
                createdAt: serverTimestamp(),
            }),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding schedule item:", error);
        throw error;
    }
}

/**
 * Get user's overall real-time stats
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} Aggregated user statistics
 */
export async function getUserRealTimeStats(userId) {
    try {
        const progress = await getUserProgress(userId);
        const studyHours = await getUserStudyHours(userId);
        const activeCourses = await getUserActiveCourses(userId);
        const sessions = await getUserStudySessions(userId);

        return {
            totalStudyHours: studyHours,
            activeCourses,
            totalSessions: sessions.length,
            currentStreak: progress?.streakDays || 0,
            completedTasks: progress?.completedTasks || 0,
            averageScore: progress?.averageScore || 0,
            lastStudyDate: progress?.lastStudyDate,
        };
    } catch (error) {
        console.error("Error fetching real-time stats:", error);
        throw error;
    }
}

/**
 * Record an assessment/quiz score
 * @param {string} userId - User ID
 * @param {Object} assessmentData - Assessment details
 * @returns {Promise<void>}
 */
export async function recordAssessment(userId, assessmentData) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        
        await updateDoc(docRef, {
            assessments: arrayUnion({
                ...assessmentData,
                recordedAt: new Date().toISOString(),
            }),
            averageScore: increment(assessmentData.score || 0),
        });
    } catch (error) {
        console.error("Error recording assessment:", error);
        throw error;
    }
}

/**
 * Get all assessments/quiz scores for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export async function getUserAssessments(userId) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().assessments || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching assessments:", error);
        return [];
    }
}

/**
 * Record subject marks (for school exams)
 * @param {string} userId - User ID
 * @param {Object} subjectMarks - Subject and marks
 * @returns {Promise<void>}
 */
export async function recordSubjectMarks(userId, subjectMarks) {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        
        await updateDoc(docRef, {
            subjectMarks: arrayUnion({
                ...subjectMarks,
                recordedAt: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error("Error recording subject marks:", error);
        throw error;
    }
}

/**
 * Get subject marks performance analysis - FILTERED BY EXAM TYPE
 * @param {string} userId - User ID
 * @param {string} examType - Exam type to analyze (ordinary, scholarship, advanced)
 * @returns {Promise<Object>}
 */
export async function getSubjectMarkAnalysis(userId, examType = "ordinary") {
    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists() || !docSnap.data().subjectMarks) {
            return {};
        }

        const marks = docSnap.data().subjectMarks;
        
        // Filter marks by exam type
        const filteredMarks = marks.filter(mark => 
            mark.examType === examType || !mark.examType // Include records without examType for backward compatibility
        );
        
        const analysis = {};

        // Group by subject
        filteredMarks.forEach((mark) => {
            if (!analysis[mark.subject]) {
                analysis[mark.subject] = {
                    subject: mark.subject,
                    scores: [],
                    average: 0,
                    highest: 0,
                    lowest: 100,
                    trend: "→",
                    history: [],
                };
            }

            analysis[mark.subject].scores.push(mark.score);
            analysis[mark.subject].history.push({
                term: mark.term || "Unknown",
                score: mark.score,
                date: mark.recordedAt,
            });

            // Calculate statistics
            const scores = analysis[mark.subject].scores;
            analysis[mark.subject].average = 
                Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10;
            analysis[mark.subject].highest = Math.max(...scores);
            analysis[mark.subject].lowest = Math.min(...scores);

            // Determine trend
            if (scores.length >= 2) {
                const recent = scores.slice(-2);
                const trend = recent[1] - recent[0];
                if (trend > 5) analysis[mark.subject].trend = "↑";
                else if (trend < -5) analysis[mark.subject].trend = "↓";
                else analysis[mark.subject].trend = "→";
            }
        });

        return analysis;
    } catch (error) {
        console.error("Error analyzing subject marks:", error);
        return {};
    }
}

/**
 * Get performance by subject for a term
 * @param {string} userId - User ID
 * @param {string} term - Term name (e.g., "Term 1", "Midterm")
 * @returns {Promise<Array>}
 */
export async function getTermPerformance(userId, term) {
    try {
        const analysis = await getSubjectMarkAnalysis(userId);
        
        return Object.values(analysis)
            .map((subject) => ({
                ...subject,
                termScore: subject.history.find((h) => h.term === term)?.score || 0,
            }))
            .sort((a, b) => b.average - a.average);
    } catch (error) {
        console.error("Error fetching term performance:", error);
        return [];
    }
}

/**
 * Calculate overall academic progress
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
export async function getAcademicProgress(userId, examType = "ordinary") {
    try {
        const analysis = await getSubjectMarkAnalysis(userId, examType);
        const assessments = await getUserAssessments(userId);

        const subjects = Object.values(analysis);
        const overallAverage = 
            subjects.length > 0
                ? Math.round(subjects.reduce((sum, s) => sum + s.average, 0) / subjects.length * 10) / 10
                : 0;

        const improvingSubjects = subjects.filter((s) => s.trend === "↑").length;
        const decreasingSubjects = subjects.filter((s) => s.trend === "↓").length;

        return {
            overallAverage,
            totalSubjects: subjects.length,
            improvingSubjects,
            decreasingSubjects,
            subjectScores: subjects.map((s) => ({
                name: s.subject,
                score: s.average,
                trend: s.trend,
                highest: s.highest,
                lowest: s.lowest,
            })),
            recentAssessments: assessments.slice(-5),
        };
    } catch (error) {
        console.error("Error calculating academic progress:", error);
        throw error;
    }
}

/**
 * Update user profile information
 * @param {string} userId - Firebase User ID
 * @param {Object} profileData - Profile data to update (name, birthday, phone, address, etc.)
 * @returns {Promise<void>}
 */
export async function updateUserProfile(userId, profileData) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp(),
        });
        console.log("User profile updated successfully");
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

/**
 * Get user profile information
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

/**
 * SCHEDULED SESSIONS MANAGEMENT
 */

/**
 * Save a scheduled study session to Firestore
 * @param {string} userId - Firebase User ID
 * @param {Object} session - Session data { id, subject, startTime, endTime, description }
 */
export async function saveScheduledSession(userId, session) {
    try {
        const sessionRef = doc(db, "users", userId, "schedule", session.id || "temp");
        await setDoc(sessionRef, {
            ...session,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }, { merge: true });
        return session.id;
    } catch (error) {
        console.error("Error saving scheduled session:", error);
        throw error;
    }
}

/**
 * Get all scheduled sessions for a user
 * @param {string} userId - Firebase User ID
 */
export async function getScheduledSessions(userId) {
    try {
        const sessionsRef = collection(db, "users", userId, "schedule");
        const snapshot = await getDocs(sessionsRef);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching scheduled sessions:", error);
        throw error;
    }
}

/**
 * Delete a scheduled session from Firestore
 * @param {string} userId - Firebase User ID
 * @param {string} sessionId - Session ID to delete
 */
export async function deleteScheduledSession(userId, sessionId) {
    try {
        const sessionRef = doc(db, "users", userId, "schedule", sessionId);
        await deleteDoc(sessionRef);
    } catch (error) {
        console.error("Error deleting scheduled session:", error);
        throw error;
    }
}

/**
 * STUDY GROUPS MANAGEMENT
 */

/**
 * Create a study group (person creating is the owner)
 * @param {string} userId - Creator's Firebase User ID
 * @param {Object} groupData - Group data { name, description, subject, maxMembers }
 */
export async function createStudyGroup(userId, groupData) {
    try {
        const groupId = doc(collection(db, "study_groups")).id;
        const groupRef = doc(db, "study_groups", groupId);
        
        await setDoc(groupRef, {
            groupId,
            name: groupData.name,
            description: groupData.description,
            subject: groupData.subject,
            maxMembers: groupData.maxMembers || 10,
            ownerId: userId,
            members: [userId], // Owner is first member
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Store group in user's created groups
        await setDoc(doc(db, "users", userId, "groups", groupId), {
            groupId,
            name: groupData.name,
            role: "owner",
            joinedAt: new Date().toISOString(),
        }, { merge: true });

        return groupId;
    } catch (error) {
        console.error("Error creating study group:", error);
        throw error;
    }
}

/**
 * Get all groups created by user
 * @param {string} userId - Firebase User ID
 */
export async function getCreatedGroups(userId) {
    try {
        const groupsRef = collection(db, "users", userId, "groups");
        const q = query(groupsRef, where("role", "==", "owner"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching created groups:", error);
        throw error;
    }
}

/**
 * Get all groups joined by user (including created)
 * @param {string} userId - Firebase User ID
 */
export async function getJoinedGroups(userId) {
    try {
        const groupsRef = collection(db, "users", userId, "groups");
        const snapshot = await getDocs(groupsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching joined groups:", error);
        throw error;
    }
}

/**
 * Join a study group
 * @param {string} userId - Firebase User ID
 * @param {string} groupId - Group ID to join
 */
export async function joinStudyGroup(userId, groupId) {
    try {
        // Add user to group's members list
        const groupRef = doc(db, "study_groups", groupId);
        await updateDoc(groupRef, {
            members: arrayUnion(userId),
            updatedAt: new Date().toISOString(),
        });

        // Add group to user's groups
        await setDoc(doc(db, "users", userId, "groups", groupId), {
            groupId,
            role: "member",
            joinedAt: new Date().toISOString(),
        }, { merge: true });
    } catch (error) {
        console.error("Error joining study group:", error);
        throw error;
    }
}

/**
 * Leave a study group
 * @param {string} userId - Firebase User ID
 * @param {string} groupId - Group ID to leave
 */
export async function leaveStudyGroup(userId, groupId) {
    try {
        // Remove user from group's members list
        const groupRef = doc(db, "study_groups", groupId);
        await updateDoc(groupRef, {
            members: arrayRemove(userId),
            updatedAt: new Date().toISOString(),
        });

        // Remove group from user's groups
        const userGroupRef = doc(db, "users", userId, "groups", groupId);
        await deleteDoc(userGroupRef);
    } catch (error) {
        console.error("Error leaving study group:", error);
        throw error;
    }
}

/**
 * Delete a study group (owner only)
 * @param {string} userId - Owner's Firebase User ID
 * @param {string} groupId - Group ID to delete
 */
export async function deleteStudyGroup(userId, groupId) {
    try {
        const groupRef = doc(db, "study_groups", groupId);
        const groupSnap = await getDoc(groupRef);
        
        if (groupSnap.data().ownerId !== userId) {
            throw new Error("Only group owner can delete the group");
        }

        // Delete group document
        await deleteDoc(groupRef);

        // Remove group from all members' collections
        const groupData = groupSnap.data();
        for (const memberId of groupData.members) {
            const userGroupRef = doc(db, "users", memberId, "groups", groupId);
            try {
                await deleteDoc(userGroupRef);
            } catch (error) {
                console.warn(`Error removing group from user ${memberId}:`, error);
            }
        }
    } catch (error) {
        console.error("Error deleting study group:", error);
        throw error;
    }
}

