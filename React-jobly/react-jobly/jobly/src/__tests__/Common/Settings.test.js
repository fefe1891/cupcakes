import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Settings from "../../Settings"; // Adjust the import path as necessary
import JoblyApi from "../../api/JoblyApi";

jest.mock("../../api/JoblyApi"); // Mock the JoblyApi module

describe("Settings", () => {
    const mockUser = {
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
    };

    const onUpdateMock = jest.fn();

    it("should display initial form values", () => {
        render(<Settings currentUser={mockUser } onUpdate={onUpdateMock} />);

        expect(screen.getByLabelText(/First Name:/i)).toHaveValue(mockUser.firstName);
        expect(screen.getByLabelText(/Last Name:/i)).toHaveValue(mockUser.lastName);
        expect(screen.getByLabelText(/Email:/i)).toHaveValue(mockUser.email);
    });

    it("should update user settings on form submission", async () => {
        const updateUser = {
            ...mockUser,
            firstName: "Updated",
            lastName: "User",
            email: "updated@example.com",
        };

        JoblyApi.updateUser.mockResolvedValue(updateUser); // Mock the API response

        render(<Settings currentUser ={mockUser } onUpdate={onUpdateMock} />);

        // Change the input values
        screen.getByLabelText(/First Name:/i).value = updatedUser.firstName;
        screen.getByLabelText(/Last Name:/i).value = updatedUser.lastName;
        screen.getByLabelText(/Email:/i).value = updatedUser.email;

        // Submit the form
        screen.getByRole("button", { name: /Update Settings/i }).click();

        // Wait for the onUpdate function to be called
        await waitFor(() => {
            expect(onUpdateMock).toHaveBeenCalledWith(updatedUser);
        });
    });

    it("should display an error message on failed update", async () => {
        const errorMessage = "Error updating settings.";
        JoblyApi.updateUser.mockRejectedValue(new Error(errorMessage)); // Mock an error response

        render(<Settings currentUser ={mockUser } onUpdate={onUpdateMock} />);

        // Submit the form
        screen.getByRole("button", { name: /Update Settings/i }).click();

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error updating settings:/i)).toBeInTheDocument();
        });
    });
});