import React, { useState } from 'react'
import { useContext } from 'react'
import FetchThings from '../apis/FetchThings'
import { ThingsContext } from '../context/ThingsContext'

const AddThing = () => {
    const { addThings, setReloadThings, reloadTings } = useContext(
        ThingsContext
    )
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleSumbit = async (e) => {
        e.preventDefault()
        try {
            const response = await FetchThings.post(
                '/',
                {
                    name,
                    description,
                },
                { headers: { token: localStorage.token } }
            )
            //addThings(response.data.data.things[0]);
            setReloadThings(!reloadTings)
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <div>
            <div>
                <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModal"
                >
                    Add
                </button>

                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    style={{ color: 'black' }}
                                    className="modal-title"
                                    id="exampleModalLabel"
                                >
                                    Add a Thing
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form action="">
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    ></input>
                                    <br />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    ></input>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-dismiss="modal"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleSumbit}
                                        type="submit"
                                        className="btn btn-primary"
                                        data-dismiss="modal"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddThing
