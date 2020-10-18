import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FetchThings from "../apis/FetchThings";
import ThingsDetailsImg from "./ThingsDetailsImg";
import CommentBox from "./CommentBox";
import { useContext } from "react";
import { ThingsContext } from "../context/ThingsContext";

export const ThingsDetails = ({ isAuthenticated }) => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scorePlus, setScorePlus] = useState();
  const [scoreMinus, setScoreMinus] = useState();
  const [img, setImg] = useState()
  // const {addImg, newImg, setNewImg} = useContext(ThingsContext)
  const [newImg, setNewImg] = useState('')


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

    const handleFileSelection = (e) => {
      const { files } = e.target;
      if (!files.length) return;
      setImg(files[0]);
  };

    const handleSubmit = async(e) => {
      e.preventDefault();

      const data = new FormData()
      data.append('img', img)

      try {
        const response = await FetchThings.post(`${id}/uploadImg`, data,
        {headers: {token: localStorage.token}})
        setNewImg(response.data.imgUrl);
        //addImg();
      } catch (error) {
        console.error(error.message)
      }
    }
    return (
      <form
        // action={`http://localhost:3001/${id}/uploadImg`}
        // encType="multipart/form-data"
        // method="post"
        onSubmit={handleSubmit} 
      >
        <input type="file" name="myFile"
        onChange={handleFileSelection}
        />
        <button className="btn btn-success" 
        type="submit">
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
      <AddPicture newImg={newImg}/>
      <CommentBox />
      <ThingsDetailsImg />
    </div>
  );
};
