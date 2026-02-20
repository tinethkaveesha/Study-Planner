import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setSubscription(userDoc.data().subscription || null);
                    }
                } catch (error) {
                    console.error("Error fetching subscription:", error);
                }
            } else {
                setSubscription(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const updateSubscription = async (userId, subscriptionData) => {
        try {
            await setDoc(
                doc(db, "users", userId),
                { subscription: subscriptionData },
                { merge: true }
            );
            setSubscription(subscriptionData);
        } catch (error) {
            console.error("Error updating subscription:", error);
        }
    };

    return (
        <SubscriptionContext.Provider value={{ subscription, loading, updateSubscription }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error("useSubscription must be used within SubscriptionProvider");
    }
    return context;
};