import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { PuzzleHint } from '../../client/components/PuzzleHint/PuzzleHint'
import { BrowserRouter } from 'react-router-dom'

describe("Tests for Puzzle Hint Modal", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation();
    });
    test("Checks for ?", () => {
        const hintObj = [{title: "Opening the Console", steps: ["Right click on the screen and select Inspect", "Once the side bar is open on the right, select Console from the top tabs in the side bar."]}];
        const wrapper = render(
        <BrowserRouter>
            <PuzzleHint hints={hintObj}/>
        </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("?");
    });
});