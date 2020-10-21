import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function LogInOut({ isAuthenticated, setAuth, userName, isAdmin }) {
    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        setAuth(false)
        toast.success('You logged out successfully') // makes a logout toast
    }
    const AdminMode = () => {
        if (isAdmin === true) {
            return <p>Admin mode on</p>
        }
        return null
    }

    function Login() {
        if (isAuthenticated) {
            return (
                <div style={{ paddingLeft: '10px' }}>
                    <p>Logged in as: {userName}</p>
                    <AdminMode />
                    <Link to="" onClick={logout}>
                        Logout
                    </Link>
                </div>
            )
        }
        return (
            <div>
                <Link style={{ padding: '10px' }} to="/register">
                    Register
                </Link>
                <Link to="/login">Login</Link>
            </div>
        )
    }
    return (
        <div>
            <Login isAuthenticated={false} />
        </div>
    )
}

export default LogInOut
