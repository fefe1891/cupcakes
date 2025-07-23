import React, { useState } from "react";

function ApplyForm({ jobId, onApply }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        resume: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call the onApply function passed as a prop with the form data
        onApply(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Apply for Job</h2>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="resume">Resume:</label>
                <textarea
                    id="resume"
                    name="resume"
                    value={formData.resume}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit Application</button>
        </form>
    );
}

export default ApplyForm;