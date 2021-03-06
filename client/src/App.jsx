import React, { useState, useEffect } from 'react'
import Home from './routes/Home'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Details from './routes/Details'

//* components

import Login from './components/JWT Components/Login'
import Register from './components/JWT Components/Register'
import LogInOut from './components/LogInOut'

toast.configure()

const App = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [userName, setUserName] = useState('')

    const [
        isAuthenticated,
        setIsAuthenticated, //1. destructure the req.body(name, email, password)
    ] = useState(false)

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean)
    }

    async function isAuth() {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`,
                {
                    method: 'GET',
                    headers: { token: localStorage.token },
                }
            )

            const parsRes = await response.json()
            setUserName(parsRes.data.user_name)
            setIsAdmin(parsRes.data.admin)

            parsRes.auth === true
                ? setIsAuthenticated(true)
                : setIsAuthenticated(false)
        } catch (err) {
            console.error(err.message)
        }
    }
    useEffect(() => {
        isAuth()
    }, [setAuth])

    return (
        <div>
            <Router>
                <LogInOut
                    isAuthenticated={isAuthenticated}
                    setAuth={setAuth}
                    userName={userName}
                    isAdmin={isAdmin}
                />
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
                    render={() => (
                        <Home
                            isAuthenticated={isAuthenticated}
                            isAdmin={isAdmin}
                            userName={userName}
                        />
                    )}
                />
                <Route
                    exact
                    path="/:id/details"
                    render={() => (
                        <Details
                            isAuthenticated={isAuthenticated}
                            userName={userName}
                            isAdmin={isAdmin}
                        />
                    )}
                />
            </Router>
        </div>
    )
}

export default App
