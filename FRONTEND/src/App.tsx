import { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

const Home = lazy(() => import("./pages/Home.jsx"));
const Scheduler = lazy(() => import("./pages/Scheduler.jsx"));
const Resources = lazy(() => import("./pages/Resources.jsx"));
const Progress = lazy(() => import("./pages/Progress.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const Quizzes = lazy(() => import("./pages/Quizzes.jsx"));
const Groups = lazy(() => import("./pages/Groups.jsx"));
const Subscription = lazy(() => import("./pages/Subscription.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogDetail = lazy(() => import("./pages/BlogDetail.jsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.jsx"));
const Docs = lazy(() => import("./pages/Docs.jsx"));
const SecuritySettings = lazy(() => import("./pages/Security.jsx"));
const Status = lazy(() => import("./pages/Status.jsx"));
const API = lazy(() => import("./pages/API.jsx"));
const Support = lazy(() => import("./pages/Support.jsx"));
const Careers = lazy(() => import("./pages/Careers.jsx"));
const Cookies = lazy(() => import("./pages/Cookies.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Integrations = lazy(() => import("./pages/Integrations.jsx"));
const Features = lazy(() => import("./pages/Features.jsx"));
const Download = lazy(() => import("./pages/Download.jsx"));
const Success = lazy(() => import("./pages/Success.jsx"))

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import NotificationPanel from "./components/NotificationPanel.jsx";
import AuthModal from "./components/AuthModal.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import useActivityTracking from "./hooks/useActivityTracking.js";


const PageLoader = () => (
	<div className="flex items-center justify-center min-h-[60vh]">
		<div className="text-center">
			<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
			<p className="mt-4 text-gray-600">Loading...</p>
		</div>
	</div>
);

const navLinks = [
	{ name: "Dashboard", path: "/" },
	{ name: "Scheduler", path: "/scheduler" },
	{ name: "Resources", path: "/resources" },
	{ name: "Progress", path: "/progress" },
	{ name: "Analytics", path: "/analytics" },
	{ name: "Quizzes", path: "/quizzes" },
	{ name: "Groups", path: "/groups" },
];

const productLinks = [
	{ name: "Features", path: "/features" },
	{ name: "Pricing", path: "/subscription" },
	{ name: "Download", path: "/download" },
	{ name: "Integrations", path: "/integrations" },
];

const companyLinks = [
	{ name: "About", path: "https://team-p-e-k-k-a.vercel.app/", external: true },
	{ name: "Blog", path: "/blog" },
	{ name: "Careers", path: "/careers" },
	{ name: "Contact", path: "/contact" },
];

const legalLinks = [
	{ name: "Terms", path: "/terms-of-service" },
	{ name: "Privacy", path: "/privacy" },
	{ name: "Cookies", path: "/cookies" },
	{ name: "Security", path: "/security" },
];

const bottomLinks = [
	{ name: "Support", path: "/support" },
	{ name: "Docs", path: "/docs" },
	{ name: "Status", path: "/status" },
	{ name: "API", path: "/api" },
];

function AppContent() {
	useActivityTracking();
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [showNotificationPanel, setShowNotificationPanel] = useState(false);

	const toggleMobileMenu = () => setShowMobileMenu((v) => !v);
	const openAuthModal = () => setShowAuthModal(true);
	const closeAuthModal = () => setShowAuthModal(false);
	const toggleNotificationPanel = () => setShowNotificationPanel((v) => !v);

	return (
		<div className="min-h-screen bg-white" style={{ backgroundImage: "linear-gradient(to bottom, hsl(30 25% 96% / 0.85), hsl(30 25% 96% / 0.9))" }}>
			<ScrollToTop />
			<Header
				showMobileMenu={showMobileMenu}
				toggleMobileMenu={toggleMobileMenu}
				openAuthModal={openAuthModal}
				toggleNotificationPanel={toggleNotificationPanel}
				navLinks={navLinks}
			/>

				<Suspense fallback={<PageLoader />}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/subscription" element={<Subscription />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/scheduler" element={<Scheduler />} />
						<Route path="/resources" element={<Resources />} />
						<Route path="/progress" element={<Progress />} />
						<Route path="/analytics" element={<Analytics />} />
						<Route path="/quizzes" element={<Quizzes />} />
						<Route path="/groups" element={<Groups />} />
						<Route path="/blog" element={<Blog />} />
						<Route path="/blog/:postId" element={<BlogDetail />} />
						<Route path="/terms-of-service" element={<TermsOfService />} />
						<Route path="/docs" element={<Docs />} />
						<Route path="/security" element={<SecuritySettings />} />
						<Route path="/status" element={<Status />} />
						<Route path="/api" element={<API />} />
						<Route path="/support" element={<Support />} />
						<Route path="/careers" element={<Careers />} />
						<Route path="/cookies" element={<Cookies />} />
						<Route path="/privacy" element={<Privacy />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/integrations" element={<Integrations />} />
						<Route path="/features" element={<Features />} />
						<Route path="/download" element={<Download />} />
                        <Route path="/success" element={<Success />} />
					</Routes>
				</Suspense>

			<Footer 
				productLinks={productLinks}
				companyLinks={companyLinks}
				legalLinks={legalLinks}
				bottomLinks={bottomLinks}
			/>

			<NotificationPanel isOpen={showNotificationPanel} onClose={() => setShowNotificationPanel(false)} />
			<AuthModal isOpen={showAuthModal} onClose={closeAuthModal} />
		</div>
	);
}

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</Router>
	);
}