import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Route Diagnostic Component
 * Helps identify routing issues in production
 * Add this temporarily to debug routing problems
 * Remove after debugging
 */
export default function RouteDiagnostic() {
	const location = useLocation();
	const navigate = useNavigate();
	const [testPath, setTestPath] = useState("/privacy");
	const [logs, setLogs] = useState([]);

	const addLog = (message) => {
		const timestamp = new Date().toLocaleTimeString();
		setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
	};

	const testNavigation = (path) => {
		addLog(`Testing navigation to: ${path}`);
		try {
			navigate(path);
			addLog(`✅ Navigate called successfully`);
		} catch (error) {
			addLog(`❌ Navigation error: ${error.message}`);
		}
	};

	const testAllFooterLinks = () => {
		const footerPaths = [
			"/features", "/subscription", "/download", "/integrations",
			"/blog", "/careers", "/contact",
			"/terms-of-service", "/privacy", "/cookies", "/security",
			"/support", "/docs", "/status", "/api"
		];

		addLog("Starting footer links test...");
		footerPaths.forEach((path, index) => {
			setTimeout(() => {
				addLog(`Testing: ${path}`);
				navigate(path);
				setTimeout(() => {
					addLog(`Current location: ${window.location.pathname}`);
				}, 100);
			}, index * 500);
		});
	};

	return (
		<div style={{
			position: "fixed",
			bottom: 0,
			left: 0,
			right: 0,
			background: "rgba(0, 0, 0, 0.9)",
			color: "#00ff00",
			padding: "20px",
			maxHeight: "300px",
			overflow: "auto",
			fontFamily: "monospace",
			fontSize: "12px",
			zIndex: 9999,
			borderTop: "2px solid #00ff00"
		}}>
			<div style={{ marginBottom: "15px" }}>
				<h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>🔍 Route Diagnostic Tool</h3>
				<div style={{ marginBottom: "10px" }}>
					<strong>Current Path:</strong> {location.pathname}
				</div>
				<div style={{ marginBottom: "10px" }}>
					<strong>Full URL:</strong> {window.location.href}
				</div>
				<div style={{ marginBottom: "10px" }}>
					<strong>Base URL:</strong> {window.location.origin}
				</div>
			</div>

			<div style={{ marginBottom: "15px" }}>
				<input
					type="text"
					value={testPath}
					onChange={(e) => setTestPath(e.target.value)}
					placeholder="/path/to/test"
					style={{
						padding: "5px 10px",
						marginRight: "10px",
						background: "#222",
						border: "1px solid #00ff00",
						color: "#00ff00",
						fontFamily: "monospace"
					}}
				/>
				<button
					onClick={() => testNavigation(testPath)}
					style={{
						padding: "5px 15px",
						background: "#00ff00",
						border: "none",
						color: "#000",
						cursor: "pointer",
						marginRight: "10px",
						fontWeight: "bold"
					}}
				>
					Test Path
				</button>
				<button
					onClick={testAllFooterLinks}
					style={{
						padding: "5px 15px",
						background: "#ff9900",
						border: "none",
						color: "#000",
						cursor: "pointer",
						marginRight: "10px",
						fontWeight: "bold"
					}}
				>
					Test All Footer Links
				</button>
				<button
					onClick={() => setLogs([])}
					style={{
						padding: "5px 15px",
						background: "#ff0000",
						border: "none",
						color: "#fff",
						cursor: "pointer",
						fontWeight: "bold"
					}}
				>
					Clear Logs
				</button>
			</div>

			<div style={{
				background: "#111",
				padding: "10px",
				borderRadius: "5px",
				maxHeight: "150px",
				overflow: "auto"
			}}>
				<div style={{ marginBottom: "5px", color: "#888" }}>
					--- Diagnostic Logs ---
				</div>
				{logs.length === 0 ? (
					<div style={{ color: "#666", fontStyle: "italic" }}>
						No logs yet. Click "Test All Footer Links" to start diagnosis.
					</div>
				) : (
					logs.map((log, index) => (
						<div key={index} style={{ marginBottom: "3px" }}>
							{log}
						</div>
					))
				)}
			</div>

			<div style={{ marginTop: "10px", fontSize: "10px", color: "#888" }}>
				💡 Tip: If navigation works here but not in production, you need server configuration (see DEPLOYMENT_GUIDE.md)
			</div>
		</div>
	);
}
