import UserPage from "../../client/pages/UserPage/UserPage";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("Tests for User Page", () => {
    beforeAll(() => {
        jest.spyOn(console, "log").mockImplementation();
        jest.spyOn(console, "error").mockImplementation();
    });

    test("Tests for loaded User Page", async () => {
        render(
            <BrowserRouter>
                <UserPage url="/UserProfile"/>
            </BrowserRouter>
        );
        const userPage = screen.getByTestId("userPage");
        expect(userPage).toBeInTheDocument();
    });

    test("Checks for User Profile header", () => {
        const wrapper = render(
            <BrowserRouter>
                <UserPage/>
            </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("User Profile");
    });

    test("Checks for user profile picture", () => {
        render(
            <BrowserRouter>
                <UserPage url="/UserProfile"/>
            </BrowserRouter>
        );
        const profilePic = screen.getByTestId("profilePic");
        expect(profilePic).toBeInTheDocument();
    });

    test("Checks for username header", () => {
        const wrapper = render(
            <BrowserRouter>
                <UserPage/>
            </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("Username goes here!");
    });

    test("Checks for change password button", () => {
        const wrapper = render(
            <BrowserRouter>
                <UserPage/>
            </BrowserRouter>
        );
        expect(wrapper.baseElement.outerHTML).toContain("Change Password");
    });
});