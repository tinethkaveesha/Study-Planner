import {
    doc,
    updateDoc,
    increment,
    serverTimestamp,
    arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

let sessionStartTime = null;
let activityTimeout = null;
let isTracking = false;

/**
 * Start tracking user session
 * @param {string} userId - Firebase User ID
 */
export function startSessionTracking(userId) {
    if (!userId || isTracking) return;
    
    sessionStartTime = Date.now();
    isTracking = true;

    // Reset timeout on user activity
    const resetActivityTimeout = () => {
        clearTimeout(activityTimeout);
        
        // If user is inactive for 15 minutes, end session
        activityTimeout = setTimeout(() => {
            endSessionTracking(userId);
        }, 15 * 60 * 1000);
    };

    // Listen for user activity
    const events = ["click", "scroll", "keydown", "mousemove"];
    events.forEach((event) => {
        document.addEventListener(event, resetActivityTimeout, true);
    });

    // Store reference for cleanup
    window.activityCleanup = () => {
        events.forEach((event) => {
            document.removeEventListener(event, resetActivityTimeout, true);
        });
        clearTimeout(activityTimeout);
    };

    console.log("Session tracking started for user:", userId);
}

/**
 * End current session and save to Firestore
 * @param {string} userId - Firebase User ID
 */
export async function endSessionTracking(userId) {
    if (!userId || !isTracking || !sessionStartTime) return;

    try {
        const sessionDuration = Math.round((Date.now() - sessionStartTime) / 60000); // minutes
        
        if (sessionDuration < 1) return; // Don't track sessions less than 1 minute

        const docRef = doc(db, "users", userId, "progress", "overview");
        
        await updateDoc(docRef, {
            totalStudyHours: increment(sessionDuration / 60),
            lastStudyDate: serverTimestamp(),
            sessions: arrayUnion({
                duration: sessionDuration, // in minutes
                startTime: new Date(sessionStartTime),
                endTime: new Date(),
                createdAt: new Date().toISOString(),
            }),
            updatedAt: serverTimestamp(),
        });

        console.log(`Session tracked: ${sessionDuration} minutes`);
        
        // Reset tracking
        sessionStartTime = null;
        isTracking = false;
        
        // Cleanup event listeners
        if (window.activityCleanup) {
            window.activityCleanup();
        }
    } catch (error) {
        console.error("Error saving session:", error);
    }
}

/**
 * Track when user clicks on a resource
 * @param {string} userId - Firebase User ID
 * @param {Object} resourceData - Resource information
 */
export async function trackResourceClick(userId, resourceData) {
    if (!userId) return;

    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        
        await updateDoc(docRef, {
            resources: arrayUnion({
                ...resourceData,
                clickedAt: new Date().toISOString(),
            }),
            updatedAt: serverTimestamp(),
        });

        console.log("Resource click tracked:", resourceData.title);
    } catch (error) {
        console.error("Error tracking resource click:", error);
    }
}

/**
 * Track when user accesses a course
 * @param {string} userId - Firebase User ID
 * @param {Object} courseData - Course information
 */
export async function trackCourseAccess(userId, courseData) {
    if (!userId) return;

    try {
        const docRef = doc(db, "users", userId, "progress", "overview");
        
        await updateDoc(docRef, {
            courseAccess: arrayUnion({
                ...courseData,
                accessedAt: new Date().toISOString(),
            }),
            updatedAt: serverTimestamp(),
        });

        console.log("Course access tracked:", courseData.name);
    } catch (error) {
        console.error("Error tracking course access:", error);
    }
}

/**
 * Add a scheduled study session
 * @param {string} userId - Firebase User ID
 * @param {Object} scheduleData - Schedule information
 */
export async function addScheduledSession(userId, scheduleData) {
    if (!userId) return;

    try {
        const docRef = doc(db, "users", userId, "progress", "schedule");
        
        await updateDoc(docRef, {
            sessions: arrayUnion({
                ...scheduleData,
                createdAt: new Date().toISOString(),
            }),
            updatedAt: serverTimestamp(),
        });

        console.log("Schedule added:", scheduleData.title);
    } catch (error) {
        console.error("Error adding schedule:", error);
    }
}

/**
 * Update schedule completion status
 * @param {string} userId - Firebase User ID
 * @param {string} scheduleId - Schedule ID to update
 * @param {boolean} completed - Completion status
 */
export async function updateScheduleCompletion(userId, scheduleId, completed) {
    if (!userId) return;

    try {
        const docRef = doc(db, "users", userId, "progress", "schedule");
        const sessionRef = doc(db, "users", userId, "progress", scheduleId);
        
        await updateDoc(sessionRef, {
            completed,
            completedAt: completed ? serverTimestamp() : null,
            updatedAt: serverTimestamp(),
        });

        console.log("Schedule updated:", scheduleId);
    } catch (error) {
        console.error("Error updating schedule:", error);
    }
}

/**
 * Initialize user progress with schedule document
 * @param {string} userId - Firebase User ID
 */
export async function initializeScheduleTracking(userId) {
    if (!userId) return;

    try {
        const docRef = doc(db, "users", userId, "progress", "schedule");
        
        await updateDoc(docRef, {
            sessions: [],
            totalScheduledHours: 0,
            completedSessions: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }).catch(() => {
            // If document doesn't exist, it will be created on first update
        });

        console.log("Schedule tracking initialized");
    } catch (error) {
        console.error("Error initializing schedule:", error);
    }
}

/**
 * Get current session duration in minutes
 * @returns {number} Minutes elapsed in current session
 */
export function getCurrentSessionDuration() {
    if (!sessionStartTime) return 0;
    return Math.round((Date.now() - sessionStartTime) / 60000);
}

/**
 * Check if currently tracking
 * @returns {boolean} Whether tracking is active
 */
export function isSessionTracking() {
    return isTracking;
}
