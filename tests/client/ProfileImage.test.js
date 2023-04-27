import { render, screen, act } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { ProfileImage } from "../../client/components/ProfileImage/ProfileImage";
import { BrowserRouter } from "react-router-dom";

// Mock DB calls to speed up performance
import { db } from "../../server/db";
jest.mock("../../server/db");

describe("Tests for ProfileImage.jsx", () => {
  const baseStyle = {
    width: "64px",
    height: "64px",
    borderRadius: "15%",
  }
  const baseData = {
    profile_picture: "base64 data...", 
    profile_picture_top: 16, 
    profile_picture_left: 0, 
    profile_picture_zoom: 100, 
    pfp_seed: 0, 
    pfp_background_color: "000000"
  }
  const badUIDError = "getUserInfo: Sent bad userID, passing..."
  const testID = "ProfileImage"

  // Mock axios and the response for the "/api/user/:user_id" endpoint
  const mock = new MockAdapter(axios);
  mock.onGet(/\/api\/user\/.+/).reply((config) => {
    const id = config.url.match(/(?<=\/api\/user\/).+$/)[0]

    return [200, baseData]
  })

  beforeAll(() => {
    //jest.spyOn(console, "log").mockImplementation();
    //jest.spyOn(console, "error").mockImplementation();
  })

  test("Check that Generated PFP Renders", async () => {
    await act(() => {
      render(<ProfileImage userID={1} />, { wrapper: BrowserRouter });
    })

    const elem = screen.getByTestId(testID)
    const style = elem.style

    // Only going to test for this in this test since it *should* be the same in every instance
    expect(style).toHaveProperty("width", baseStyle.width);
    expect(style).toHaveProperty("height", baseStyle.height);
    expect(style).toHaveProperty("borderRadius", baseStyle.borderRadius);
    
    // actual data
    expect(style).toHaveProperty("overflow", "hidden")
    expect(style).not.toHaveProperty("objectFit", "contain")
    expect(style).toHaveProperty("backgroundImage", `url(data:image/png;base64,${baseData.profile_picture})`)
  })

  test("Check that User-Defined PFP Renders", () => {
    const { baseElement } = render(<ProfileImage userID={2} />, { wrapper: BrowserRouter });

  })
  
  test("Check that PFP Eventually Renders After badUIDError", () => {
    const { baseElement } = render(<ProfileImage userID={1} />, { wrapper: BrowserRouter });
  })
  
  test("Check that Basic PFP Renders When an Error is Thrown", () => {
    const { baseElement } = render(<ProfileImage userID={3} />, { wrapper: BrowserRouter });
  })
})