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
    };
    fetchData();
  }, []);
  return (
    <div>
      {imgs &&
        imgs.map((img) => {
          //   const img = imgs.img;
          return (
            <div key={img.img_id}>
              <img src={img.img_url} alt="" />
            </div>
          );
        })}
    </div>
  );
};

export default ThingsDetailsImg;
