import React, { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import FetchThings from '../apis/FetchThings'

export const ThingsDetails = ({ isAuthenticated, userName, isAdmin }) => {
    const { id } = useParams()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [scorePlus, setScorePlus] = useState()
    const [scoreMinus, setScoreMinus] = useState()
    const [newImg, setNewImg] = useState('')
    const [Imgs, setImgs] = useState([])
    const [comments, setComments] = useState([])
    const fileInput = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            const response = await FetchThings.get(`/${id}`)
            const thing = response.data.data.things[0]
            setName(thing.name)
            setImgs(thing.imgs)
            setComments(thing.comments)
            setDescription(thing.description)
            setScorePlus(thing.score_plus)
            setScoreMinus(thing.score_minus)
        }
        fetchData()
    }, [])

    function AddImg() {
        if (!isAuthenticated) {
            return (
                <p>
                    Please <Link to="/login">Login</Link> to add a Picutre!
                </p>
            )
        }

        const handleSubmit = async (e) => {
            e.preventDefault()
            const { files } = fileInput.current
            if (!files.length) alert('Should add an image')

            const data = new FormData()
            data.append('img', files[0])

            try {
                const response = await FetchThings.post(
                    `${id}/uploadImg`,
                    data,
                    { headers: { token: localStorage.token } }
                )
                setNewImg(response.data.imgUrl)
                //addImg();
            } catch (error) {
                console.error(error.message)
            }
        }
        return (
            <form onSubmit={handleSubmit}>
                <input type="file" name="myFile" ref={fileInput} />
                <button className="btn btn-success" type="submit">
                    Upload
                </button>
            </form>
        )
    }

    const MapImgs = () => {
        return (
            <div>
                {Imgs &&
                    Imgs.map((img) => {
                        const id = img.img_id
                        const imgURL = img.img_url
                        return (
                            <div key={id}>
                                <img
                                    src={`http://localhost:3001/${imgURL}`}
                                    alt=""
                                />
                                {/* <button className="btn btn-danger">Remove Image</button> */}
                            </div>
                        )
                    })}
            </div>
        )
    }

    const AddComment = () => {
        const [comment, setComment] = useState('')
        const [parentId, setParentId] = useState(null)
        const timestamp = new Date()

        const formattedTimestamp = Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
        }).format(timestamp)

        const handleSubmit = async (e) => {
            e.preventDefault()
            try {
                const response = await FetchThings.post(
                    `${id}/post-comment`,
                    {
                        comment,
                        parent_id: parentId,
                        user_name: userName,
                        date_created: formattedTimestamp,
                    },
                    { headers: { token: localStorage.token } }
                )
                console.log(response)
            } catch (error) {
                console.error(error.message)
            }
        }
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <button
                        style={{ margin: '10px' }}
                        className="btn btn-success"
                    >
                        Post
                    </button>
                </form>
            </div>
        )
    }

    const MapComments = () => {
        return (
            <div>
                {comments &&
                    comments.map((com) => {
                        const id = com.comment_id
                        const comment = com.comment
                        const date = com.date_created
                        const name = com.user_name
                        return (
                            <div key={id} style={{ border: '1px solid black' }}>
                                <p>{name}</p>
                                <p>{comment}</p>
                                <p style={{ color: 'gray', fontSize: '10px' }}>
                                    {date}
                                </p>
                            </div>
                        )
                    })}
            </div>
        )
    }
    return (
        <div className="text-center">
            <h1>{name}</h1>
            <div>
                <strong style={{ color: 'green' }}>{scorePlus} </strong>
                <strong style={{ color: 'red' }}> {scoreMinus}</strong>
            </div>
            <h3></h3>
            <p>{description}</p>
            <AddImg newImg={newImg} />
            <AddComment />
            <MapComments />
            <MapImgs />
        </div>
    )
}
