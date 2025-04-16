import '../App.css'
import './NavBar.css'
import './TextStyles.css'
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function BusinessNavBar() {
    function handleclick() {
        alert('You clicked me!');
    }


    return (
        <ul className='nav orange-background'>
            <li className='nav' style={{float: "left"}}>
                <Link to="/" className="logo-link">
                    <FaMapMarkerAlt className="logo-icon" />
                    <span className="logo-explore">Explore</span>
                    <span className="logo-local">Local</span>
                </Link>
            </li>
            <li className='nav'><a className='text-drop-shadow' href=''>Support</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>Account Settings</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>My Business</a></li>            
        </ul>
    )
}

export default BusinessNavBar