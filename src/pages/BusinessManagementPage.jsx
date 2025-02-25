import '../App.css'
import '../styles/styles.css'
import BusinessNavBar from '../components/BusinessNavBar'

function BusinessManagementPage() {
    const name = "Negril";
    const address_1 = "2301 Georgia Ave. NW";
    const address_2 = "Washington, DC 20001";
    const phone = "(202) 332-3737";
    const categories = "Restaurants, Jamaican";
    const website = "negrileats.com";
    const hours = [
        "10:30 am - 7:30 pm",
        "10:30 am - 7:30 pm",
        "10:30 am - 7:30 pm",
        "10:30 am - 7:30 pm",
        "10:30 am - 7:30 pm",
        "Closed",
        "Closed"
    ];
    const about = `Founded in 1979 by Jamaican native Earl Chinn, Negril Jamaican Eatery is a family-owned, fast casual storefront serving up a taste of the island. In 1975 Earl visited his sister in Washington, DC where he couldn’t find any authentic Jamaican eateries, so he later returned to open his own, supplying the bold foods and flavors of his homeland to Caribbean expats and local fans of Jamaican cuisine.
                    Negril Eats’ popularity in DC—and today’s growing Caribbean communities in the DC Metro Area—led to the gradual expansion of Negril the Jamaican Eatery into Mitchellville, Silver Spring, and Laurel, MD. Each location offers the complete menu, highlighting the most popular favorites of each storefront.
                    Today, Earl’s sister, Marguerite, his two sons, and his extended family manage the four Negril Eats locations. Like their father before them, Earl’s sons subscribe to the Jamaican national motto, “Out of Many, One People.” For the Chinns, traditionally prepared, tasty to-go meals unite their customers as blue-collar laborers, lawyers, retail salespeople, clerks, and other DC professionals line up together to pick up their jerk chicken, oxtail, or escoveitch fish.`;
    

    return(
        <>
            <BusinessNavBar/>
            <div className='sidebar-page-container'>
                {/*Sidebar Nav*/}
                <div class="sidebar">
                    <a href="">Business Information</a>
                    <a href="">Reviews</a>
                    <a href="">Photos</a>
                </div>

                {/*Main content*/}
                <div class="main">
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <h1>Business Information</h1>
                        <button>Edit</button>
                    </div>
                    <hr/>
                    <h2>Basic Information</h2>
                    <p>
                        {name}<br/>
                        {address_1}<br/>
                        {address_2}<br/><br/>
                        {phone}<br/><br/>
                        <b>Categories</b>: {categories}<br/>
                        {website}
                    </p>
                    <hr/>
                    <h2>Hours</h2>
                    <table className='hours'>
                        <tr><th>Mon</th><td>{hours[0]}</td></tr>
                        <tr><th>Tues</th><td>{hours[1]}</td></tr>
                        <tr><th>Wed</th><td>{hours[2]}</td></tr>
                        <tr><th>Thurs</th><td>{hours[3]}</td></tr>
                        <tr><th>Fri</th><td>{hours[4]}</td></tr>
                        <tr><th>Sat</th><td>{hours[5]}</td></tr>
                        <tr><th>Sun</th><td>{hours[6]}</td></tr>
                    </table>
                    <hr/>
                    <h2>About</h2>
                    <p>
                        {about}
                    </p>
                </div>
            </div>
        </>
    )
}

export default BusinessManagementPage