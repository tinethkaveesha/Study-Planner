import { useEffect } from 'react';

const ADMIN_REDIRECT_URL = "https://admin-one-ashen-52.vercel.app/";

/**
 * AdminRedirect Component
 * A dedicated page that handles admin dashboard redirection
 * This is more reliable than immediate redirects from auth callbacks
 */
export default function AdminRedirect() {
    useEffect(() => {
        // Add a small delay to ensure everything is loaded
        const timer = setTimeout(() => {
            // Primary method: window.location.replace (no back button)
            window.location.replace(ADMIN_REDIRECT_URL);
        }, 1000); // 1 second delay to show loading message

        // Cleanup
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
            <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-700 mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Redirecting to Admin Dashboard
                </h2>
                <p className="text-gray-600 mb-4">
                    Please wait while we redirect you...
                </p>
                <p className="text-sm text-gray-500">
                    If you are not redirected automatically,{' '}
                    <a 
                        href={ADMIN_REDIRECT_URL}
                        className="text-amber-700 hover:text-amber-800 font-medium underline"
                    >
                        click here
                    </a>
                </p>
            </div>
        </div>
    );
}