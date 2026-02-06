import { useState } from "react";
import { FaDiscord, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
	const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		setFormData({ name: "", email: "", subject: "", message: "" });
		alert("Thank you for your message! We'll get back to you soon.");
	};

	return (
		<main className="overflow-hidden">
			<section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-amber-50 to-white">
				<div className="container mx-auto px-3 sm:px-4">
					<div className="max-w-5xl mx-auto">
						<div className="mb-12 sm:mb-16 md:mb-20 space-y-2 sm:space-y-4 text-center">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
								<span className="text-amber-700 font-semibold">✉️ CONTACT</span>
							</div>
							<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900">Get In Touch</h1>
							<p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
								We'd love to hear from you. Send us a message and we'll respond as soon as possible.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-16">
							<div className="space-y-4 sm:space-y-6">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Send us a Message</h2>
								<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
										<input 
											type="text" 
											name="name" 
											value={formData.name} 
											onChange={handleChange} 
											required 
											className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none transition-all text-sm sm:text-base" 
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
										<input 
											type="email" 
											name="email" 
											value={formData.email} 
											onChange={handleChange} 
											required 
											className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none transition-all text-sm sm:text-base" 
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
										<input 
											type="text" 
											name="subject" 
											value={formData.subject} 
											onChange={handleChange} 
											required 
											className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none transition-all text-sm sm:text-base" 
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
										<textarea 
											name="message" 
											value={formData.message} 
											onChange={handleChange} 
											rows="5" 
											required 
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none transition-all text-sm sm:text-base resize-none"
										></textarea>
									</div>
									<button 
										type="submit" 
										className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
									>
										Send Message
									</button>
								</form>
							</div>

							<div className="space-y-6 sm:space-y-8">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Other Ways to Reach Us</h2>
								<div className="space-y-4 sm:space-y-6">
									<div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 hover:shadow-lg hover:border-amber-200 transition-all">
										<div className="flex gap-4">
											<FaEnvelope className="text-amber-700 text-2xl sm:text-3xl flex-shrink-0 mt-0.5" />
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h3>
												<p className="text-gray-600 text-xs sm:text-sm mt-1 break-all">teamispekka@gmail.com</p>
											</div>
										</div>
									</div>

									<div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 hover:shadow-lg hover:border-amber-200 transition-all">
										<div className="flex gap-4">
											<FaPhone className="text-amber-700 text-2xl sm:text-3xl flex-shrink-0 mt-0.5" />
											<div className="flex-1">
												<h3 className="font-semibold text-gray-900 text-sm sm:text-base">Phone</h3>
												<p className="text-gray-600 text-xs sm:text-sm mt-1">+94 (767) 524-003</p>
											</div>
										</div>
									</div>

									<div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 hover:shadow-lg hover:border-amber-200 transition-all">
										<div className="flex gap-4">
											<FaMapMarkerAlt className="text-amber-700 text-2xl sm:text-3xl flex-shrink-0 mt-0.5" />
											<div className="flex-1">
												<h3 className="font-semibold text-gray-900 text-sm sm:text-base">Address</h3>
												<p className="text-gray-600 text-xs sm:text-sm mt-1">
													Galle Main Street<br />Galle, SL 80000
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mt-6 sm:mt-8">
									<h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-4">Follow Us</h3>
									<div className="flex gap-4">
										<a href="https://discord.gg/Sb4ESssy" className="p-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all"><FaDiscord size={20} /></a>
										<a href="https://www.instagram.com/team_p.e.k.k.a/" className="p-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all"><FaInstagram size={20} /></a>
										<a href="https://www.linkedin.com/in/team-p-e-k-k-a-7193833aa/" className="p-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all"><FaLinkedin size={20} /></a>
									</div>
								</div>
							</div>
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
							We're Ready to Help
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-white/90">
							Get in touch with our team and discover how Study Planner can transform your learning.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
							<a
								href="/features"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all text-sm sm:text-base"
							>
								View Features
							</a>
							<a
								href="/subscription"
								className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 text-sm sm:text-base hover:bg-white/30 transition-all"
							>
								Get Started
							</a>
						</div>
						<p className="text-white/80 text-xs sm:text-sm">14-day free trial • No credit card required</p>
					</div>
				</div>
			</section>
		</main>
	);
}
