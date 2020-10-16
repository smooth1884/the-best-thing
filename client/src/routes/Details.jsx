import React from "react";
import { ThingsDetails } from "../components/ThingsDetails";

const Details = ({ isAuthenticated }) => {
  return (
    <div>
      <h1 className="text-center">
        <a href="/">Back</a>
      </h1>
      <ThingsDetails isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default Details;
