import React, { useState } from "react";

function FilterOption({ onFilterChange }) {
    const [jobType, setJobType] = useState("");
    const [location, setLocation] = useState("");

    const handleFilterChange = () => {
        onFilterChange({ jobType, location });
    };

    return (
        <div className="FilterOption">
            <h2>Filter Options</h2>
            <div>
                <label>
                    Job Type:
                    <select
                        value={jobType}
                        onChange={(e) => {
                            setJobType(e.target.value);
                            handleFilterChange();
                        }}
                    >
                        <option value="">All</option>
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="internship">Internship</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Location:
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            handleFilterChange();
                        }}
                        placeholder="Enter location"
                    />
                </label>
            </div>
        </div>
    );
}

export default FilterOption;
