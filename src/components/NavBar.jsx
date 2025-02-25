import '../App.css'
import '../styles/styles.css'
import '../styles/navbarstyles.css'

function NavBar() {
    function handleclick() {
        alert('You clicked me!');
    }


    return (
        <ul className='nav orange-background'>
            <li className='nav' style={{float: "left"}}><a href=''>Logo</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>Login</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>Write a Review</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>My Businesses</a></li>            
        </ul>
    )
}

export default NavBar