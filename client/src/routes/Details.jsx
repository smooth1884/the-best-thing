import React from 'react'
import Header from '../components/Header'
import { ThingsDetails } from '../components/ThingsDetails'

const Details = ({ isAuthenticated, userName, isAdmin }) => {
    return (
        <div>
            <Header />
            <ThingsDetails
                isAuthenticated={isAuthenticated}
                userName={userName}
                isAdmin={isAdmin}
            />
        </div>
    )
}

export default Details
