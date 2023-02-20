import {AccountCreation, checkPasswordRequirements, checkUsernameRequirements} from '../../client/components/AccountCreation/AccountCreation';
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach } from 'node:test';

describe("Tests for Account Creation", () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    }) 
    test("Checks for button", () => {
        const wrapper = render(<AccountCreation />)
        expect(wrapper.baseElement.outerHTML).toContain("Create Account");
    });
    test("Checks for username label", () => {
        const wrapper = render(<AccountCreation />)
        expect(wrapper.baseElement.outerHTML).toContain("Username:");
    });
    test("Checks for password label", () => {
        const wrapper = render(<AccountCreation />)
        expect(wrapper.baseElement.outerHTML).toContain("Password:");
    });
    test("Checks for confirm password label", () => {
        const wrapper = render(<AccountCreation />)
        expect(wrapper.baseElement.outerHTML).toContain("Confirm Password:");
    });
    test("checkUsernameRequirements with accepted username", () => {
        expect(checkUsernameRequirements('myUsername')).toBeTruthy();
    });
    test("checkUsernameRequirements with username with special characters", () => {
        expect(!checkUsernameRequirements('myUsername$')).toBeTruthy();
    });
    test("checkUsernameRequirements with username that is too short", () => {
        expect(!checkUsernameRequirements('user')).toBeTruthy();
    });
    test("checkPasswordRequirements with accepted password", () => {
        expect(checkPasswordRequirements('Password7')).toBeTruthy();
    });
    test("checkPasswordRequirements with password with special characters", () => {
        expect(!checkPasswordRequirements('Password7$')).toBeTruthy();
    });
    test("checkPasswordRequirements with password that is too short", () => {
        expect(!checkPasswordRequirements('Paord7')).toBeTruthy();
    });
    test("checkPasswordRequirements with password with not digits", () => {
        expect(!checkPasswordRequirements('Password')).toBeTruthy();
    });
    test("checkPasswordRequirements with password with no uppercase", () => {
        expect(!checkPasswordRequirements('password7')).toBeTruthy();
    });
    test("checkPasswordRequirements with password with no lowercase", () => {
        expect(!checkPasswordRequirements('PASSWORD7')).toBeTruthy();
    });
    test("check to make sure typing in the form and submission works", () => {
        const consoleSpy = jest.spyOn(global.console, "log");
        const close = jest.fn();
        const wrapper = render(<AccountCreation close={close}/>)

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