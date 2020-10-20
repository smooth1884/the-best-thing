import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom' // to redirect to register
import { toast } from 'react-toastify'

const Login = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    })
    const { email, password } = inputs

    const OnChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const body = { email, password }
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(body),
            })

            const parsRes = await response.json()
            // setUserName(parsRes.user_name)
            // setIsAdmin(parsRes.admin)
            if (parsRes.token) {
                // Checks if a token is there an if yes, logs in, if no throws error
                localStorage.setItem('token', parsRes.token)
                setAuth(true)
                toast.success('Login successfully!😍')
            } else {
                setAuth(false)
                toast.error(parsRes)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <Fragment>
            <h1 className="text-center my-5">Login</h1>
            <form onSubmit={onSubmitForm}>
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    className="form-control my-3"
                    value={email}
                    onChange={(e) => OnChange(e)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    className="form-control my-3"
                    value={password}
                    onChange={(e) => OnChange(e)}
                />
                <button className="btn btn-success btn-block">Submit</button>
            </form>
            <Link style={{ paddingRight: '10px' }} to="/register">
                Register
            </Link>
            <Link to="/">Cancel</Link>
        </Fragment>
    )
}

export default Login
