import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "../SignupForm";

describe("SignupForm", () => {
    const mockOnSignup = jest.fn(); // Mock the onSignup function

    it("should call onSignup with correct form data on submission", async () => {
        render(<SignupForm onSignup={mockOnSignup} />);

        const formData = {
            username: "testuser",
            password: "password123",
            firstName: "Frank",
            lastName: "Doe",
            email: "frank.doe@example.com",
            accountType: "jobSeeker"
        };

        // Fill in the form fields
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: formData.username } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: formData.password } });
        fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: formData.firstName } });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: formData.lastName } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: formData.email } });

        // Select account type
        fireEvent.click(screen.getByLabelText(/job seeker/i)); // Select Job Seeker

        // Submit the form
        fireEvent.click(screen.getByText(/sign up/i));

        // Check if onSignup was called with the correct arguments
        await waitFor(() => {
            expect(mockOnSignup).toHaveBeenCalledWith(formData);
        });
    });

    it("should display an error message on failed signup", async () => {
        mockOnSignup.mockRejectedValue(new Error("Error signing up. Please try again.")); // Mock a failed signup

        render(<SignupForm onSignup={mockOnSignup} />);

        const formData = {
            username: "testuser",
            password: "password123",
            firstName: "Frank",
            lastName: "Devoro",
            email: "frank.devoro@example.com",
            accountType: "jobSeeker" // Include account type
        };

        // Fill in the form fields
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: formData.username } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: formData.password } });
        fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: formData.firstName } });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: formData.lastName } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: formData.email } });

        // Select account type
        fireEvent.click(screen.getByLabelText(/job seeker/i));

        // Submit the form
        fireEvent.click(screen.getByText(/sign up/i));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error signing up. Please try again./i)).toBeInTheDocument();
        });
    });

    it("should clear previous error messages on new submission", async () => {
        mockOnSignup.mockRejectedValue(new Error("Error signing up. Please try again.")); // Mock a failed signup

        render(<SignupForm onSignup={mockOnSignup} />);

        const formData = {
            username: "testuser",
            password: "password123",
            firstName: "Frank",
            lastName: "Frankly",
            email: "frank.frankly@example.com",
            accountType: "jobSeeker"
        };

        // Fill in the form fields
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: formData.username } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: formData.password } });
        fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: formData.firstName } });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: formData.lastName } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: formData.email } });

        // Select account type
        fireEvent.click(screen.getByLabelText(/job seeker/i));

        // Submit the form to trigger an error
        fireEvent.click(screen.getByText(/sign up/i));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error signing up. Please try again./i)).toBeInTheDocument();
        });

        // Clear the error by submitting again with the same data
        mockOnSignup.mockResolvedValue(); // Mock a successful signup

        fireEvent.click(screen.getByText(/sign up/i));

        // Check that the error message is cleared
        await waitFor(() => {
            expect(screen.queryByText(/Error signing up. Please try again./i)).not.toBeInTheDocument();
        });
    });
});