import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";

export default function API() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedTab, setSelectedTab] = useState("rest");

	const endpoints = [
		{
			method: "GET",
			path: "/api/v1/user",
			description: "Get current user information",
			status: 200,
		},
		{
			method: "POST",
			path: "/api/v1/courses",
			description: "Create a new course",
			status: 201,
		},
		{
			method: "GET",
			path: "/api/v1/courses/{id}",
			description: "Get course details",
			status: 200,
		},
		{
			method: "PUT",
			path: "/api/v1/courses/{id}",
			description: "Update course information",
			status: 200,
		},
		{
			method: "DELETE",
			path: "/api/v1/courses/{id}",
			description: "Delete a course",
			status: 204,
		},
		{
			method: "GET",
			path: "/api/v1/quizzes/{id}",
			description: "Get quiz details and questions",
			status: 200,
		},
		{
			method: "POST",
			path: "/api/v1/quizzes/{id}/submit",
			description: "Submit quiz answers",
			status: 200,
		},
		{
			method: "GET",
			path: "/api/v1/analytics/progress",
			description: "Get user progress analytics",
			status: 200,
		},
	];

	const sdks = [
		{
			language: "JavaScript/TypeScript",
			package: "@study-planner",
			install: "npm install @study-planner",
		},
		{
			language: "Python",
			package: "study-planner",
			install: "pip install study-planner",
		},
		{
			language: "Java",
			package: "com.study-planner",
			install: "gradle add dependency",
		},
		{
			language: "Go",
			package: "github.com/study-planner",
			install: "go get github.com/study-planner",
		},
	];

	const getMethodColor = (method) => {
		const colors = {
			GET: "bg-blue-100 text-blue-700",
			POST: "bg-green-100 text-green-700",
			PUT: "bg-amber-100 text-amber-700",
			DELETE: "bg-red-100 text-red-700",
			PATCH: "bg-purple-100 text-purple-700",
		};
		return colors[method] || "bg-gray-100 text-gray-700";
	};

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-5xl mx-auto">
						<div className="mb-8 sm:mb-12 space-y-2 sm:space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">API</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">
								API Documentation
							</h1>
							<p className="text-base sm:text-xl text-gray-600 max-w-3xl">
								Integrate Study Planner into your application with our comprehensive
								REST API.
							</p>
						</div>

						{/* Quick Start */}
						<section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 sm:p-8 md:p-12 mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
							Quick Start
							</h2>
							<div className="space-y-4">
								<div>
									<p className="text-sm font-semibold text-gray-900 mb-2">
										1. Get Your API Key
									</p>
									<p className="text-gray-700">
										Visit your dashboard settings to generate an API key.
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold text-gray-900 mb-2">
										2. Make Your First Request
									</p>
									<div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
										<pre>{`curl -X GET https://api.studyplanner.com/v1/user \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</pre>
									</div>
								</div>
								<div>
									<p className="text-sm font-semibold text-gray-900 mb-2">
										3. Parse the Response
									</p>
									<p className="text-gray-700">
										All responses are in JSON format with consistent error
										handling.
									</p>
								</div>
							</div>
						</section>

						{/* Authentication */}
						<section className="mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
								Authentication
							</h2>
							<div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6">
								<div>
									<h3 className="text-xl font-bold text-gray-900 mb-3">
										Bearer Token
									</h3>
									<p className="text-gray-600 mb-4">
										Include your API key in the Authorization header with Bearer
										scheme:
									</p>
									<div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
										<pre>{`Authorization: Bearer sk_live_abc123xyz789`}</pre>
									</div>
								</div>
								<div className="pt-6 border-t border-gray-200">
									<h3 className="text-xl font-bold text-gray-900 mb-3">
										Token Scopes
									</h3>
									<div className="space-y-2">
										<div className="flex items-center gap-3">
											<code className="bg-amber-100 px-3 py-1 rounded text-sm text-amber-900">
												read:user
											</code>
											<span className="text-gray-600">
												Read user profile and settings
											</span>
										</div>
										<div className="flex items-center gap-3">
											<code className="bg-amber-100 px-3 py-1 rounded text-sm text-amber-900">
												read:courses
											</code>
											<span className="text-gray-600">
												Read courses and materials
											</span>
										</div>
										<div className="flex items-center gap-3">
											<code className="bg-amber-100 px-3 py-1 rounded text-sm text-amber-900">
												write:courses
											</code>
											<span className="text-gray-600">
												Create and modify courses
											</span>
										</div>
										<div className="flex items-center gap-3">
											<code className="bg-amber-100 px-3 py-1 rounded text-sm text-amber-900">
												read:analytics
											</code>
											<span className="text-gray-600">
												Access analytics and progress data
											</span>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* API Endpoints */}
						<section className="mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
								API Endpoints
							</h2>
							<div className="space-y-4">
								{endpoints.map((endpoint, idx) => (
									<div
										key={idx}
										className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-amber-200 transition-all"
									>
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
											<div className="flex items-center gap-4 flex-1 min-w-0">
												<span
													className={`px-3 py-1 rounded-lg font-bold text-sm flex-shrink-0 ${getMethodColor(
														endpoint.method
													)}`}
												>
													{endpoint.method}
												</span>
												<code className="text-gray-900 font-mono text-sm break-all">
													{endpoint.path}
												</code>
											</div>
											<span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-sm font-semibold flex-shrink-0">
												{endpoint.status}
											</span>
										</div>
										<p className="text-gray-600">{endpoint.description}</p>
									</div>
								))}
							</div>
						</section>

						{/* SDKs */}
						<section className="mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
							Official SDKs
							</h2>
							<div className="grid md:grid-cols-2 gap-6">
								{sdks.map((sdk) => (
									<div
										key={sdk.language}
										className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-amber-200 transition-all"
									>
										<h3 className="text-lg font-bold text-gray-900 mb-2">
											{sdk.language}
										</h3>
										<p className="text-gray-600 text-sm mb-4">
											Package: {sdk.package}
										</p>
										<div className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs mb-4">
											<pre>{sdk.install}</pre>
										</div>
										<a
											href="#"
											className="text-amber-700 font-semibold hover:text-amber-800"
										>
											View Documentation →
										</a>
									</div>
								))}
							</div>
						</section>

						{/* Rate Limiting */}
						<section className="mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
								Rate Limiting
							</h2>
							<div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
								<div className="grid md:grid-cols-2 gap-8 mb-8">
									<div>
										<h3 className="text-lg font-bold text-gray-900 mb-4">
											Free Plan
										</h3>
										<ul className="space-y-3 text-gray-600">
											<li>✓ 1,000 requests/day</li>
											<li>✓ 10 requests/minute</li>
											<li>✓ 5 concurrent connections</li>
										</ul>
									</div>
									<div>
										<h3 className="text-lg font-bold text-gray-900 mb-4">
											Pro Plan
										</h3>
										<ul className="space-y-3 text-gray-600">
											<li>✓ 100,000 requests/day</li>
											<li>✓ 500 requests/minute</li>
											<li>✓ 50 concurrent connections</li>
										</ul>
									</div>
								</div>
								<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
									<p className="text-sm text-gray-700">
										<strong>Rate limit headers:</strong> Include{" "}
										<code className="bg-white px-2 py-1 rounded">
											X-RateLimit-Limit
										</code>
										,{" "}
										<code className="bg-white px-2 py-1 rounded">
											X-RateLimit-Remaining
										</code>
										, and{" "}
										<code className="bg-white px-2 py-1 rounded">
											X-RateLimit-Reset
										</code>{" "}
										in all responses.
									</p>
								</div>
							</div>
						</section>

						{/* Error Handling */}
						<section className="mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
								❌ Error Handling
							</h2>
							<div className="space-y-4">
								{errorCodes.map((error) => (
									<div
										key={error.code}
										className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all"
									>
										<div className="flex items-center gap-4 mb-2">
											<span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg font-bold text-sm">
												{error.code}
											</span>
											<h3 className="text-lg font-bold text-gray-900">
												{error.name}
											</h3>
										</div>
										<p className="text-gray-600">{error.description}</p>
									</div>
								))}
							</div>
						</section>

						{/* Response Format */}
						<section className="mb-16">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
								Response Format
							</h2>
							<div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
								<h3 className="text-lg font-bold text-gray-900 mb-4">
									Success Response
								</h3>
								<div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-8">
									<pre>{`{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}`}</pre>
								</div>

								<h3 className="text-lg font-bold text-gray-900 mb-4">
									Error Response
								</h3>
								<div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
									<pre>{`{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: email",
    "details": {
      "field": "email",
      "reason": "required"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123xyz"
  }
}`}</pre>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>

			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-amber-700 via-orange-600 to-red-600 relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<svg className="w-full h-full">
						<defs>
							<pattern
								id="grid"
								width="40"
								height="40"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 40 0 L 0 0 0 40"
									fill="none"
									stroke="white"
									strokeWidth="1"
								/>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
					</svg>
				</div>
				<div className="container mx-auto px-3 sm:px-4 relative z-10">
					<div className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-4 sm:space-y-6 md:space-y-8">
						<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
							Ready to Build?
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
							Start integrating Study Planner API into your application today.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="https://github.com/tinethkaveesha/Study-Planner"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								View on GitHub
							</a>
							<a
								href="mailto:teamispekka@gmail.com"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base hover:bg-white/30 transition-all"
							>
								Contact Us
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

const errorCodes = [
	{
		code: 400,
		name: "Bad Request",
		description: "The request was malformed or missing required parameters.",
	},
	{
		code: 401,
		name: "Unauthorized",
		description: "Authentication failed or token is invalid/expired.",
	},
	{
		code: 403,
		name: "Forbidden",
		description: "You don't have permission to access this resource.",
	},
	{
		code: 404,
		name: "Not Found",
		description: "The requested resource does not exist.",
	},
	{
		code: 429,
		name: "Too Many Requests",
		description: "Rate limit exceeded. Please try again later.",
	},
	{
		code: 500,
		name: "Server Error",
		description: "An unexpected error occurred on the server.",
	},
];
