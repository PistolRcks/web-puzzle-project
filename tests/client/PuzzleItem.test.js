import { render } from "@testing-library/react";

import { PuzzleItem } from "../../client/components/PuzzleItem/PuzzleItem";

jest.mock("react-router-dom", () => ({
  Link: (props) => {
    console.log(props.to);
    return <a {...props} href={props.to} />;
  },
}));

describe("Tests for the Puzzle Item component", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("Checks for button text", () => {
    const puzzleItem = render(
      <PuzzleItem puzzle={{ puzzle_id: 17, title: "title", description: "description" }} />
    );

    expect(puzzleItem.baseElement.outerHTML).toContain("Puzzle 17");
  });

  it("Checks for for uncompleted puzzle", () => {
    const puzzleItem = render(
      <PuzzleItem puzzle={{ puzzle_id: 17, title: "title", description: "description" }} puzzleCompletion={{progress: 0, puzzle_id: 1}} />
    );

    expect(puzzleItem.baseElement.outerHTML).toContain('alt="false"');
  });

  it("Checks for for completed puzzle", () => {
    const puzzleItem = render(
      <PuzzleItem puzzle={{ puzzle_id: 17, title: "title", description: "description" }} puzzleCompletion={{progress: 1, puzzle_id: 1}} />
    );

    expect(puzzleItem.baseElement.outerHTML).toContain('alt="true"');
  });
});
