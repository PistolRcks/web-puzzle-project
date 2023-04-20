import {render, screen} from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { PuzzleNavBar } from "../../client/components/PuzzleNavBar/PuzzleNavBar";
import { BrowserRouter } from "react-router-dom";
import Puzzle1Page from "../../client/pages/Puzzle1Page/Puzzle1Page";

jest.mock("../../server/api/listPuzzles", () => {
  return {
    listPuzzles: jest.fn((req, res) => { return res.status(200).send({puzzles: [{puzzle_id: 1, title: "title", description: "description"}]}) })
  }
});

describe("Tests for Puzzle 1 Page", () => {
  const { location } = window;

  // Mock axios and the endpoints used in the Puzzle1Page component
  const mock = new MockAdapter(axios);
  mock.onPost("/api/userPuzzleMeta").reply(400);
  mock.onGet("/api/listPuzzles").reply(200, { 
    puzzles: [ { description: "description" } ]
  });

  beforeAll(() => {
    delete window.location;
    window.location = { reload: jest.fn() };
    jest.spyOn(console, "error").mockImplementation();
    jest.spyOn(console, "log").mockImplementation();
    window.alert = jest.fn().mockImplementation();
  });
  afterAll(() => {
    window.location = location;

  });
  test("Checks for Puzzle Nav Bar", () => {
    const { baseElement } = render(
      <PuzzleNavBar puzzleNum={1} puzzleDesc={"desc"}/>, { wrapper: BrowserRouter }
    );
    expect(baseElement.outerHTML).toContain("Puzzle 1");
  });
  test("Checks for Home nav link in Nav Bar", () => {
    const { baseElement } = render(
        <PuzzleNavBar />, { wrapper: BrowserRouter }
      );        
    expect(baseElement.outerHTML).toContain("Home");
  });
  test("Checks for Puzzle Selection Page nav link in Nav Bar", () => {
    const { baseElement } = render(
        <PuzzleNavBar />, { wrapper: BrowserRouter }
      );
    expect(baseElement.outerHTML).toContain("Puzzle Selection Page");
  });
  test("Checks for User Profile nav link in Nav Bar", () => {
    const { baseElement } = render(
      <PuzzleNavBar />, { wrapper: BrowserRouter }
    );
    expect(baseElement.outerHTML).toContain("User Profile");
  });
  test("Checks for Puzzle Description modal link in Nav Bar", () => {
    const { baseElement } = render(
      <PuzzleNavBar />, { wrapper: BrowserRouter }
    );
    expect(baseElement.outerHTML).toContain("Puzzle Description");
  });
  test("Checks for Page Title", () => {
    const { baseElement } = render(
        <Puzzle1Page />, { wrapper: BrowserRouter }
    );
    expect(baseElement.outerHTML).toContain("How to Photoshop like a Pro");
  });
  test("Checks for top right buttons", () => {
    const { baseElement } = render(
      <Puzzle1Page />, { wrapper: BrowserRouter }
    );       
    expect(baseElement.outerHTML).toContain("Tutorial");
    expect(baseElement.outerHTML).toContain("Software");
    expect(baseElement.outerHTML).toContain("Tips");
  });
  test("Checks for left buttons", () => {
    const { baseElement } = render(
      <Puzzle1Page />, { wrapper: BrowserRouter }
    );
    expect(baseElement.outerHTML).toContain("Ideas");
    expect(baseElement.outerHTML).toContain("FAQs");
    expect(baseElement.outerHTML).toContain("About");
    expect(baseElement.outerHTML).toContain("Contact Us");
    expect(baseElement.outerHTML).toContain("Help");

  });
  test("Checks Contact Us button is disabled", () => {
    render(
      <Puzzle1Page />, { wrapper: BrowserRouter }
    );
    const contactButton = screen.getByTestId("contact-us");
    expect(contactButton).toBeDisabled();
  });
  test("Checks for Tooltip on click me button", () => {
    const { baseElement } = render(
      <Puzzle1Page />, { wrapper: BrowserRouter }
    );
    const clickMeButton = screen.getByTestId("click-me");
    userEvent.click(clickMeButton);
    expect(baseElement.outerHTML).toContain("Click on the word Tips");
  });
  test("Checks for secret word in console", () => {
    const consoleSpy = jest.spyOn(global.console, "log");

    render(
      <Puzzle1Page />, { wrapper: BrowserRouter }
    );
    const clickMeButton = screen.getByTestId("click-me");
    userEvent.click(clickMeButton);
    const tipsButton = screen.getByTestId("tips");
    userEvent.click(tipsButton);
    expect(consoleSpy).toBeCalledWith("Click on Contact Us");
  });
  test("Checks Contact Us is enabled when it should be", () => {
    render(
      <Puzzle1Page />, { wrapper: BrowserRouter }
    );
    const clickMeButton = screen.getByTestId("click-me");
    userEvent.click(clickMeButton);
    const tipsButton = screen.getByTestId("tips");
    userEvent.click(tipsButton);
    const closeButton = screen.getByTestId("close-hint-modal");
    userEvent.click(closeButton);
    const contactButton = screen.getByTestId("contact-us");
    expect(contactButton).toBeEnabled();
  });
  test("Checks tips button is disabled", () => {
    render(
      <Puzzle1Page />, { wrapper: BrowserRouter }
    );
    const tipsButton = screen.getByTestId("tips");
    expect(tipsButton).toBeDisabled();
  });
  test("Checks Restart Puzzle button in completed puzzle modal refreshes the page", () => {
    render(
      <Puzzle1Page />, { wrapper: BrowserRouter }
    );
    const clickMeButton = screen.getByTestId("click-me");
    userEvent.click(clickMeButton);
    const tipsButton = screen.getByTestId("tips");
    userEvent.click(tipsButton);
    const closeButton = screen.getByTestId("close-hint-modal");
    userEvent.click(closeButton);
    const contactButton = screen.getByTestId("contact-us");
    userEvent.click(contactButton);
    const restartButton = screen.getByTestId("restart-puzzle");
    userEvent.click(restartButton);

    expect(window.location.reload).toHaveBeenCalled();
  });

});

