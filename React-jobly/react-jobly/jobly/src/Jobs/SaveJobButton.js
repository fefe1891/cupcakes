import React, { useState } from "react";
import axios from "axios";

const SaveJobButton = ({ jobId }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSaveJob = async () => {
        setLoading(true);
        setError(null);

        try { 
            const response = await axios.post(`/users/${username}/jobs/${jobId}`, { state: "saved" });
            if (response.data.applied) {
                setIsSaved(true);
            }
        } catch (err) {
            setError("Error saving job. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <button disabled>Saving...</button>
            ) : (
                <button onClick={handleSaveJob} disabled={isSaved}>
                    {isSaved ? "Job Saved" : "Save Job"}
                </button>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default SaveJobButton;