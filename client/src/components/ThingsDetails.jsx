import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import FetchThings from "../apis/FetchThings";
import ThingsDetailsImg from "./ThingsDetailsImg";

export const ThingsDetails = (props) => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scorePlus, setScorePlus] = useState();
  const [scoreMinus, setScoreMinus] = useState();
  //const [imgData, setImgData] = useState(null);

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

  // const handleSumbit = async (e) => {
  //   e.preventDefault();
  // const config = {
  //   headers: {
  //     "content-type": "multipart/form-data",
  //   },
  // };
  // const formData = new FormData();
  // formData.append("myFile", imgData);
  // console.log(formData);
  // try {
  //   const response = await FetchThings.post(`/${id}/uploadImg`, {
  //     formData,
  //   });
  // } catch (error) {
  //   console.error(error.message);
  // }
  //};

  return (
    <div className="text-center">
      <h1>{name}</h1>
      <div>
        <strong style={{ color: "green" }}>{scorePlus} </strong>
        <strong style={{ color: "red" }}> {scoreMinus}</strong>
      </div>
      <h3></h3>
      <p>{description}</p>
      <form
        action={`http://localhost:3001/${id}/uploadImg`}
        encType="multipart/form-data"
        method="post"
        //onSubmit={handleSumbit}
      >
        <input
          type="file"
          name="myFile"
          //onChange={(e) => setImgData(e.target.files[0])}
        />
        <button className="btn" type="Submit">
          Submit
        </button>
      </form>
      <ThingsDetailsImg />
    </div>
  );
};
