import { render, screen } from "@testing-library/react";

import PuzzleSelectionPage from "../../client/pages/PuzzleSelectionPage/PuzzleSelectionPage";

jest.mock("react-router-dom", () => ({
  Link: (props) => {
    console.log(props.to);
    return <a {...props} href={props.to} />;
  },
}));

describe("Tests for the Puzzle Selection Page", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  it("Checks for Puzzle Selection header", () => {
    const puzzleSelectionPage = render(<PuzzleSelectionPage />);
    expect(puzzleSelectionPage.baseElement.outerHTML).toContain(
      "Puzzle Selection"
    );
  });

  it("Checks for Puzzle 1 button", () => {
    const puzzleSelectionPage = render(<PuzzleSelectionPage />);
    expect(puzzleSelectionPage.baseElement.outerHTML).toContain("Puzzle 1");
  });

  it("Checks for not Puzzle 2 button", () => {
    const puzzleSelectionPage = render(<PuzzleSelectionPage />);
    expect(
      puzzleSelectionPage.baseElement.outerHTML.includes("Puzzle 16509")
    ).toBe(false);
  });
  it("Checks for Log Out button", () => {
    const puzzleSelectionPage = render(<PuzzleSelectionPage />);
    expect(puzzleSelectionPage.baseElement.outerHTML).toContain("Log Out");
  });
});
