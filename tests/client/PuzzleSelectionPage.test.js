import { act, render, screen } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import PuzzleSelectionPage from "../../client/pages/PuzzleSelectionPage/PuzzleSelectionPage";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  Link: (props) => {
    console.log(props.to);
    return <a {...props} href={props.to} />;
  },
}));

describe("Tests for the Puzzle Selection Page", () => {
  const puzzleInfo = {
    userID: 1,
    username: 'alice',
    pfpSeed: 1,
    pfpBackgroundColor: "000000",
    puzzles: [
      {
        puzzle_id: 1,
        title: "Title",
        description: "Description"
      },
      {
        puzzle_id: 2,
        title: "Title 2",
        description: "Description 2"
      }
    ],
    userPuzzleCompletion: [
      {
        progress: 1,
        puzzle_id: 1
      }
    ]
  };

  // Mock axios and the response for the "/api/listPuzzles" endpoint
  const mock = new MockAdapter(axios);
  mock.onGet("/api/listPuzzles").reply(200, puzzleInfo);

  beforeAll(() => {
    window.alert = jest.fn();
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  it("Checks for Puzzle Selection header", () => {
    const { baseElement } = render(<PuzzleSelectionPage />);
    expect(baseElement.outerHTML).toContain(
      "Puzzle Selection"
    );
  });

  it("Checks for Puzzle buttons", async () => {
    await act(() => {
      render(<PuzzleSelectionPage />, { wrapper: BrowserRouter });
    });

    expect(screen.getByTestId("PuzzleSelectionPage").outerHTML).toContain("Puzzle 1 - Title");
    expect(screen.getByTestId("PuzzleSelectionPage").outerHTML).toContain("Puzzle 2 - Title 2");
  });

  it("Checks for not Puzzle 2 button", () => {
    const { baseElement } = render(<PuzzleSelectionPage />, { wrapper: BrowserRouter });
    expect(
      baseElement.outerHTML.includes("Puzzle 16509")
    ).toBe(false);
  });

  it("Checks for Log Out button", () => {
    const { baseElement } = render(<PuzzleSelectionPage />, { wrapper: BrowserRouter });
    expect(baseElement.outerHTML).toContain("Log Out");
  });
});
