import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SaveJobButton from "./SaveJobButton";
import axios from "axios";

jest.mock("axios");

describe("SaveJobButton", () => {
    const jobId = "12345";

    it("should display loading message when saving", () => {
        render(<SaveJobButton jobId={jobId} />);

        // Click the button to trigger the save job action
        const button = screen.getByRole("button", { name: /Save Job/i });
        button.click();

        expect(screen.getByRole("button", { name: /Saving.../i })).toBeInTheDocument();
    });

    it("should display 'Job Saved' after successful save", async () => {
        axios.post.mockResolvedValue({ data: { applied: true } }); // Mock successful API response

        render(<SaveJobButton jobId={jobId} />);

        // Click the button to triger the save job action
        const button = screen.getByRole("button", { name: /Save Job/i });
        button.click();

        // Wait for the button text to change to 'Job Saved'
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Job Saved/i })).toBeInTheDocument();
        });
    });

    it("should display an error message on failed save", async () => {
        axios.post.mockRejectedValue(new Error("Error saving job.")); // Mock an error response

        render(<SaveJobButton jobId={jobId} />);

        // Click the button to trigger the save job action
        const button = screen.getByRole("button", { name: /Save Job/i });
        button.click();

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error saving job. Please try again./i)).toBeInTheDocument();
        });
    });

    it("should  disable the button if the job is already saved", async () => {
        axios.post.mockResolvedValue({ data: { applied: true } }); // Mock successful API response

        render(<SaveJobButton jobId={jobId} />);

        // Click the button to trigger the save job action
        const button = screen.getByRole("button", { name: /Save Job/i });
        button.click();

        // Wait for the button to be disabled
        await waitFor(() => {
            expect(button).toBeDisabled();
        });
    });
});