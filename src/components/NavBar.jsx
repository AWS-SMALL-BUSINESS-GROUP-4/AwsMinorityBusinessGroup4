import { useContext } from 'react'
import '../App.css'
import './NavBar.css'
import './TextStyles.css'
import { signInWithRedirect, signOut  } from "@aws-amplify/auth"
import { AuthContext } from "../AuthContext"
import {handleLogin, handleLogout } from "../LoginFunctions";

function NavBar() {
    const { isAuthenticated, loading } = useContext(AuthContext);

    function handleclick() {
        alert('You clicked me!');
    }

    console.log("Nav bar auth: ", isAuthenticated);
    // if(loading)
    //     return <p>Loading...</p>
    return (
        <ul className='nav orange-background'>
            <li className='nav' style={{float: "left"}}><a href='/'>Logo</a></li>
            {isAuthenticated ? (
                <li className='nav'><a className='text-drop-shadow' onClick={handleLogout}>Logout</a></li>
            ) : (
                <li className='nav'><a className='text-drop-shadow' onClick={handleLogin}>Login</a></li>
            )}
            <li className='nav'><a className='text-drop-shadow' href=''>Write a Review</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>My Businesses</a></li>            
        </ul>
    )
}

export default NavBar;