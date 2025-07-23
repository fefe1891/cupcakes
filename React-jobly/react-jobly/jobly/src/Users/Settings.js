import React, { useState, useEffect } from 'react';
import JoblyApi from '../api/JoblyApi';

function Settings({ currentUser, onUpdate }) {
    const [formData, setFormData] = useState({
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        setFormData({
            username: currentUser.username,
            firstName: currentUser.firstName,
            lastName: currentUser.firstName,
            email: currentUser.email,
        });
    }, [currentUser]);

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
            await JoblyApi.updateUser(currentUser.username, formData);
            onUpdate(formData); // Call the onUpdate function passed as a prop
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div>
            <h1>Settings</h1>
            {error && <p>Error updating settings: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Settings</button>

            </form>
        </div>
    );
}

export default Settings;