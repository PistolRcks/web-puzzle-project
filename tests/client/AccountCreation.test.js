import { AccountCreation } from "../../client/components/AccountCreation/AccountCreation";
import {
  checkPasswordRequirements,
  checkUsernameRequirements,
} from "../../utilities/AccountValidators";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";


describe("Tests for Account Creation", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  test("Checks for button", () => {
    const wrapper = render(
    <BrowserRouter>
      <AccountCreation />
    </BrowserRouter>
    );
    expect(wrapper.baseElement.outerHTML).toContain("Create Account");
  });
  test("Checks for username label", () => {
    const wrapper = render(
      <BrowserRouter>
        <AccountCreation />
      </BrowserRouter>
      );
    expect(wrapper.baseElement.outerHTML).toContain("Username:");
  });
  test("Checks for password label", () => {
    const wrapper = render(
      <BrowserRouter>
        <AccountCreation />
      </BrowserRouter>
      );
    expect(wrapper.baseElement.outerHTML).toContain("Password:");
  });
  test("Checks for confirm password label", () => {
    const wrapper = render(
      <BrowserRouter>
        <AccountCreation />
      </BrowserRouter>
      );
    expect(wrapper.baseElement.outerHTML).toContain("Confirm Password:");
  });
  test("checkUsernameRequirements with accepted username", () => {
    expect(checkUsernameRequirements("myUsername")[0]).toBeTruthy();
    expect(checkUsernameRequirements("myUsername")[1]).toBeTruthy();
  });
  test("checkUsernameRequirements with username with special characters", () => {
    expect(!checkUsernameRequirements("myUsername$")[1]).toBeTruthy();
  });
  test("checkUsernameRequirements with username that is too short", () => {
    expect(!checkUsernameRequirements("user")[0]).toBeTruthy();
  });
  test("checkPasswordRequirements with accepted password", () => {
    expect(checkPasswordRequirements("Password7")[0]).toBeTruthy();
    expect(checkPasswordRequirements("Password7")[1]).toBeTruthy();
    expect(checkPasswordRequirements("Password7")[2]).toBeTruthy();
    expect(checkPasswordRequirements("Password7")[3]).toBeTruthy();
    expect(checkPasswordRequirements("Password7")[4]).toBeTruthy();
  });
  test("checkPasswordRequirements with password with special characters", () => {
    expect(!checkPasswordRequirements("Password7$")[4]).toBeTruthy();
  });
  test("checkPasswordRequirements with password that is too short", () => {
    expect(!checkPasswordRequirements("Paord7")[0]).toBeTruthy();
  });
  test("checkPasswordRequirements with password with not digits", () => {
    expect(!checkPasswordRequirements("Password")[1]).toBeTruthy();
  });
  test("checkPasswordRequirements with password with no uppercase", () => {
    expect(!checkPasswordRequirements("password7")[2]).toBeTruthy();
  });
  test("checkPasswordRequirements with password with no lowercase", () => {
    expect(!checkPasswordRequirements("PASSWORD7")[3]).toBeTruthy();
  });
  test("check to make sure typing in the form and submission works", () => {
    const consoleSpy = jest.spyOn(global.console, "log");
    const close = jest.fn();
    const wrapper = render(
      <BrowserRouter>
        <AccountCreation close={close}/>
      </BrowserRouter>
      );

    const inputUsername = screen.getByTestId("username");
    userEvent.type(inputUsername, "validUsername");

    const inputPassword = screen.getByTestId("password");
    userEvent.type(inputPassword, "ValidPass7");

    const inputConfirmPassword = screen.getByTestId("confirmPassword");
    userEvent.type(inputConfirmPassword, "ValidPass7");

    const submitButton = screen.getByTestId("submitButton");
    userEvent.click(submitButton);

    expect(consoleSpy).toBeCalledWith("Hey this code works");
  });
});
