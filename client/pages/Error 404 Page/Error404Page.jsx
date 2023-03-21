import React from "react";
import Link from "react-router-dom";

export default function Error404Page() {
  return (
    <div>
      <h1>Error 404: Page Not Found</h1>
      <Link to="./LandingPage" className="btn btn-primary">
        Return to Home Page
      </Link>
    </div>
  );
}