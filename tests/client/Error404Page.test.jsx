import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Error404Page from '../Error404Page';
import LandingPage from '../LandingPage';

describe("Tests for Error 404 page", () => {
  test("renders Error404Page component when a 404 error occurs", () => {
    // simulate a 404 error
    const error = new Error("Not Found");
    error.response = { status: 404 };

    // render the Error404Page component
    render(<Error404Page error={error} />);

    // assert that the Error404Page component is rendered
    expect(screen.getByTestId("error-404-page")).toBeInTheDocument();
  });

  test("contains link to LandingPage component", () => {
    // simulate a 404 error
    const error = new Error("Not Found");
    error.response = { status: 404 };

    // render the Error404Page component wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <Error404Page error={error} />
        <LandingPage />
      </MemoryRouter>
    );

    // assert that the link is rendered
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();

    // assert that the link has the correct href
    expect(linkElement.href).toContain('/');
  });

  test("clicking on link navigates to LandingPage component", () => {
    // simulate a 404 error
    const error = new Error("Not Found");
    error.response = { status: 404 };

    // render the Error404Page and LandingPage components wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <Error404Page error={error} />
        <LandingPage />
      </MemoryRouter>
    );

    // click on the link
    const linkElement = screen.getByRole('link');
    linkElement.click();

    // assert that the LandingPage component is rendered
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });
});
