import {
  LogIn,
  checkPass,
  checkUsername,
} from "../../client/components/LogIn/LogIn";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

describe("Tests for Log In", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  test("Checks for button", () => {
    const wrapper = render(
      <BrowserRouter>
        <LogIn />
      </BrowserRouter>
    );
    expect(wrapper.baseElement.outerHTML).toContain("In");
  });
  test("Checks for username label", () => {
    const wrapper = render(
      <BrowserRouter>
        <LogIn />
      </BrowserRouter>
    );
    expect(wrapper.baseElement.outerHTML).toContain("Username:");
  });
  test("Checks for password label", () => {
    const wrapper = render(
      <BrowserRouter>
        <LogIn />
      </BrowserRouter>
    );
    expect(wrapper.baseElement.outerHTML).toContain("Password:");
  });
  test("checkUsername with accepted username", () => {
    expect(checkUsername("myUsername")).toBeTruthy();
  });
  test("checkUsername with username with special characters", () => {
    expect(!checkUsername("myUsername$")).toBeTruthy();
  });
  test("checkUsername with username that is too short", () => {
    expect(!checkUsername("user")).toBeTruthy();
  });
  test("checkPasswordRequirements with accepted password", () => {
    expect(checkPass("Password7")).toBeTruthy();
  });
  test("checkPasswordRequirements with password with special characters", () => {
    expect(!checkPass("Password7$")).toBeTruthy();
  });

  test("check to make sure typing in the form and submission works", () => {
    const consoleSpy = jest.spyOn(global.console, "log");
    const close = jest.fn();
    const wrapper = render(
      <BrowserRouter>
        <LogIn close={close} />
      </BrowserRouter>
    );

    const inputUsername = screen.getByTestId("usernameLogin");
    userEvent.type(inputUsername, "validUsername");

    const inputPassword = screen.getByTestId("passwordLogin");
    userEvent.type(inputPassword, "ValidPass7");

    const submitButton = screen.getByTestId("submitButtonLogin");
    userEvent.click(submitButton);

    expect(consoleSpy).toBeCalledWith("Hey this code works");
  });
});
