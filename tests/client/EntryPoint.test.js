import EntryPoint from "../../client/EntryPoint.jsx";
import React from "react";
import { render } from "@testing-library/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

it("Test for EntryPoint", () => {
  const entryPoint = render(<GoogleOAuthProvider><EntryPoint /></GoogleOAuthProvider>);
  expect(document.body).toBe(entryPoint.baseElement);
});
