import React from 'react'
import { useHistory } from 'react-router-dom'

const Header = () => {
    let history = useHistory()
    function routeChang() {
        history.push('/')
    }
    return (
        <div>
            <span
                style={{ right: '10%', position: 'absolute' }}
                className="input-group-btn"
            ></span>
            <h1
                style={{ cursor: 'pointer' }}
                className="font-weight-light display-1 text-center"
                onClick={routeChang}
            >
                The Best Thing
            </h1>
        </div>
    )
}

export default Header
