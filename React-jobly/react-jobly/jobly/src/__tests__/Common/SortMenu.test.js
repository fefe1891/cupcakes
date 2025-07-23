import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortMenu from "../../SortMenu"; 

describe("SortMenu", () => {
    const onSortMock = jest.fn(); // Mock function to track calls

    it("should render the sort menu with default options", () => {
        render(<SortMenu onSort={onSortMock} />);

        // Check if the sort label is in the document
        expect(screen.getByLabelText(/Sort by:/i)).toBeInTheDocument();

        // Check if the select element has the correct options
        const select = screen.getByRole("combobox", { name: /Sort by:/i });
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue("date"); // Default value should be date
        expect(screen.getByText(/Date Posted/i)).toBeInTheDocument();
        expect(screen.getByText(/Job Title/i)).toBeInTheDocument();
        expect(screen.getByText(/Company Name/i)).toBeInTheDocument();
    });

    it("should call onSort with the selected value when the sort option changes", () => {
        render(<SortMenu onSort={onSortMock} />); 

        // Change the sort option to "title"
        const select = screen.getByRole("combobox", { name: /Sort by:/i });
        fireEvent.change(select, { target: { value: "title" } });

        // Check if onSort was called with the correct argument
        expect(onSortMock).toHaveBeenCalledWith("title");
    });

    it("should call onSort with the selected value when the sort option changes to 'company'", () => {
        render(<SortMenu onSort={mockOnSort} />);

        // Change the sort option to "company"
        const select = screen.getByRole("combobox", { name: /Sort by:/i });
        fireEvent.change(select, { target: { value: "company" } });

        // Check if onSort was called with the correct argument
        expect(onSortMock).toHaveBeenCalledWith("company");
    });
});