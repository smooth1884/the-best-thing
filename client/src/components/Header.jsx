import React from 'react'
import { Link } from 'react-router-dom'
import Login from './JWT Components/Login'

const Header = () => {
    return (
        <div>
            <span
                style={{ right: '10%', position: 'absolute' }}
                className="input-group-btn"
            ></span>
            <h1 className="font-weight-light display-1 text-center">
                The Best Thing
            </h1>
        </div>
    )
}

export default Header
