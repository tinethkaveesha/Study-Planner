import { useNavigate } from "react-router-dom";
import { FaBullseye, FaHandshake, FaRocket, FaSeedling, FaMapPin } from 'react-icons/fa';

export default function Careers() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const navigate = useNavigate();

	const jobOpenings = [
		{
			title: "Full Stack Developer",
			department: "Engineering",
			location: "Remote",
			type: "Full-time",
		},
		{
			title: "Product Manager",
			department: "Product",
			location: "Remote",
			type: "Full-time",
		},
		{
			title: "UX/UI Designer",
			department: "Design",
			location: "Remote",
			type: "Full-time",
		},
		{
			title: "Data Scientist",
			department: "Engineering",
			location: "Remote",
			type: "Full-time",
		},
		{
			title: "Customer Success Manager",
			department: "Operations",
			location: "Remote",
			type: "Full-time",
		},
		{
			title: "Content Writer",
			department: "Marketing",
			location: "Remote",
			type: "Part-time",
		},
	];

	const values = [
		{ icon: <FaBullseye className="text-4xl sm:text-5xl" />, title: "Educate First", desc: "We're passionate about transforming education for millions of students worldwide." },
		{ icon: <FaHandshake className="text-4xl sm:text-5xl" />, title: "Collaborate", desc: "We believe in the power of teamwork and diverse perspectives." },
		{ icon: <FaRocket className="text-4xl sm:text-5xl" />, title: "Innovate", desc: "We constantly push boundaries to create better learning experiences." },
		{ icon: <FaSeedling className="text-4xl sm:text-5xl" />, title: "Grow", desc: "We invest in our team's growth and professional development." },
	];

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-4xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">CAREERS</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">Join Our Mission</h1>
							<p className="text-base sm:text-xl text-gray-600">
								Help us transform education and create the future of learning.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16">
							{values.map((value) => (
								<div key={value.title} className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all">
									<div className="text-amber-700 mb-4">{value.icon}</div>
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
									<p className="text-gray-600 text-sm sm:text-base">{value.desc}</p>
								</div>
							))}
						</div>

						<section className="mb-16">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">Open Positions</h2>
							<div className="space-y-4">
								{jobOpenings.map((job) => (
									<div
										key={job.title}
										className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg hover:border-amber-200 transition-all"
									>
										<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4">
											<div className="flex-1">
												<h3 className="text-lg sm:text-xl font-bold text-gray-900">{job.title}</h3>
												<p className="text-gray-600 text-sm sm:text-base">{job.department}</p>
											</div>
											<span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0">
												{job.type}
											</span>
										</div>
										<p className="text-gray-600 text-sm sm:text-base flex items-center gap-2 mb-4">
											<FaMapPin className="text-amber-700" /> {job.location}
										</p>
										<button className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-lg hover:shadow-lg font-semibold text-sm sm:text-base transition-all">
											Apply Now
										</button>
									</div>
								))}
							</div>
						</section>

						<section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl border border-amber-200 p-6 sm:p-8 md:p-12 mb-16">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Work With Us?</h2>
							<ul className="space-y-3 text-gray-700 text-sm sm:text-base">
								<li className="flex items-center gap-3">
									<span className="text-amber-700 font-bold">✓</span>
									<span>Competitive salary and equity</span>
								</li>
								<li className="flex items-center gap-3">
									<span className="text-amber-700 font-bold">✓</span>
									<span>Flexible work hours and remote work</span>
								</li>
								<li className="flex items-center gap-3">
									<span className="text-amber-700 font-bold">✓</span>
									<span>Comprehensive health insurance</span>
								</li>
								<li className="flex items-center gap-3">
									<span className="text-amber-700 font-bold">✓</span>
									<span>Professional development budget</span>
								</li>
								<li className="flex items-center gap-3">
									<span className="text-amber-700 font-bold">✓</span>
									<span>Collaborative and diverse team</span>
								</li>
								<li className="flex items-center gap-3">
									<span className="text-amber-700 font-bold">✓</span>
									<span>Impact on millions of students worldwide</span>
								</li>
							</ul>
						</section>

						<div className="text-center">
							<p className="text-gray-600 mb-6 text-base sm:text-lg">Don't see a role that fits you?</p>
							<a
								href="mailto:teamispekka@gmail.com"
								className="inline-block px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
							>
								Send Us Your Resume
							</a>
						</div>
					</div>
				</div>
			</section>

			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-amber-700 via-orange-600 to-red-600 relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<svg className="w-full h-full">
						<defs>
							<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
								<path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
					</svg>
				</div>
				<div className="container mx-auto px-3 sm:px-4 relative z-10">
					<div className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-3xl mx-auto">
						<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
							Ready to Make an Impact?
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Join our growing team and help shape the future of education.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="mailto:teamispekka@gmail.com"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								Apply Now
							</a>
							<a
								href="/contact"
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
