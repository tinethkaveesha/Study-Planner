import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [sessionActive, setSessionActive] = useState(false);

    useEffect(() => {
        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);
                setSessionActive(true);

                // Real-time listener for user data from Firestore
                const userDocRef = doc(db, "users", authUser.uid);
                const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData({ uid: authUser.uid, ...docSnap.data() });
                    }
                    setLoading(false);
                });

                return () => unsubscribeSnapshot();
            } else {
                setUser(null);
                setUserData(null);
                setSessionActive(false);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Track online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Warn user before leaving if session is active
    useEffect(() => {
        if (!sessionActive) return;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleBeforeUnload = (e) => {
            // Browser will close and session will end
            // This is optional - just logs that session is ending
            console.log("Session will end when browser closes");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [sessionActive]);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserData(null);
            setSessionActive(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, isOnline, logout, sessionActive }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
