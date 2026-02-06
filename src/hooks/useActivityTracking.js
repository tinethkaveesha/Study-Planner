/**
 * useActivityTracking Hook
 * Manages user session tracking and activity monitoring
 */

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { startSessionTracking, endSessionTracking } from "../utils/activityTracker";

export function useActivityTracking() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        // Start tracking when component mounts
        startSessionTracking(user.uid);

        // End tracking when component unmounts or user logs out
        return () => {
            endSessionTracking(user.uid);
        };
    }, [user]);

    useEffect(() => {
        // Also end session when user leaves the page or closes window
        const handleBeforeUnload = () => {
            if (user) {
                endSessionTracking(user.uid);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [user]);
}

export default useActivityTracking;
