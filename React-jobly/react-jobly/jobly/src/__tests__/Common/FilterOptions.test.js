import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterOption from "../FilterOption";

describe("FilterOption", () => {
    const mockOnFilterChange = jest.fn();

    it("should call onFilterChange with correct job typed when job type is changed", () => {
        render(<FilterOption onFilterChange={mockOnFilterChange} />);
        // Change the job type to full-time
        fireEvent.change(screen.getByLabelText(/job type/i), { target: { value: "full-time" } });

        // Check if onFilterChange was called with the correct arguments
        expect(mockOnFilterChange).toHaveBeenCalledWith({ jobType: "full-time", location: "" });
    });

    it("should call onFilterChange with correct location when location input is changed", () => {
        render(<FilterOption onFilterChange={mockOnFilterChange} />);
        // Change the location input
        fireEvent.change(screen.getByPlaceholderText(/enter location/i), {target: { value: "New York" } });

        // Check if onFilterChange was called with the correct arguments
        expect(mockOnFilterChange).toHaveBeenCalledWith({ jobType: "", location: "New York" });
    });

    it("should call onFilterChange with correct job type and location when both are change", () => {
        render(<FilterOption onFilterChange={mockOnFilterChange} />);
        // Change the job type to part-time
        fireEvent.change(screen.getByLabelText(/job type/i), { target: { value: "part-time" } });
        // Change the location input
        fireEvent.change(screen.getByPlaceholderText(/enter location/i), { target: { value: "San Francisco" } });

        // Check if onFilterChange was called with the correct arguments
        expect(mockOnFilterChange).toHaveBeenCalledWith({ jobType: "part-time", location: "San Francisco" });
    });
});