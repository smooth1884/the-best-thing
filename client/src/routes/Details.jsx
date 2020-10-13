import React from "react";
import { ThingsDetails } from "../components/ThingsDetails";
import ThingsDetailsImg from "../components/ThingsDetailsImg";

const Details = () => {
  return (
    <div>
      <h1 className="text-center">
        <a href="/">Back</a>
      </h1>
      <ThingsDetails />
      <ThingsDetailsImg />
    </div>
  );
};

export default Details;
