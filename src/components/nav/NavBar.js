import './NavBar.css'
import logo1 from "../../images/roadrunner-logo1.png"
import logo2 from "../../images/roadrunner-logo2.png"
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useRef } from 'react'


export const NavBar = ({ token, setToken, userType, setUserType }) => {
    const history = useHistory()
    const navbar = useRef()
    const hamburger = useRef()

    const showMobileNavbar = () => {
        hamburger.current.classList.toggle('is-active')
        navbar.current.classList.toggle('is-active')
    }

    return (
        <nav className="navbar has-background-grey-lighter mb-3" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <img src={logo2} height="3rem" /> <h1 className="title is-3 pl-3">Roadrunner<br></br><p className='is-italic is-size-6 subtitle'>{userType === "distributor" ? "Distributor portal" : "Dispatcher portal"}</p></h1>
                </a>
                {/* {
                    userType === "dispatcher"
                    ?
                    <div className='subtitle'>Dispatcher portal</div>
                    :
                    <div className='subtitle'>Distributor portal</div>
                } */}

                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={showMobileNavbar} ref={hamburger}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div className="navbar-menu" ref={navbar}>
                <div className="navbar-start">
                    {
                        token
                            ?
                            <>
                                <Link to="/dashboard" className="navbar-item is-size-5" onClick={showMobileNavbar}>Dashboard</Link>
                                <Link to="/loadboard" className="navbar-item is-size-5" onClick={showMobileNavbar}>Load Board</Link>
                                {
                                    userType === "distributor"
                                        ?
                                        <Link to="/loadmanager" className="navbar-item is-size-5" onClick={showMobileNavbar}>Load Manager</Link>
                                        :
                                        <Link to="/fleetmanager" className="navbar-item is-size-5" onClick={showMobileNavbar}>Fleet Manager</Link>
                                }
                            </>
                            : ""
                    }
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            {
                                token
                                    ?
                                    <button className="button is-outlined" onClick={() => {
                                        setToken("")
                                        setUserType("")
                                        localStorage.removeItem("token")
                                        localStorage.removeItem("userType")
                                        history.push('/login')
                                    }}>Logout</button>
                                    :
                                    <>
                                        <Link to="/register" className="button is-link">Register</Link>
                                        <Link to="/login" className="button is-outlined">Login</Link>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
