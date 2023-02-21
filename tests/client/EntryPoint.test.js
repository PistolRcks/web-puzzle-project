import EntryPoint from "../../client/EntryPoint.jsx";
import React from "react";
import { render } from "@testing-library/react";

it("Test for EntryPoint", () => {
  const entryPoint = render(<EntryPoint />);
  expect(document.body).toBe(entryPoint.baseElement);
});
