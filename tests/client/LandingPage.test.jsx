import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LandingPage from '../../client/pages/LandingPage/LandingPage'

describe("Tests for Landing Page", () => {
    test("loads and displays page", async () => {
        render(<LandingPage url="/" />);
        const landingPage = screen.getByTestId("landing-1");
        expect(landingPage).toBeInTheDocument();
    });
});