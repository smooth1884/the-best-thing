import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FetchThings from "../apis/FetchThings";
import ThingsDetailsImg from "./ThingsDetailsImg";

export const ThingsDetails = ({ isAuthenticated }) => {
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

  function AddPicture() {
    if (!isAuthenticated) {
      return (
        <p>
          Please <Link to="/login">Login</Link> to add a Picutre!
        </p>
      );
    }
    return (
      <form
        action={`http://localhost:3001/${id}/uploadImg`}
        encType="multipart/form-data"
        method="post"
      >
        <input type="file" name="myFile" />
        <button className="btn btn-success" type="Submit">
          Upload
        </button>
      </form>
    );
  }

  return (
    <div className="text-center">
      <h1>{name}</h1>
      <div>
        <strong style={{ color: "green" }}>{scorePlus} </strong>
        <strong style={{ color: "red" }}> {scoreMinus}</strong>
      </div>
      <h3></h3>
      <p>{description}</p>
      <AddPicture />
      <ThingsDetailsImg />
    </div>
  );
};
