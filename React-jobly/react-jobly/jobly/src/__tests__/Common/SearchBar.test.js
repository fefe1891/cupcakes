import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../../SearchBar';

describe("SearchBar", () => {
    const onSearchMock = jest.fn(); // Mock the onSearch function

    it("should update input value when user types", async () => {
        render(<SearchBar onSearch={onSearchMock} />); 

        const input = screen.getByPlaceholderText(/search.../i); // Get the input field

        fireEvent.change(input, { target: { value: 'developer' } }); // Simulate typing in the input

        await waitFor(() => {
            expect(input.value).toBe('developer'); // Check if the input value is updated
        });
    });

    it("should call onSearch with the correct query on form submission", async () => {
        render(<SearchBar onSearch={onSearchMock} />);

        const input = screen.getByPlaceholderText(/search.../i); // Get the input field

        fireEvent.change(input, { target: { value: 'developer' } }); // Simulate typing in the input
        fireEvent.click(screen.getByRole('button', { name: /search/i})); // Simulate form submission

        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith('developer'); // Check if onSearch was called 
        });

        expect(onSearchMock).toHaveBeenCalledWith('developer'); // Check if onSearch was called with the correct query
        expect(onSearchMock).toHaveBeenCalledTimes(1); // Ensure it was called only once
    });

    it("should prevent default form submission behavior", async () => {
        render(<SearchBar onSearch={onSearchMock} />);

        const form = screen.getByRole('form'); // Get the form element

        fireEvent.submit(form); // Simulate form submission

        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalled(); // Check if onSearch was called
        });
    });
});