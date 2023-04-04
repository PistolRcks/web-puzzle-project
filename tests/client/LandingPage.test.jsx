import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LandingPage from "../../client/pages/LandingPage/LandingPage";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

describe("Tests for Landing Page", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });
  test("Loads and Displays Landing Page", async () => {
    render(<BrowserRouter><GoogleOAuthProvider><LandingPage url="/" /></GoogleOAuthProvider></BrowserRouter>);
    const landingPage = screen.getByTestId("landing-1");
    expect(landingPage).toBeInTheDocument();
  });
  test("Checks for Landing Page Header", () => {
    const wrapper = render(<BrowserRouter><GoogleOAuthProvider><LandingPage /></GoogleOAuthProvider></BrowserRouter>);
    expect(wrapper.baseElement.outerHTML).toContain(
      "Welcome to our Web Puzzle"
    );
  });
  test("Checks for Log In Button", () => {
    const wrapper = render(<BrowserRouter><GoogleOAuthProvider><LandingPage /></GoogleOAuthProvider></BrowserRouter>);
    expect(wrapper.baseElement.outerHTML).toContain("Log In");
  });
});
