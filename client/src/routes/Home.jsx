import React from "react";
import Header from "../components/Header";
import MainList from "../components/MainList";
import { ThingsContextProvider } from "../context/ThingsContext";

const Home = () => {
  return (
    <ThingsContextProvider>
      <div>
        <Header />
        <MainList />
      </div>
    </ThingsContextProvider>
  );
};

export default Home;
