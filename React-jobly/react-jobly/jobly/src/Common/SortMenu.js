import React from 'react';

function SortMenu({ onSort }) {
    const handleSortChange = (e) => {
        onSort(e.target.value); // Call the onSort function passed as a prop with the selected value
    };

    return (
        <div>
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" onChange={handleSortChange}>
                <option value="date">Date Posted</option>
                <option value="title">Job Title</option>
                <option value="company">Company Name</option>
            </select>
        </div>
    )
}

export default SortMenu;