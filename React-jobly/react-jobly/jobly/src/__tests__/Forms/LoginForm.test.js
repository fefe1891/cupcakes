import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";

describe("LoginForm", () => {
    const mockOnLogin = jest.fn(); // Mock the onLogin function

    it("should call onLogin with correct credentials on form submission", async () => {
        render(<LoginForm onLogin={mockOnLogin} />);

        const username = "testuser";
        const password = "password123";

        // Fill in the form fields
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: username } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: password } });

        // Submit the form
        fireEvent.click(screen.getByText(/log in/i));

        // Check if onLogin was called with the correct arguments
        await waitFor(() => {
            expect(mockOnLogin).toHaveBeenCalledWith(username, password);
        });
    });

    it("should display an error message on failed login", async () => {
        mockOnLogin.mockRejectedValue(new Error("Invalid username or password.")); // Mock a failed login

        render(<LoginForm onLogin={mockOnLogin} />);

        const username = "testuser";
        const password = "wrongpassword";

        // Fill in the form fields
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: username } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: password } });

        // Submit the form
        fireEvent.click(screen.getByText(/log in/i));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
        });
    });

    it("should not display an error message when login is successful", async () => {
        mockOnLogin.mockResolvedValue(); // Mock a successful login

        render(<LoginForm onLogin={mockOnLogin} />);

        const username = "testuser";
        const password = "password123";

        // Fill in the form fields
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: username } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: password } });

        // Submit form
        fireEvent.click(screen.getByText(/log in/i));

        // Wait for the onLogin to be called and check that no error message is displayed
        await waitFor(() => {
            expect(screen.queryByText(/Invalid username or password./i)).not.toBeInTheDocument();
        });
    });
});