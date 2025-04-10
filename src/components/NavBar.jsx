import { useContext } from 'react'
import '../App.css'
import './NavBar.css'
import './TextStyles.css'
import { AuthContext } from "../AuthContext"
import {Login, Logout } from "../LoginFunctions";

function NavBar() {
    const { isAuthenticated, loading } = useContext(AuthContext);

    console.log("Nav bar auth: ", isAuthenticated);
    // if(loading)
    //     return <p>Loading...</p>
    return (
        <ul className='nav orange-background'>
            <li className='nav' style={{float: "left"}}><a href='/'>Logo</a></li>
            {isAuthenticated ? (
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