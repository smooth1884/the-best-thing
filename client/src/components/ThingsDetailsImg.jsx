<<<<<<< HEAD
import { useEffect, useState } from "react";
import React from "react";
import FetchThings from "../apis/FetchThings";
import { useParams } from "react-router-dom";

const ThingsDetailsImg = () => {
  const [imgs, setImgs] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await FetchThings.get(`/${id}/img_url`);
      const img = response.data.data;
      setImgs(img);
=======
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import FetchThings from "../apis/FetchThings";

const ThingsDetailsImg = () => {
  const { id } = useParams();
  const [imgs, setImgs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await FetchThings.get(`/${id}/imgs`);
      console.log(response);
      setImgs(response.data.imgs);
>>>>>>> tmp
    };
    fetchData();
  }, []);
  return (
    <div>
<<<<<<< HEAD
      {imgs &&
        imgs.map((img) => {
          //   const img = imgs.img;
          return (
            <div key={img.img_id}>
              <img src={img.img_url} alt="" />
=======
      <h3>Images</h3>
      {imgs &&
        imgs.map((img) => {
          const id = img.img_id;
          const imgURL = img.img_url;
          return (
            <div key={id}>
              <img src={`http://localhost:3001/${imgURL}`} alt="" />
              <button className="btn btn-danger">Remove Image</button>
>>>>>>> tmp
            </div>
          );
        })}
    </div>
  );
};

export default ThingsDetailsImg;
