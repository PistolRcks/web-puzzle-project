import UserPage from "../../client/pages/UserPage/UserPage";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("Tests for User Page", () => {
    beforeAll(() => {
        jest.spyOn(console, "log").mockImplementation();
        jest.spyOn(console, "error").mockImplementation();
    });

    test("Checks for User Profile header", () => {
        const { baseElement } = render(
            <BrowserRouter>
                <UserPage/>
            </BrowserRouter>
        );
        expect(baseElement.outerHTML).toContain("User Profile");
    });

    test("Checks for user profile picture", () => {
        render(
            <UserPage url="/UserProfile"/>, {wrapper: BrowserRouter}
        );
        
        expect(screen.getByTestId("profilePic").outerHTML).toContain("https://api.dicebear.com/5.x/adventurer/svg?seed=Gracie&amp;scale=130&amp;radius=20&amp;backgroundType=solid,gradientLinear&amp;randomizeIds=true&amp;backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf,ffd5dc");
    });

    test("Checks for username header", () => {
        const { baseElement } = render(
            <BrowserRouter>
                <UserPage/>
            </BrowserRouter>
        );
        expect(baseElement.outerHTML).toContain("Username goes here!");
    });

    test("Checks for change password button", () => {
        const { baseElement } = render(
            <BrowserRouter>
                <UserPage/>
            </BrowserRouter>
        );
        expect(baseElement.outerHTML).toContain("Change Password");
    });
});