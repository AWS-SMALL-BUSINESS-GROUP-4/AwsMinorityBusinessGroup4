import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import '../App.css'
import './Header.css'
import './NavBar.css'
import './TextStyles.css'
import { AuthContext } from "../AuthContext"
import {Login, Logout } from "../LoginFunctions";
import { useAuth } from '../context/AuthContext'

function NavBar() {
    const { isLoggedIn } = useAuth();

    return (
        <ul className='nav orange-background'>
            {/* <li className='nav' style={{float: "left"}}><a href='/'>Logo</a></li> */}
            <li className='nav' style={{float: "left"}}>
                <Link to="/" className="logo-link">
                    <FaMapMarkerAlt className="logo-icon" />
                    <span className="logo-explore">Explore</span>
                    <span className="logo-local">Local</span>
                </Link>
            </li>
            {isLoggedIn ? (
                <li className='nav'><a className='text-drop-shadow' onClick={Logout}>Logout</a></li>
            ) : (
                <li className='nav'><a className='text-drop-shadow' onClick={Login}>Login</a></li>
            )}
            <li className='nav'><a className='text-drop-shadow' href=''>Write a Review</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>My Businesses</a></li>            
        </ul>
    )
}

export default NavBar;