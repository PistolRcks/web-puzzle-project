import {render, screen, getByTestId} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Puzzle1Page from "../../client/pages/Puzzle1Page/Puzzle1Page";

jest.mock("../../server/api/listPuzzles", () => {
  return {
    listPuzzles: jest.fn((req, res) => { return res.status(200).send({puzzles: [{puzzle_id: 1, title: "title", description: "description"}]}) })
  }
});

describe("Tests for Puzzle 1 Page", () => {
  const { location } = window;
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
  test("Checks for Page Title", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
    );
    expect(wrapper.baseElement.outerHTML).toContain("How to Photoshop like a Pro");
  });
  test("Checks for top right buttons", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
      );        
    expect(wrapper.baseElement.outerHTML).toContain("Tutorial");
    expect(wrapper.baseElement.outerHTML).toContain("Software");
    expect(wrapper.baseElement.outerHTML).toContain("Tips");
  });
  test("Checks for left buttons", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
      );
    expect(wrapper.baseElement.outerHTML).toContain("Ideas");
    expect(wrapper.baseElement.outerHTML).toContain("FAQs");
    expect(wrapper.baseElement.outerHTML).toContain("About");
    expect(wrapper.baseElement.outerHTML).toContain("Contact Us");
    expect(wrapper.baseElement.outerHTML).toContain("Help");

  });
  test("Checks Contact Us button is disabled", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
      );
    const contactButton = screen.getByTestId("contact-us");
    expect(contactButton).toBeDisabled();
  });
  test("Checks for Tooltip on click me button", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
      );
    const clickMeButton = screen.getByTestId("click-me");
    userEvent.click(clickMeButton);
    expect(wrapper.baseElement.outerHTML).toContain("Click on the word Tips");
  });
  test("Checks for secret word in console", () => {
    const consoleSpy = jest.spyOn(global.console, "log");
    const close = jest.fn();

    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page close={close}/>
      </BrowserRouter>
      );
    const clickMeButton = screen.getByTestId("click-me");
    userEvent.click(clickMeButton);
    const tipsButton = screen.getByTestId("tips");
    userEvent.click(tipsButton);
    expect(consoleSpy).toBeCalledWith("Click on Contact Us");
  });
  test("Checks Contact Us is enabled when it should be", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
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
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
      );
    const tipsButton = screen.getByTestId("tips");
    expect(tipsButton).toBeDisabled();
  });
  test("Checks Restart Puzzle button in completed puzzle modal refreshes the page", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
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

