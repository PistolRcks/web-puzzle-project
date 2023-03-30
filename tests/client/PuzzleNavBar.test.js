import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import { PuzzleNavBar } from '../../client/components/PuzzleNavBar/PuzzleNavBar'
import { BrowserRouter } from 'react-router-dom'

describe("Tests for Puzzle Nav Bar", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation();
    });
    test("Checks for Puzzle 1", () => {
        const wrapper = render(
        <BrowserRouter>
            <PuzzleNavBar />
        </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("Puzzle 1");
    });
    test("Checks for Home nav link", () => {
        const wrapper = render(
            <BrowserRouter>
                <PuzzleNavBar />
            </BrowserRouter>
            );        
        expect(wrapper.baseElement.outerHTML).toContain("Home");
    });
    test("Checks for Puzzle Selection Page nav link", () => {
        const wrapper = render(
            <BrowserRouter>
                <PuzzleNavBar />
            </BrowserRouter>
            );
        expect(wrapper.baseElement.outerHTML).toContain("Puzzle Selection Page");
    });
    test("Checks for User Profile nav link", () => {
        const wrapper = render(
            <BrowserRouter>
                <PuzzleNavBar />
            </BrowserRouter>
            );
        expect(wrapper.baseElement.outerHTML).toContain("User Profile");
    });
    test("Checks for Puzzle Description modal link", () => {
        const wrapper = render(
            <BrowserRouter>
                <PuzzleNavBar />
            </BrowserRouter>
            );
            expect(wrapper.baseElement.outerHTML).toContain("Puzzle Description");
    });

});

