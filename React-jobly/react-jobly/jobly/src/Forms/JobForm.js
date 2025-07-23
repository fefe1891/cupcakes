import React, { useState } from "react";

function JobForm({ onAddJob }) {
    const [title, setTitle] = useState("");
    const [salary, setSalary] = useState("");
    const [equity, setEquity] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newJob = { title, salary, equity };
        onAddJob(newJob);
        setTitle("");
        setSalary("");
        setEquity("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Job Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Salary:</label>
                <label>Salary:</label>
                <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Equity:</label>
                <input
                    type="number"
                    step="0.01"
                    value={equity}
                    onChange={(e) => setEquity(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Job</button>
        </form>
    );
}

export default JobForm;