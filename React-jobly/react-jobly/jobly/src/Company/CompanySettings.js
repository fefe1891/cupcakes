import React, { useState, useEffect } from 'react';
import JoblyApi from '../api/JoblyApi';

function CompanySettings({ currentCompany, onUpdate }) {
    const [formData, setFormData] = useState({
        name: currentCompany.name,
        description: currentCompany.description,
        numEmployees: currentCompany.numEmployees,
        logoUrl: currentCompany.logoUrl
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        setFormData({
            name: currentCompany.name,
            description: currentCompany.description,
            numEmployees: currentCompany.numEmployees,
            logoUrl: currentCompany.logoUrl
        });
    }, [currentCompany]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await JoblyApi.updateCompany(currentCompany.handle, formData);
            onUpdate(formData); // Call the onUpdate function passed as a prop
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div>
            <h1>Company Settings</h1>
            {error && <p>Error updating company settings: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Company Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Number of Employees:</label>
                    <input
                        type="number"
                        name="numEmployees"
                        value={formData.numEmployees}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>logo URL:</label>
                    <input
                        type="text"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Company Settings</button>
            </form>
        </div>
    );
}

export default CompanySettings;