import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import FetchThings from "../apis/FetchThings";

export const ThingsDetails = (props) => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scorePlus, setScorePlus] = useState();
  const [scoreMinus, setScoreMinus] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await FetchThings.get(`/${id}`);
      const thing = response.data.data.things[0];
      setName(thing.name);
      setDescription(thing.description);
      setScorePlus(thing.score_plus);
      setScoreMinus(thing.score_minus);
    };
    fetchData();
  }, []);
  return (
    <div className="text-center">
      <h1>{name}</h1>
      <div>
        <strong style={{ color: "green" }}>{scorePlus} </strong>
        <strong style={{ color: "red" }}> {scoreMinus}</strong>
      </div>
      <h3></h3>
      <p>{description}</p>
    </div>
  );
};
