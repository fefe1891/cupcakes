import React, { useState } from "react";

function CompanyFilter({ onFilterChange }) {
    const [industry, setIndustry] = useState("");
    const [size, setSize] = useState("");

    const handleFilterChange = () => {
        onFilterChange({ industry, size });
    };

    return (
        <div className="CompanyFilter">
            <h2>Filter Companies</h2>
            <div>
                <label>
                    Industry:
                    <input type="text"
                        value={industry}
                        onChange={(e) => {
                            setIndustry(e.target.value);
                            handleFilterChange();
                        }}
                        placeholder="Enter industry"
                    />
                </label>
            </div>
            <div>
                <label>
                    Company Size:
                    <select
                        value={size}
                        onChange={(e) => {
                            setSize(e.target.value)
                            handleFilterChange();
                        }}
                    >
                        <option value="">All</option>
                        <option value="small"></option>
                        <option value="medium"></option>
                        <option value="large"></option>
                    </select>
                </label>
            </div>
        </div>
    );
}

export default CompanyFilter;