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
      setImgs(response.data.imgs);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h3>Images</h3>
      {imgs &&
        imgs.map((img) => {
          const id = img.img_id;
          const imgURL = img.img_url;
          return (
            <div key={id}>
              <img src={`http://localhost:3001/${imgURL}`} alt="" />
              {/* <button className="btn btn-danger">Remove Image</button> */}
            </div>
          );
        })}
    </div>
  );
};

export default ThingsDetailsImg;
