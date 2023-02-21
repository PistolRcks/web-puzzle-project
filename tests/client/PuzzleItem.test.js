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
      <PuzzleItem puzzle={{ puzzleID: 17, isCompleted: false }} />
    );
    expect(puzzleItem.baseElement.outerHTML).toContain("Puzzle 17");
  });
});
