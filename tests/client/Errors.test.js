import { Error401 } from "../../client/components/Errors/Errors";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { createMemoryHistory } from "@remix-run/router";

describe("Tests for Errors", () => {
  test("Checks for the 401 - Unauthorized header", () => {
    const error401 = render(<BrowserRouter><Error401 /></BrowserRouter>);
    expect(error401.baseElement.outerHTML).toContain("401 - Unauthorized");
  })
})