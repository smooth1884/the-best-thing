import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Register = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { name, email, password } = inputs

    //change the pre input text
    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    // set the Submit button
    const onSubmitForm = async (e) => {
        e.preventDefault() // by default the side would refresh once the button is clicked and this is preventing it
        try {
            const body = { name, email, password }
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(body),
                }
            )
            const parseRes = await response.json()

            if (parseRes.token) {
                localStorage.setItem('token', parseRes.token) // sets the jwt to the browser
                setAuth(true)
                toast.success('You Registered succesfully!👌')
            } else {
                setAuth(false)
                toast.error(parseRes)
            }
        } catch (err) {
            console.error(err.message)
        }
    }
    return (
        <div className="container-sm">
            <Fragment>
                <h1 className="text-center my-5">Register</h1>
                <form
                    onSubmit={onSubmitForm} // sets the function of the button
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="name"
                        className="form-control my-3"
                        value={name} // saves the input value to {name}
                        onChange={(e) => onChange(e)} // makes it possible to change the text
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="email"
                        className="form-control my-3"
                        value={email}
                        onChange={(e) => onChange(e)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        className="form-control my-3"
                        value={password}
                        onChange={(e) => onChange(e)}
                    />
                    <button className=" btn btn-success btn-block">
                        Submit
                    </button>
                </form>
                <Link style={{ paddingRight: '10px' }} to="/login">
                    Login
                </Link>
                <Link to="/">Cancel</Link>
            </Fragment>
        </div>
    )
}

export default Register
