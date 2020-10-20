import React from 'react'
import Header from '../components/Header'
import MainList from '../components/MainList'
import { ThingsContextProvider } from '../context/ThingsContext'

function Home({ isAuthenticated, userName, isAdmin }) {
    return (
        <ThingsContextProvider>
            <div>
                <Header />
                <MainList
                    isAuthenticated={isAuthenticated}
                    userName={userName}
                    isAdmin={isAdmin}
                />
            </div>
        </ThingsContextProvider>
    )
}

export default Home
