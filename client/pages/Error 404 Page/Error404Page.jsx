import React from 'react';
import { Link } from 'react-router-dom';

function Error404Page() {
  return (
    <div data-testid="error-404-page">
      <h1>404 Not Found</h1>
      <p>Sorry, the page you requested could not be found.</p>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
}

export default Error404Page;
