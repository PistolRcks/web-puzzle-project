import {render} from "@testing-library/react";
import "@testing-library/jest-dom";
import { PuzzleNavBar } from "../../client/components/PuzzleNavBar/PuzzleNavBar";
import { BrowserRouter } from "react-router-dom";
import Puzzle1Page from "../../client/pages/Puzzle1Page/Puzzle1Page";

describe("Tests for Puzzle 1 Page", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation();
  });
  test("Checks for Puzzle Nav Bar", () => {
    const wrapper = render(
    <BrowserRouter>
      <PuzzleNavBar />
    </BrowserRouter>
    );
    expect(wrapper.baseElement.outerHTML).toContain("Puzzle 1");
  });
  test("Checks for Home nav link in Nav Bar", () => {
    const wrapper = render(
      <BrowserRouter>
        <PuzzleNavBar />
      </BrowserRouter>
      );        
    expect(wrapper.baseElement.outerHTML).toContain("Home");
  });
  test("Checks for Puzzle Selection Page nav link in Nav Bar", () => {
    const wrapper = render(
      <BrowserRouter>
        <PuzzleNavBar />
      </BrowserRouter>
      );
    expect(wrapper.baseElement.outerHTML).toContain("Puzzle Selection Page");
  });
  test("Checks for User Profile nav link in Nav Bar", () => {
    const wrapper = render(
      <BrowserRouter>
        <PuzzleNavBar />
      </BrowserRouter>
      );
    expect(wrapper.baseElement.outerHTML).toContain("User Profile");
  });
  test("Checks for Puzzle Description modal link in Nav Bar", () => {
    const wrapper = render(
      <BrowserRouter>
          <PuzzleNavBar />
      </BrowserRouter>
      );
    expect(wrapper.baseElement.outerHTML).toContain("Puzzle Description");
  });
  test("Checks for Page Title", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
    );
    expect(wrapper.baseElement.outerHTML).toContain("How to Photoshop like a Pro");
  });
  test("Checks for Top right buttons", () => {
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
  test("Checks for click me button", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
      );
    expect(wrapper.baseElement.outerHTML).toContain("Click me");
  });
  // test("Checks for Tooltip on click me button", () => {
  //   const wrapper = render(
  //     <BrowserRouter>
  //       <Puzzle1Page />
  //     </BrowserRouter>
  //     );
  //   expect(wrapper.baseElement.outerHTML).toContain("Click on the word Tips");
  // });
  // test('click', () => {
  //   render(
  //     <div>
  //       <label htmlFor="checkbox">Check</label>
  //       <input id="" type="checkbox" />
  //     </div>,
  //   )
  
  //   userEvent.click(screen.getByText('Click me'))
  //   expect(screen.getByLabelText('Click me')).toBe()
  // });
  // test("Checks for secret word in console", () => {
  //   const consoleSpy = jest.spyOn(global.console, "log");
  //   const wrapper = render(
  //     <BrowserRouter>
  //       <Puzzle1Page />
  //     </BrowserRouter>
  //     );
      
  //     wrapper.find("Click me").props().onClick();
  //     wrapper.find("Tips").props().onClick();
  //   expect(consoleSpy).toBeCalledWith("Here is your secret word: Hippo");
  //});
  test("Checks tips button is disabled", () => {
    const wrapper = render(
      <BrowserRouter>
        <Puzzle1Page />
      </BrowserRouter>
      );
    expect(wrapper.find("Tips")).toBeDisabled();
  });

});

