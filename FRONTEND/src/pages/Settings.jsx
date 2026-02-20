import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile, getUserProfile } from "../utils/userDataApi";

export default function Settings() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        birthday: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        gender: "",
        school: "",
        board: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        const loadUserData = async () => {
            try {
                setLoading(true);
                const profile = await getUserProfile(user.uid);
                setFormData({
                    name: profile.name || "",
                    email: profile.email || "",
                    birthday: profile.birthday || "",
                    phone: profile.phone || "",
                    address: profile.address || "",
                    city: profile.city || "",
                    state: profile.state || "",
                    zipCode: profile.zipCode || "",
                    gender: profile.gender || "",
                    school: profile.school || "",
                    board: profile.board || "",
                });
                setLoading(false);
            } catch (err) {
                console.error("Error loading profile:", err);
                setError("Failed to load profile data");
                setLoading(false);
            }
        };

        loadUserData();
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await updateUserProfile(user.uid, formData);
            setSuccess("✓ Profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="flex-1">
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-700"></div>
                        <p className="mt-4 text-gray-600">Loading settings...</p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="flex-1">
            <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="text-amber-600 text-4xl">⚙</span>Account Settings
                        </h1>
                        <p className="text-lg text-gray-600">
                            Manage your profile information and preferences
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Birthday
                                        </label>
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                            placeholder="123 Main Street"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                                placeholder="New York"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State/Province
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                                placeholder="NY"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Educational Information Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Educational Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            School/College
                                        </label>
                                        <input
                                            type="text"
                                            name="school"
                                            value={formData.school}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                            placeholder="ABC School"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Board
                                        </label>
                                        <select
                                            name="board"
                                            value={formData.board}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                        >
                                            <option value="">Select Board</option>
                                            <option value="CBSE">CBSE</option>
                                            <option value="ICSE">ICSE</option>
                                            <option value="State Board">State Board</option>
                                            <option value="International">International</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 px-6 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Save Changes
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/profile")}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
