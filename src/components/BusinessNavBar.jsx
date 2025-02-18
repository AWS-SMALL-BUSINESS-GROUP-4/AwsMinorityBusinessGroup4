import '../App.css'
import '../styles/styles.css'
import '../styles/navbarstyles.css'

function BusinessNavBar() {
    function handleclick() {
        alert('You clicked me!');
    }


    return (
        <ul className='nav orange-background'>
            <li className='nav' style={{float: "left"}}><a href=''>Logo for Businesses</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>Support</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>Account Settings</a></li>
            <li className='nav'><a className='text-drop-shadow' href=''>My Business</a></li>            
        </ul>
    )
}

export default BusinessNavBar