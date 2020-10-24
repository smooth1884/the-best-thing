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
    const [commentsWithParents, setCommentsWithParents] = useState([])
    const [newComment, setNewComment] = useState([])
    const [reload, setReload] = useState(false)
    const fileInput = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            const response = await FetchThings.get(`/api/${id}`)
            const thing = response.data.data.things[0]
            setName(thing.name)
            setImgs(thing.imgs)
            setComments(thing.comments)
            setCommentsWithParents(thing.commentsWithParents)
            setDescription(thing.description)
            setScorePlus(thing.score_plus)
            setScoreMinus(thing.score_minus)
        }
        fetchData()
    }, [newImg, newComment, reload])

    function AddImg() {
        if (!isAuthenticated) {
            return (
                <p>
                    Please <Link to="/login">in</Link> to add a Picutre!
                </p>
            )
        }

        const handleSubmit = async (e) => {
            e.preventDefault()
            const { files } = fileInput.current
            if (!files.length) alert('Should add an image')
            if (files.size > 976.563) alert('Limit is 1MB!')

            const data = new FormData()
            data.append('img', files[0])

            try {
                const response = await FetchThings.post(
                    `/api/${id}/uploadImg`,
                    data,
                    { headers: { token: localStorage.token } }
                )
                setNewImg([response.data.imgUrl])
            } catch (error) {
                console.error(error.message)
            }
        }
        return (
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="myFile"
                    ref={fileInput}
                    accept="image/*, image/gif"
                />
                <button className="btn btn-success" type="submit">
                    Upload Image
                </button>
            </form>
        )
    }

    const AddComment = (parent_id) => {
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
                    `/api/${id}/post-comment`,
                    {
                        comment,
                        parent_id: parentId,
                        user_name: userName,
                        date_created: formattedTimestamp,
                    },
                    { headers: { token: localStorage.token } }
                )
                setNewComment(response.data.body)
            } catch (error) {
                console.error(error.message)
            }
        }
        const buttonText = (parent_id) => {
            if (parent_id.parent_id) {
                return 'Reply'
            }
            return 'Write a Comment'
        }
        const placeholder = (parent_id) => {
            if (parent_id.parent_id) {
                return 'Write response...'
            }
            return 'Write Comment...'
        }
        return (
            <div>
                <p>
                    <a
                        style={{ color: 'red' }}
                        className="btn btn-light"
                        data-toggle="collapse"
                        href={`#Comment${parent_id.parent_id}`}
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                    >
                        {buttonText(parent_id)}
                    </a>
                </p>
                <div className="collapse" id={`Comment${parent_id.parent_id}`}>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            type="text"
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                            placeholder={placeholder(parent_id)}
                        />
                        <button
                            onClick={() => setParentId(parent_id.parent_id)}
                            style={{ margin: '10px' }}
                            className="btn btn-success"
                            type="submit"
                            disabled={!comment || !isAuthenticated}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    const handleDeleteComment = async (id) => {
        try {
            const response = await FetchThings.delete(
                `/api/comment/${id}/delete-comment`
            )
            setReload(!reload)
        } catch (error) {
            console.error(error.message)
        }
    }

    const DeleteComment = (id) => {
        if (isAdmin) {
            return (
                <button
                    onClick={() => handleDeleteComment(id.id)}
                    className="btn btn-danger"
                >
                    Delete Comment
                </button>
            )
        }
        return null
    }

    const handleEditComment = async (id, comment) => {
        try {
            const response = await FetchThings.put(`/api/comment/${id}/edit`, {
                comment,
            })
        } catch (error) {
            console.error(error.message)
        }
    }

    const EditComment = (id) => {
        if (isAdmin) {
            return (
                <button
                    onClick={() => alert("This doesn't work yet~")}
                    className="btn btn-warning"
                >
                    EDIT
                </button>
            )
        }
        return null
    }

    const handleDeleteImg = async (id) => {
        try {
            const response = await FetchThings.delete(`/api/${id}/delete-img`)
            setReload(!reload)
        } catch (error) {
            console.error(error.message)
        }
    }

    const DeleteImg = (img_id) => {
        if (isAdmin) {
            return (
                <button
                    onClick={() => handleDeleteImg(img_id.img_id)}
                    className="btn btn-danger"
                >
                    Delete Img
                </button>
            )
        }
        return null
    }

    const MapCommentsWithParents = (parent_id) => {
        return (
            <div>
                {commentsWithParents &&
                    commentsWithParents.map((com) => {
                        const id = com.comment_id
                        const comment = com.comment
                        const date = com.date_created
                        const name = com.user_name
                        const parent = com.parent_id
                        if (parent_id.parent_id === parent) {
                            return (
                                <div
                                    key={id}
                                    style={{ borderTop: '1px solid black' }}
                                >
                                    <p>{comment}</p>
                                    <p
                                        style={{
                                            color: 'gray',
                                            fontSize: '10px',
                                        }}
                                    >
                                        {name} on {date}
                                    </p>

                                    <DeleteComment id={id} />
                                </div>
                            )
                        } else {
                            return null
                        }
                    })}
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
                            <div
                                key={id}
                                className="container"
                                style={{ border: '1px solid black' }}
                            >
                                <p>{comment}</p>
                                <p
                                    style={{
                                        color: 'gray',
                                        fontSize: '10px',
                                    }}
                                >
                                    {name} on {date}
                                </p>
                                <AddComment parent_id={id} />

                                <DeleteComment id={id} />
                                <MapCommentsWithParents parent_id={id} />
                            </div>
                        )
                    })}
            </div>
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
                            <div key={id} style={{ width: '640px' }}>
                                <img
                                    style={{
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                    }}
                                    src={`${process.env.REACT_APP_API_BASE_URL}/${imgURL}`}
                                    alt=""
                                />
                                <DeleteImg img_id={id} />
                            </div>
                        )
                    })}
            </div>
        )
    }

    return (
        <div className="text-center" style={{ margin: '10px' }}>
            <div className="card mx-auto" style={{ width: '18rem' }}>
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                        Likes:
                        <strong style={{ color: 'green' }}>
                            {scorePlus}{' '}
                        </strong>{' '}
                        Dislikes:
                        <strong style={{ color: 'red' }}> {scoreMinus}</strong>
                    </h6>
                    <p className="card-text">{description}</p>
                </div>
            </div>
            <AddImg newImg={newImg} />
            <AddComment />
            <MapComments />
            <MapImgs />
        </div>
    )
}
