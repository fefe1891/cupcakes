import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ApplyForm from "../../jobs/ApplyForm";

describe("ApplyForm", () => {
    const mockOnApply = jest.fn(); // Create a mock function for onApply

    it("should render the form correctly", () => {
        render(<ApplyForm jobId={1} onApply={mockOnApply} />);

        // Check if the form title is rendered
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Apply for Job");

        // Check if the input fields are rendered
        expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Resume:/i)).toBeInTheDocument();

        // Check if the submit button is rendered
        expect(screen.getByRole("button", { name: /Submit Application/i })).toBeInTheDocument();
    });

    it("should call onApply with form data when submitted", async () => {
        render(<ApplyForm jobId={1} onApply={mockOnApply} />);

        // Fill in the form fields
        fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "john@example.com" } });
        fireEvent.change(screen.getByLabelText(/Resume:/i), { target: { value: "My resume content" } });

        // Submit the form
        fireEvent.click(screen.getByRole("button", { name: /Submit Application/i }));

        // Check if onApply was called with the correct data
        expect(mockOnApply).toHaveBeenCalledWith({
            name: "John Doe",
            email: "john@example.com",
            resume: "My resume content",
        });
    });

    it("should display an error message if required fields are missing", async () => {
        render(<ApplyForm jobId={1} onApply={mockOnApply} />);

        // Submit the form without filling in the fields
        fireEvent.click(screen.getByRole("button", { name: /Submit Application/i }));

        // Check for error messages
        expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Resume is required/i)).toBeInTheDocument();

        // Ensure onApply is not called
        expect(mockOnApply).not.toHaveBeenCalled();
    });

    it("should display an error message if email is invalid", async () => {
        render(<ApplyForm jobId={1} onApply={mockOnApply} />);

        // Fill in the form fields with an invalid email
        fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "invalid-email" } });
        fireEvent.change(screen.getByLabelText(/Resume:/i), { target: { value: "My resume content" } });

        // Submit the form
        fireEvent.click(screen.getByRole("button", { name: /Submit Application/i }));

        // Check for error message
        expect(await screen.findByText(/Email is invalid/i)).toBeInTheDocument();

        // Ensure onApply is not called
        expect(mockOnApply).not.toHaveBeenCalled();
    });
});