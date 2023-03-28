import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { PuzzleHint } from '../../client/components/PuzzleHint/PuzzleHint'
import { BrowserRouter } from 'react-router-dom'

describe("Tests for Puzzle Hint Modal", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation();
    });
    test("Checks for ?", () => {
        const wrapper = render(
        <BrowserRouter>
            <PuzzleHint />
        </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("?");
    });
});