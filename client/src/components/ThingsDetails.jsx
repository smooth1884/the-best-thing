import React, { useState, useRef } from "react";
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
    const [newImg, setNewImg] = useState("");

    const fileInput = useRef(null);

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

        const handleSubmit = async e => {
            e.preventDefault();
            const { files } = fileInput.current;
            if (!files.length) alert("Should add an image");

            const data = new FormData();
            data.append("img", files[0]);

            try {
                const response = await FetchThings.post(
                    `${id}/uploadImg`,
                    data,
                    { headers: { token: localStorage.token } }
                );
                setNewImg(response.data.imgUrl);
            } catch (error) {
                console.error(error.message);
            }
        };
        return (
            <form onSubmit={handleSubmit}>
                <input type="file" name="myFile" ref={fileInput} />
                <button className="btn btn-success" type="submit">
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
            <AddPicture newImg={newImg} />
            <CommentBox />
            <ThingsDetailsImg />
        </div>
    );
};
