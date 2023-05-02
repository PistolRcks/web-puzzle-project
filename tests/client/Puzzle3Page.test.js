import { render, screen } from "@testing-library/react";
import axios from "axios";
import React from "react";
import MockAdapter from "axios-mock-adapter";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Puzzle3Page from "../../client/pages/Puzzle3Page/Puzzle3Page";

jest.mock("../../server/api/listPuzzles", () => {
    return {
        listPuzzles: jest.fn((req, res) => { return res.status(200).send({ puzzles: [{ puzzle_id: 3, title: "title", description: "description" }] }) })
    }
});

describe("Tests for Puzzle 3 Page", () => {
    const { location } = window;

    // Mock axios and the endpoints used in the Puzzle3Page component
    const mock = new MockAdapter(axios);
    mock.onPost("/api/userPuzzleMeta").reply(400);
    mock.onGet("/api/listPuzzles").reply(200, {
        puzzles: [{ description: "description" }]
    });

    beforeAll(() => {
        delete window.location;
        window.location = { reload: jest.fn() };
        jest.spyOn(console, "error").mockImplementation();
        jest.spyOn(console, "log").mockImplementation();
        window.alert = jest.fn().mockImplementation();
    });
    afterAll(() => {
        window.location = location;

    });

    test("Check solution is saved to useState", () => {
        const setRand = jest.spyOn(React, "useState").mockImplementationOnce(random => [random, setRand])

        const { baseElement } = render(
            <Puzzle3Page />, { wrapper: BrowserRouter }
        );

        expect(setRand).toBeCalled();
    })

    test("Checks for Page Title", () => {
        const { baseElement } = render(
            <Puzzle3Page />, { wrapper: BrowserRouter }
        );
        expect(baseElement.outerHTML).toContain("New Puzzle Stumps Internet Browsers");
    });

    test("Check for author", () => {
        const { baseElement } = render(
            <Puzzle3Page />, { wrapper: BrowserRouter }
        );
        expect(baseElement.outerHTML).toContain("By: John")
    });

    test("Check to see if search button is disabled", () => {
        const { baseElement } = render(
            <Puzzle3Page />, { wrapper: BrowserRouter }
        );
        const searchButton = screen.getByTestId("search-button");
        expect(searchButton).toBeDisabled();
    });

    test("Check if tooltip renders on hover", async () => {
        const { baseElement } = render(
            <Puzzle3Page />, { wrapper: BrowserRouter }
        );
        const hoverMe = screen.getByTestId("hover-me");
        userEvent.hover(hoverMe);
        const tooltip = await screen.findByRole("tooltip")
        expect(tooltip).toBeInTheDocument();
    });

    test("Check search bar updates useState when typing", async () => {
        const handleChange = jest.spyOn(React, 'useState').mockImplementationOnce(formData => [formData, updateFormData]);

        render(<Puzzle3Page />, { wrapper: BrowserRouter });
        const searchBar = await screen.findByPlaceholderText("Search");
        userEvent.click(searchBar);
        userEvent.keyboard("a");
        expect(handleChange).toBeCalled();
    })

    test("Search button becomes enabled when solution typed", async () => {
        render(<Puzzle3Page />, { wrapper: BrowserRouter });
        const searchBar = await screen.findByPlaceholderText("Search");
        userEvent.click(searchBar);
        userEvent.keyboard("1234testing");
        const searchButton = await screen.findByTestId("search-button")
        expect(searchButton).not.toBeDisabled();
    })

    test("Checks Restart Puzzle button in completed puzzle modal refreshes the page", async () => {
        render(
            <Puzzle3Page />, { wrapper: BrowserRouter }
        );
        const searchBar = await screen.findByPlaceholderText("Search");
        userEvent.click(searchBar);
        userEvent.keyboard("1234testing");
        const searchButton = await screen.findByTestId("search-button");
        userEvent.click(searchButton)
        const restartButton = screen.getByTestId("restart-puzzle");
        userEvent.click(restartButton);

        expect(window.location.reload).toHaveBeenCalled();
    });
});
