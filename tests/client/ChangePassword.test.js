import { ChangePassword } from "../../client/components/ChangePassword/ChangePassword";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

describe("Tests for Change Password", () => {
    beforeAll(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    test("Checks for current password label", () => {
        const wrapper = render(
            <BrowserRouter>
                <ChangePassword/>
            </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("Enter Current Password:");
    });

    test("Checks for new password label", () => {
        const wrapper = render(
            <BrowserRouter>
                <ChangePassword/>
            </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("Enter New Password:");
    });

    test("Checks for confirm new password label", () => {
        const wrapper = render(
            <BrowserRouter>
                <ChangePassword/>
            </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("Confirm New Password:");
    });

    test("Checks for successful form submission", () => {
        const consoleSpy = jest.spyOn(global.console, "log");
        const close = jest.fn();
        const wrapper = render(
            <BrowserRouter>
                <ChangePassword close={close}/>
            </BrowserRouter>
        );

        const inputCurrentPassword = screen.getByTestId("currentPassword");
        userEvent.type(inputCurrentPassword, "Connor123");

        const inputNewPassword = screen.getByTestId("newPassword");
        userEvent.type(inputNewPassword, "Connor1234");

        const inputConfirmNewPassword = screen.getByTestId("confirmNewPassword");
        userEvent.type(inputConfirmNewPassword, "Connor1234");

        const submitButton = screen.getByTestId("changePassword_Submit");
        userEvent.click(submitButton);

        expect(consoleSpy).toBeCalledWith("Hey this code works");
    });
});