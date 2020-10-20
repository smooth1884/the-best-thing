import React from 'react'
import { useHistory } from 'react-router-dom'
import { ThingsDetails } from '../components/ThingsDetails'

const Details = ({ isAuthenticated, userName, isAdmin }) => {
    let history = useHistory()
    function routeChang() {
        history.push('/')
    }
    return (
        <div>
            <h1 className="text-center">
                <button type="button" className="btn" onClick={routeChang}>
                    Back
                </button>
            </h1>
            <ThingsDetails
                isAuthenticated={isAuthenticated}
                userName={userName}
                isAdmin={isAdmin}
            />
        </div>
    )
}

export default Details
