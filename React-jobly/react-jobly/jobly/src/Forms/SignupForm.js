import React, { useState } from "react";

function SignupForm({ onSignup }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        accountType: "jobSeeker" // Default to job seeker
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            await onSignup(formData);
        } catch (err) {
            setError("Error signing up. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            {error && <p>{error}</p>}
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
            />
            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <div>
                <label>
                    <input
                        type="radio"
                        name="accountType"
                        value="jobSeeker"
                        checked={formData.accountType === "jobSeeker"}
                        onChange={handleChange}
                    />
                    Job Seeker
                </label>
                <label>
                    <input
                        type="radio"
                        name="accountType"
                        value="Employer"
                        checked={formData.accountType === "employer"}
                        onChange={handleChange}
                    />
                    Employer
                </label>
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignupForm;