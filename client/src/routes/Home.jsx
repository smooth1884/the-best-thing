import React from "react";
import Header from "../components/Header";
import MainList from "../components/MainList";
import { ThingsContextProvider } from "../context/ThingsContext";

function Home({ isAuthenticated }) {
  return (
    <ThingsContextProvider>
      <div>
        <Header />
        <MainList isAuthenticated={isAuthenticated} />
      </div>
    </ThingsContextProvider>
  );
}

export default Home;
