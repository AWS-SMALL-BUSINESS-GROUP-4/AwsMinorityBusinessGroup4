import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import '../App.css';
import '../components/ContainerStyles.css';
import './BusinessManagementPage.css';
import '../components/TextStyles.css';
import BusinessNavBar from '../components/BusinessNavBar';
import BusinessManagementSidebar from '../components/BusinessManagementSideBar';
import { generateClient } from 'aws-amplify/data';

function BusinessManagementPage({ id }) {
  const client = generateClient();
  const location = useLocation(); // Get navigation state

  // State to track if edit mode is active
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default business data
  const [business, setBusiness] = useState({
    name: 'Negril',
    address_1: '2301 Georgia Ave. NW',
    address_2: 'Washington, DC 20001',
    phone: '(202) 332-3737',
    categories: 'Restaurants, Jamaican',
    website: 'negrileats.com',
    hours: [
      { day: 'Monday', openTime: '10:30', closeTime: '19:30', isOpen24: false, isClosed: false },
      { day: 'Tuesday', openTime: '10:30', closeTime: '19:30', isOpen24: false, isClosed: false },
      { day: 'Wednesday', openTime: '10:30', closeTime: '19:30', isOpen24: false, isClosed: false },
      { day: 'Thursday', openTime: '10:30', closeTime: '19:30', isOpen24: false, isClosed: false },
      { day: 'Friday', openTime: '10:30', closeTime: '19:30', isOpen24: false, isClosed: false },
      { day: 'Saturday', openTime: '10:30', closeTime: '19:30', isOpen24: false, isClosed: true },
      { day: 'Sunday', openTime: '10:30', closeTime: '19:30', isOpen24: false, isClosed: true },
    ],
    about: `Founded in 1979 by Jamaican native Earl Chinn, Negril Jamaican Eatery is a family-owned, fast casual storefront serving up a taste of the island...`,
  });

  const [storedState, setStoredState] = useState(business);

  // Fetch business data from backend
  useEffect(() => {
    async function fetchBusiness() {
      try {
        if (id) {
          const { data: fb, errors } = await client.models.Business.get({ id });
          if (errors) throw new Error(errors[0].message);
          if (fb) {
            const parsedHours = fb.businessHours ? JSON.parse(fb.businessHours) : business.hours;
            setBusiness({
              name: fb.name || '',
              address_1: fb.streetAddress || '',
              address_2: `${fb.city || ''}, ${fb.state || ''} ${fb.zipcode || ''}`,
              phone: fb.phoneNumber || '',
              categories: fb.category || '',
              website: fb.website || '',
              hours: parsedHours,
              about: fb.description || '',
            });
            setStoredState({
              ...business,
              hours: parsedHours,
            });
          }
        }
      } catch (e) {
        console.error('Error fetching business:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [id]);

  // Update business with formData from navigation state
  useEffect(() => {
    const formData = location.state?.formData; // Access formData from navigation state
    if (formData) {
      const hours = (formData.businessHours || []).map((dayObj) => ({
        day: dayObj.day,
        openTime: dayObj.isClosed ? '' : dayObj.isOpen24 ? '00:00' : dayObj.openTime || '',
        closeTime: dayObj.isClosed ? '' : dayObj.isOpen24 ? '00:00' : dayObj.closeTime || '',
        isOpen24: dayObj.isOpen24,
        isClosed: dayObj.isClosed,
      }));

      const newBusiness = {
        name: formData.businessName || '',
        address_1: formData.street || '',
        address_2: `${formData.city || ''}, ${formData.state || ''} ${formData.zip || ''}`,
        phone: formData.phoneNumber ? `+1${formData.phoneNumber}` : '',
        categories: formData.categories || '',
        website: formData.website || '',
        hours,
        about: formData.description || '',
      };

      console.log('Updated business with formData:', newBusiness);
      setBusiness(newBusiness);
      setStoredState(newBusiness);
    }
  }, [location.state]);

  const handleChange = (e, field, index = null) => {
    if (index !== null) {
      const updatedHours = [...business.hours];
      updatedHours[index] = {
        ...updatedHours[index],
        [e.target.name]: e.target.value, // Assumes inputs have name="openTime" or "closeTime"
      };
      setBusiness({ ...business, hours: updatedHours });
    } else {
      setBusiness({ ...business, [field]: e.target.value });
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  const saveChanges = () => {
    console.log('Saving changes:', business);
    setStoredState(business);
    setIsEditing(false);
    // TODO: Add logic to save changes to backend if needed
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setBusiness(storedState);
  };

  function convertTo12Hour(time) {
    if (!time) return 'Not set';
    let [hours, minutes] = time.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <BusinessNavBar />
      <div className="sidebar-page-container">
        <BusinessManagementSidebar />
        <div className="main">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1 className="blue-text">Business Information</h1>
            {isEditing ? (
              <div>
                <button className="btn" onClick={saveChanges}>
                  Save
                </button>
                <button className="btn" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="btn" onClick={toggleEditMode}>
                Edit
              </button>
            )}
          </div>
          <hr />
          <h2 className="blue-text">Basic Information</h2>
          {isEditing ? (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Business Name:</label>
                <input
                  type="text"
                  value={business.name}
                  onChange={(e) => handleChange(e, 'name')}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Address Line 1:</label>
                <input
                  type="text"
                  value={business.address_1}
                  onChange={(e) => handleChange(e, 'address_1')}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Address Line 2:</label>
                <input
                  type="text"
                  value={business.address_2}
                  onChange={(e) => handleChange(e, 'address_2')}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
                <input
                  type="text"
                  value={business.phone}
                  onChange={(e) => handleChange(e, 'phone')}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Categories:</label>
                <input
                  type="text"
                  value={business.categories}
                  onChange={(e) => handleChange(e, 'categories')}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Website:</label>
                <input
                  type="text"
                  value={business.website}
                  onChange={(e) => handleChange(e, 'website')}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
            </div>
          ) : (
            <p>
              {business.name || 'Not set'}<br />
              {business.address_1 || 'Not set'}<br />
              {business.address_2 || 'Not set'}<br />
              <br />
              {business.phone || 'Not set'}<br />
              <br />
              <b>Categories</b>: {business.categories || 'Not set'}<br />
              {business.website || 'Not set'}
            </p>
          )}
          <hr />
          <h2 className="blue-text">Hours</h2>
          <table className="hours">
            <tbody>
              {business.hours.map((hour, index) => (
                <tr key={index}>
                  <th>{hour.day}</th>
                  <td className="spread">
                    {isEditing ? (
                      <>
                        <input
                          type="time"
                          name="openTime"
                          value={hour.openTime}
                          onChange={(e) => handleChange(e, 'hours', index)}
                          style={{ width: '100%', padding: '5px' }}
                        />{' '}
                        -{' '}
                        <input
                          type="time"
                          name="closeTime"
                          value={hour.closeTime}
                          onChange={(e) => handleChange(e, 'hours', index)}
                          style={{ width: '100%', padding: '5px' }}
                        />
                      </>
                    ) : (
                      <p>
                        {hour.isClosed
                          ? 'Closed'
                          : hour.isOpen24
                          ? 'Open 24 hours'
                          : `${convertTo12Hour(hour.openTime)} - ${convertTo12Hour(hour.closeTime)}`}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <h2 className="blue-text">About</h2>
          {isEditing ? (
            <textarea
              value={business.about}
              onChange={(e) => handleChange(e, 'about')}
              style={{ width: '100%', minHeight: '200px', padding: '10px' }}
            />
          ) : (
            <p>{business.about || 'Not set'}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default BusinessManagementPage;