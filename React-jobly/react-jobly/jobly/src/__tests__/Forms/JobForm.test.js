import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobForm from "../Form/JobForm";

describe("JobForm", () => {
    const mockOnAddJob = jest.fn(); // Mock the onAddJob function

    it("should call onAddJob with correct form data on submission", async () => {
        render(<JobForm onAddJob={mockOnAddJob} />); // Render the component

        const jobData = {
            title: "Software Engineer",
            salary: 100000,
            equity: 0.1
        };

        // Fill in the form fields
        fireEvent.change(screen.getByLabelText(/job title/i), { target: { value: jobData.title } });
        fireEvent.change(screen.getByLabelText(/job salary/i), { target: { value: jobData.salary } });
        fireEvent.change(screen.getByLabelText(/job equity/i), { target: { value: jobData.equity } });

        // Submit the form
        fireEvent.click(screen.getByText(/add job/i));

        // Check if onAddJob was called with the correct arguments
        await waitFor(() => {
            expect(mockOnAddJob).toHaveBeenCalledWith(jobData);
        });
    });

    it("should clear the form fields after submission", async () => {
        render(<JobForm onAddJob={mockOnAddJob} />); // Render the component

        const jobData = {
            title: "Software Engineer",
            salary: 100000,
            equity: 0.1
        };

        // Fill in the form fields
        fireEvent.change(screen.getByLabelText(/job title/i), { target: { value: jobData.title } });
        fireEvent.change(screen.getByLabelText(/job salary/i), { target: { value: jobData.salary } });
        fireEvent.change(screen.getByLabelText(/job equity/i), { target: { value: jobData.equity } });

        // Submit the form
        fireEvent.click(screen.getByText(/add job/i));

        // Check if the form fields are cleared
        await waitFor(() => {
            expect({
                title: screen.getByLabelText(/job title/i).value,
                salary: screen.getByLabelText(/job salary/i).value,
                equity: screen.getByLabelText(/job equity/i).value,
            }).toEqual({
                title: "",
                salary: "",
                equity: ""
            });
        });
    });
});