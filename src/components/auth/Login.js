import "./Login.css"
import logo1 from "../../images/roadrunner-logo1.png"
import logo2 from "../../images/roadrunner-logo2.png"
import { Link } from "react-router-dom"
import { loginUser } from "./AuthManager"
import { useRef, useState } from "react"
import { useHistory } from "react-router-dom"


export const Login = ({ setToken }) => {
    const username = useRef()
    const password = useRef()
    const [isUnsuccessful, setisUnsuccessful] = useState(false)
    const history = useHistory()

    const handleLogin = (e) => {
        e.preventDefault()

        const user = {
            username: username.current.value,
            password: password.current.value
        }

        loginUser(user).then(res => {
            if ("valid" in res && res.valid) {
                setToken(res.token)
                history.push("/")
            }
            else {
                setisUnsuccessful(true)
            }
        })
    }


    return (
        <div className="container is-max-desktop mx-auto mt-6">
            <figure className="image is-64x64">
                <img src={logo1} alt="Bookkeeper logo" />
            </figure>
            <div className="title has-text-centered">Roadrunner</div>
            <div className="subtitle has-text-centered is-italic mb-4">Taking things one mile at a time</div>
            <h4 className="h4 is-size-5 has-text-centered">Login</h4>
            <div className="columns">
                <div className="column is-3"></div>
                <div className="column is-6">
                    <fieldset className="my-4">
                        <label htmlFor="username">Username</label>
                        <input
                            className="input username m-auto"
                            ref={username}
                            type="text"
                            name="username"
                            placeholder="Enter username..."
                        />
                    </fieldset>
                    <fieldset className="my-4">
                        <label htmlFor="password">Password</label>
                        <input
                            className="input password m-auto"
                            ref={password}
                            type="text"
                            name="password"
                            placeholder="Enter password..."
                        />
                    </fieldset>
                    <div className="has-text-centered mt-2">
                        <button onClick={handleLogin} className="button">Log in</button>
                    </div>
                    <div className="has-text-centered pl-1 mt-4">Not a member yet? <Link to="/register">Sign up</Link></div>
                </div>
                <div className="column is-3"></div>
            </div>
            {
                isUnsuccessful ? <p className="help is-danger">Username or password not valid</p> : ''
            }
        </div>
    )
}