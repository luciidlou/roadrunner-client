import './NavBar.css'
import logo1 from "../../images/roadrunner-logo1.png"
import logo2 from "../../images/roadrunner-logo2.png"
import { Link } from 'react-router-dom'


export const NavBar = () => {
    return (
        <NavBar className="navbar has-shadow mb-6" style={{ maxHeight: "80px" }}>
            <figure className="image is-64x64 mb-6">
                <Link to="/"> <img src={logo1} alt="Bookkeeper logo" /></Link>
            </figure >
        </NavBar >
    )
}