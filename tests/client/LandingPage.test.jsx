import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LandingPage from "../../client/pages/LandingPage/LandingPage";

describe("Tests for Landing Page", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });
  test("Loads and Displays Landing Page", async () => {
    render(<LandingPage url="/" />);
    const landingPage = screen.getByTestId("landing-1");
    expect(landingPage).toBeInTheDocument();
  });
  test("Checks for Landing Page Header", () => {
    const wrapper = render(<LandingPage />);
    expect(wrapper.baseElement.outerHTML).toContain(
      "Welcome to our Web Puzzle"
    );
  });
  test("Checks for Log In Button", () => {
    const wrapper = render(<LandingPage />);
    expect(wrapper.baseElement.outerHTML).toContain("Log In");
  });
});
