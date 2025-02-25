import { useState } from 'react';
import '../App.css'
import '../styles/styles.css'
import BusinessNavBar from '../components/BusinessNavBar'

function BusinessManagementPage() {
    // State to track if edit mode is active
    const [isEditing, setIsEditing] = useState(false);

    const [business, setBusiness] = useState({
        name: "Negril",
        address_1: "2301 Georgia Ave. NW",
        address_2: "Washington, DC 20001",
        phone: "(202) 332-3737",
        categories: "Restaurants, Jamaican",
        website: "negrileats.com",
        hours: [
            "10:30 am - 7:30 pm",
            "10:30 am - 7:30 pm",
            "10:30 am - 7:30 pm",
            "10:30 am - 7:30 pm",
            "10:30 am - 7:30 pm",
            "Closed",
            "Closed"
        ],
        about: `Founded in 1979 by Jamaican native Earl Chinn, Negril Jamaican Eatery is a family-owned, fast casual storefront serving up a taste of the island. In 1975 Earl visited his sister in Washington, DC where he couldn’t find any authentic Jamaican eateries, so he later returned to open his own, supplying the bold foods and flavors of his homeland to Caribbean expats and local fans of Jamaican cuisine.
                Negril Eats’ popularity in DC—and today’s growing Caribbean communities in the DC Metro Area—led to the gradual expansion of Negril the Jamaican Eatery into Mitchellville, Silver Spring, and Laurel, MD. Each location offers the complete menu, highlighting the most popular favorites of each storefront.
                Today, Earl’s sister, Marguerite, his two sons, and his extended family manage the four Negril Eats locations. Like their father before them, Earl’s sons subscribe to the Jamaican national motto, “Out of Many, One People.” For the Chinns, traditionally prepared, tasty to-go meals unite their customers as blue-collar laborers, lawyers, retail salespeople, clerks, and other DC professionals line up together to pick up their jerk chicken, oxtail, or escoveitch fish.`
    });

    const [storedState, setStoredState] = useState(business);

    // Handle input changes
    const handleChange = (e, field, index = null) => {
        if (index !== null) {
            // Handle hours array update
            const updatedHours = [...business.hours];
            updatedHours[index] = e.target.value;
            setBusiness({
                ...business,
                hours: updatedHours
            });
        } else {
            // Handle regular field update
            setBusiness({
                ...business,
                [field]: e.target.value
            });
        }
    };
    
    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    // Save changes
    const saveChanges = () => {
        // Here you would typically send updated data to your backend
        console.log("Saving changes:", business);
        setStoredState(business);
        setIsEditing(false);
    };

    // Cancel editing
    const cancelEdit = () => {
        // Reset to original data if needed
        setIsEditing(false);
        setBusiness(storedState);
    };

    // Day names for hours table
    const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

    return(
        <>
            <BusinessNavBar/>
            <div className='sidebar-page-container'>
                {/*Sidebar Nav*/}
                <div className="sidebar">
                    <a href="">Business Information</a>
                    <a href="">Reviews</a>
                    <a href="">Photos</a>
                </div>

                {/*Main content*/}
                <div className="main">
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <h1>Business Information</h1>
                        {isEditing ? (
                            <div>
                                <button onClick={saveChanges}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </div>

                        ) : (
                            <button onClick={toggleEditMode}>Edit</button>
                        )}
                    </div>
                    <hr/>
                    <h2>Basic Information</h2>
                    {isEditing ? (
                        <div style={{marginBottom: '20px'}}>
                            <div style={{marginBottom: '10px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Business Name:</label>
                                <input 
                                    type="text" 
                                    value={business.name} 
                                    onChange={(e) => handleChange(e, 'name')}
                                    style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                                />
                            </div>
                            
                            <div style={{marginBottom: '10px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Address Line 1:</label>
                                <input 
                                    type="text" 
                                    value={business.address_1} 
                                    onChange={(e) => handleChange(e, 'address_1')}
                                    style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                                />
                            </div>
                            
                            <div style={{marginBottom: '10px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Address Line 2:</label>
                                <input 
                                    type="text" 
                                    value={business.address_2} 
                                    onChange={(e) => handleChange(e, 'address_2')}
                                    style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                                />
                            </div>
                            
                            <div style={{marginBottom: '10px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Phone:</label>
                                <input 
                                    type="text" 
                                    value={business.phone} 
                                    onChange={(e) => handleChange(e, 'phone')}
                                    style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                                />
                            </div>
                            
                            <div style={{marginBottom: '10px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Categories:</label>
                                <input 
                                    type="text" 
                                    value={business.categories} 
                                    onChange={(e) => handleChange(e, 'categories')}
                                    style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                                />
                            </div>
                            
                            <div style={{marginBottom: '10px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Website:</label>
                                <input 
                                    type="text" 
                                    value={business.website} 
                                    onChange={(e) => handleChange(e, 'website')}
                                    style={{width: '100%', padding: '8px'}}
                                />
                            </div>
                        </div>
                    ) : (
                    <p>
                        {business.name}<br/>
                        {business.address_1}<br/>
                        {business.address_2}<br/><br/>
                        {business.phone}<br/><br/>
                        <b>Categories</b>: {business.categories}<br/>
                        {business.website}
                    </p>
                    )}
                    <hr/>
                    <h2>Hours</h2>
                    <table className='hours'>
                        <tbody>
                            {business.hours.map((hour, index) => (
                                <tr key={index}>
                                    <th>{days[index]}</th>
                                    <td>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={hour} 
                                                onChange={(e) => handleChange(e, 'hours', index)}
                                                style={{width: '100%', padding: '5px'}}
                                            />
                                        ) : hour}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr/>
                    <h2>About</h2>
                    {isEditing ? (
                        <textarea 
                            value={business.about} 
                            onChange={(e) => handleChange(e, 'about')}
                            style={{width: '100%', minHeight: '200px', padding: '10px'}}
                        />
                    ) : (
                        <p>{business.about}</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default BusinessManagementPage