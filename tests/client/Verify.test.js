import { render } from "@testing-library/react";
import React from "react";
import Verify from "../../client/components/Verify/Verify";
import axios from "axios"

import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios")

describe("Tests for Verify.jsx", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  test("Waiting for server response initially", () => {
    const { getByText } = render(<Verify />);
    expect(getByText("Waiting for server...")).toBeInTheDocument();
  })

  test("Unauthorized", async () => {
    let verify;
    await act(async () => {
      verify = render(<BrowserRouter><Verify/></BrowserRouter>)
    });

    expect(verify.getByText("401 - Unauthorized")).toBeInTheDocument();
  })
})
