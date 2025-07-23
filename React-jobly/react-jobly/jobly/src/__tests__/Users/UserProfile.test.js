import React from "react";
import { render, screen } from "@testing-library/react";
import UserProfile from "./User Profile"; // Adjust the import path as necessary
import JoblyApi from "../api/JoblyApi";

// Mock the JoblyApi module
jest.mock("../api/JoblyApi");

describe("UserProfile", () => {
    const username = "testuser";

    beforeEach(() =>{
        jest.clearAllMocks(); // Clear any previous mock calls
    });

    it("should display loading message initially", () => {
        render(<UserProfile username={username} />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should display user profile information on successful fetch", async () => {
        // Mock the API response
        JoblyApi.getUser.mockResolvedValueOnce({
            username: "testuser",
            firstName: "Test",
            lastName: "User",
            email: "testuser@example.com",
            isAdmin: "false",
            jobs: [
                { id: 1, title: "Software Engineer", companyName: "Tech Co." },
                { id: 2, title: "Product Manager", companyName: "Business Inc." },
            ],
        });

        render(<UserProfile username={username} />);

        // Wait for the user profile to be displayed
        expect(await screen.findByText(/Test User's Profile/i)).toBeInTheDocument();
        expect(await screen.findByText(/Username:/i)).toBeInTheDocument();
        expect(await screen.findByText(/testuser/i)).toBeInTheDocument();
        expect(await screen.findByText(/Email:/i)).toBeInTheDocument();
        expect(await screen.findByText(/testuser@example.com/i)).toBeInTheDocument();
        expect(await screen.findByText(/Admin:/i)).toBeInTheDocument();
        expect(await screen.findByText(/No/i)).toBeInTheDocument();
        expect(await screen.findByText(/Applied to:/i)).toBeInTheDocument();
        expect(await screen.findByText(/Software Engineer at Tech Co./i)).toBeInTheDocument();
        expect(await screen.findByText(/Product Manager at Business Inc./i)).toBeInTheDocument();
    });

    it("should display error message on fetch failure", async () => {
        // Mock the API to throw an error
        JoblyApi.getUser.mockRejectedValueOnce(new Error("Failed to load user profile."));

        render(<UserProfile username={username} />);

        // Wait for the error message to be displayed
        expect(await screen.findByText(/Failed to load user profile./i)).toBeInTheDocument();
    });
});