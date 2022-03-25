import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { registerUser } from "./AuthManager"
import "./Register.css"
import logo1 from "../../images/roadrunner-logo1.png"
// import logo2 from "../../images/roadrunner-logo2.png"
import { useHistory } from "react-router-dom"

export const Register = ({ setToken, setUserType }) => {
    const history = useHistory()
    const firstName = useRef()
    const lastName = useRef()
    const email = useRef()
    const username = useRef()
    const password = useRef()
    const verifyPassword = useRef()
    const passwordDialog = useRef()
    const company = useRef()
    const established = useRef()
    const about = useRef()
    const [registerUserType, setRegisterUserType] = useState("")

    const handleRegister = (e) => {
        e.preventDefault()

        if (password.current.value === verifyPassword.current.value) {
            const newUser = {
                "username": username.current.value,
                "first_name": firstName.current.value,
                "last_name": lastName.current.value,
                "password": password.current.value,
                "email": email.current.value,
                "company": company.current.value,
                "about": about.current.value,
                "established": established.current.value,
                "user_type": registerUserType
            }

            registerUser(newUser)
                .then(res => {
                    if ("token" in res) {
                        setToken(res.token)
                        setUserType(res.user_type)
                        history.push('/dashboard')
                    }
                })
        }
        else {
            passwordDialog.current.showModal()
        }
    }

    const handleUserType = (event) => {
        const checkboxes = document.querySelectorAll('.user-type')
        for (const box of checkboxes) {
            if (box.checked) {
                setRegisterUserType(event.target.value)
            }
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <div className="navbar has-shadow mb-6" style={{ maxHeight: "80px" }}>
                <figure className="image is-64x64 mb-6">
                    <img src={logo1} alt="Roadrunner logo" />
                </figure>
            </div>
            <div className="container is-max-desktop px-2">

                <dialog className="dialog dialog--password" ref={passwordDialog}>
                    <div>Passwords do not match</div>
                    <button className="button--close" onClick={e => passwordDialog.current.close()}>Close</button>
                </dialog>

                <div className="columns">
                    <div className="column is-1.5"></div>
                    <div className="column is-9">
                        <div className="title">Create your account!</div>
                        <div className="mt-2 pl-1">Already a member? <Link to="/login">Login</Link></div>
                        {/* first name */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="firstName">First name</label>
                            <input
                                ref={firstName}
                                className="input name m-auto"
                                type="text"
                                name="firstName"
                                placeholder="Enter first name..."
                                required autoFocus
                            />
                        </fieldset>
                        {/* last name */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="lastName">Last name</label>
                            <input
                                ref={lastName}
                                className="input name m-auto"
                                type="text"
                                name="lastName"
                                placeholder="Enter last name..."
                                required
                            />
                        </fieldset>
                        {/* email */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="email">Email</label>
                            <input
                                ref={email}
                                className="input email m-auto"
                                type="email"
                                name="email"
                                placeholder="Enter email..."
                                required
                            />
                        </fieldset>
                        {/* username */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="username">Username</label>
                            <input
                                ref={username}
                                className="input username m-auto"
                                type="text"
                                name="username"
                                placeholder="Enter username..."
                            />
                        </fieldset>
                        {/* password */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="password">Password</label>
                            <input
                                ref={password}
                                className="input password m-auto"
                                type="password"
                                name="password"
                                placeholder="Enter password..."
                                required
                            />
                        </fieldset>
                        {/* verify password */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="verifyPassword">Verify Password</label>
                            <input
                                ref={verifyPassword}
                                className="input password m-auto"
                                type="password"
                                name="password"
                                placeholder="Verify password..."
                                required
                            />
                        </fieldset>
                        {/* company */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="company">Company</label>
                            <input
                                ref={company}
                                className="input company m-auto"
                                type="text"
                                name="company"
                                placeholder="Enter company..."
                            />
                        </fieldset>
                        {/* about */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="about">About</label>
                            <textarea
                                ref={about}
                                className="textarea about m-auto"
                                type="text"
                                name="about"
                                placeholder="Tell us a little about your company!"
                            />
                        </fieldset>
                        {/* established */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="established">Established on</label>
                            <input
                                ref={established}
                                className="input established m-auto"
                                type="date"
                                name="established"
                            />
                        </fieldset>
                        {/* userType */}
                        <fieldset className="my-5 is-size-5">
                            <label htmlFor="company">What is your purpose?</label>
                            <div className="control mt-3">
                                <label className="radio">
                                    <input className="user-type mx-2" type="radio" name="userType" value="distributor" onClick={handleUserType} />
                                    Distribution
                                </label>
                                <label className="radio">
                                    <input className="user-type mx-2" type="radio" name="userType" value="dispatcher" onClick={handleUserType} />
                                    Dispatching
                                </label>
                            </div>
                        </fieldset>
                        <div className="is-right mx-auto">
                            <button type="submit" className="button">Submit</button>
                        </div>
                    </div>
                    <div className="column is-1.5"></div>
                </div>
            </div>
        </form>
    )
}