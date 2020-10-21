import React, { useState, createContext } from 'react'

export const ThingsContext = createContext()

const sortThings = (things) => {
    const sorted = things.sort((l, r) => {
        const totalLeft = l.score_plus - l.score_minus
        const totalRight = r.score_plus - r.score_minus
        return totalLeft <= totalRight ? 1 : -1
    })
    return sorted
}

export const ThingsContextProvider = (props) => {
    const [things, setThings] = useState([])
    const [reloadThings, setReloadThings] = useState(false)
    const [Imgs, setImgs] = useState([])
    const [newImg, setNewImg] = useState('')
    const [search, setSearch] = useState('')
    const [newComment, setNewComment] = useState([])
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    const appendComment = (newComment) => {
        setComments([...comments, newComment])
    }

    const appendImg = (newImg) => {
        setImgs([...Imgs, newImg])
    }

    const addThings = (thing) => {
        setThings([...things, thing])
    }

    const updateThing = (thing) => {
        const thingsCopy = [...things]
        const thingIndex = thingsCopy.findIndex((t) => t.id === thing.id)
        if (thingIndex === -1) return
        thingsCopy[thingIndex] = thing
        const sortedThings = sortThings(thingsCopy)
        setThings(sortedThings)
    }

    const addImg = (newImg) => {
        setImgs([...Imgs, newImg])
    }

    return (
        <ThingsContext.Provider
            value={{
                things,
                setThings,
                addThings,
                updateThing,
                setReloadThings,
                reloadThings,
                setNewImg,
                setImgs,
                newImg,
                Imgs,
                addImg,
                setSearch,
                search,
                appendComment,
                comments,
                setComments,
                setNewComment,
                newComment,
                setNewImg,
                comment,
                setComment,
                appendImg,
            }}
        >
            {props.children}
        </ThingsContext.Provider>
    )
}
