import React, { Fragment, useState, useEffect } from 'react'
import Home from './routes/Home'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link,
} from 'react-router-dom'
import { toast } from 'react-toastify'
import { ThingsContext } from './context/ThingsContext'
import 'react-toastify/dist/ReactToastify.css'

import Details from './routes/Details'

//* components

import Dashboard from './components/JWT Components/Dashboard'
import Login from './components/JWT Components/Login'
import Register from './components/JWT Components/Register'
import LogInOut from './components/LogInOut'
import { useContext } from 'react'
import FetchThings from './apis/FetchThings'

toast.configure()

const App = () => {
    // const [admin, setAdmin] = useState(false)

    // async function isAdmin(e) {
    //   e.preventDefault()
    //   try {
    //     const response = await FetchThings.get('/admin', {
    //       headers: {token: localStorage.token }
    //     })
    //     console.log(response)

    //   } catch (error) {
    //     console.error(error.message)
    //   }
    // }

    const [
        isAuthenticated,
        setIsAuthenticated, //1. destructure the req.body(name, email, password)
    ] = useState(false)

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean)
    }

    async function isAuth() {
        try {
            const response = await fetch('http://localhost:3001/auth/verify', {
                method: 'GET',
                headers: { token: localStorage.token },
            })

            const parseRes = await response.json()

            parseRes === true
                ? setIsAuthenticated(true)
                : setIsAuthenticated(false)
        } catch (err) {
            console.error(err.message)
        }
    }
    useEffect(() => {
        isAuth()
    }, [])

    return (
        <div>
            <Router>
                <LogInOut isAuthenticated={isAuthenticated} setAuth={setAuth} />
                <Route
                    exact
                    path="/login"
                    render={(props) =>
                        !isAuthenticated ? ( // check if user is authorized and if yes, its going to redirect to dashboard
                            <Login {...props} setAuth={setAuth} />
                        ) : (
                            <Redirect to="/" />
                        )
                    }
                />
                <Route
                    exact
                    path="/register"
                    render={(props) =>
                        !isAuthenticated ? (
                            <Register {...props} setAuth={setAuth} />
                        ) : (
                            <Redirect to="/" />
                        )
                    }
                />
                <Route
                    exact
                    path="/"
                    render={() => <Home isAuthenticated={isAuthenticated} />}
                />
                <Route
                    exact
                    path="/:id/details"
                    render={() => <Details isAuthenticated={isAuthenticated} />}
                />
            </Router>
        </div>
    )
}

export default App
