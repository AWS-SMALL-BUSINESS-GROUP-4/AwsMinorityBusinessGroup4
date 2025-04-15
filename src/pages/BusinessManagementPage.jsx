import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';
import '../components/ContainerStyles.css';
import './BusinessManagementPage.css';
import '../components/TextStyles.css';
import BusinessManagementSidebar from '../components/BusinessManagementSideBar';
import { generateClient } from 'aws-amplify/data';
import { FaMapMarkerAlt, FaPhone, FaGlobe, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function BusinessManagementPage({ id }) {
  const client = generateClient();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const formData = location.state?.formData;
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

      setBusiness(newBusiness);
      setStoredState(newBusiness);
    }
  }, [location.state]);

  const handleChange = (e, field, index = null) => {
    if (index !== null) {
      const updatedHours = [...business.hours];
      updatedHours[index] = {
        ...updatedHours[index],
        [e.target.name]: e.target.value,
      };
      setBusiness({ ...business, hours: updatedHours });
    } else {
      setBusiness({ ...business, [field]: e.target.value });
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  const saveChanges = () => {
    setStoredState(business);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setBusiness(storedState);
  };

  function convertTo12Hour(time) {
    if (!time) return 'Not set';
    let [hours, minutes] = time.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="management-container">
      <header className="revamped-header">
        <div className="nav-content">
          <div className="header-left">
            <Link to="/" className="logo-link">
              <span className="logo-icon">
                <FaMapMarkerAlt />
              </span>
              <span className="logo-text revamped-logo">
                <span className="logo-explore">Explore</span>
                <span className="logo-local">Local</span>
              </span>
            </Link>
          </div>
          <nav className="header-nav">
            <a href="#">Home</a>
            <a href="#">Support</a>
            <a href="#">Logout</a>
          </nav>
        </div>
      </header>
      <div className="management-content">
        <BusinessManagementSidebar />
        <div className="management-main">
          <div className="revamped-profile-panel">
            <div className="profile-header">
              <h1 className="business-name">{business.name || 'Not set'}</h1>
            </div>
            <div className="section">
              <div className="section-header">
                <h2>Basic Information</h2>
                {isEditing ? (
                  <div className="action-buttons">
                    <button className="revamped-continue-button save-button" onClick={saveChanges}>
                      Save
                    </button>
                    <button className="revamped-skip-button cancel-button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="revamped-continue-button edit-button" onClick={toggleEditMode}>
                    Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="edit-form">
                  <label className="input-label">Business Name</label>
                  <input
                    type="text"
                    className="revamped-input"
                    value={business.name}
                    onChange={(e) => handleChange(e, 'name')}
                  />
                  <label className="input-label">Address Line 1</label>
                  <input
                    type="text"
                    className="revamped-input"
                    value={business.address_1}
                    onChange={(e) => handleChange(e, 'address_1')}
                  />
                  <label className="input-label">Address Line 2</label>
                  <input
                    type="text"
                    className="revamped-input"
                    value={business.address_2}
                    onChange={(e) => handleChange(e, 'address_2')}
                  />
                  <label className="input-label">Phone</label>
                  <input
                    type="text"
                    className="revamped-input"
                    value={business.phone}
                    onChange={(e) => handleChange(e, 'phone')}
                  />
                  <label className="input-label">Categories</label>
                  <input
                    type="text"
                    className="revamped-input"
                    value={business.categories}
                    onChange={(e) => handleChange(e, 'categories')}
                  />
                  <label className="input-label">Website</label>
                  <input
                    type="text"
                    className="revamped-input"
                    value={business.website}
                    onChange={(e) => handleChange(e, 'website')}
                  />
                </div>
              ) : (
                <div className="info-display">
                  <p className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    {business.address_1 || 'Not set'}, {business.address_2 || 'Not set'}
                  </p>
                  <p className="info-item">
                    <FaPhone className="info-icon" />
                    {business.phone || 'Not set'}
                  </p>
                  <p className="info-item">
                    <strong>Categories:</strong> {business.categories || 'Not set'}
                  </p>
                  <p className="info-item">
                    <FaGlobe className="info-icon" />
                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                      {business.website || 'Not set'}
                    </a>
                  </p>
                </div>
              )}
            </div>
            <div className="section">
              <h2 className="section-header">Hours</h2>
              <table className="revamped-hours-table">
                <tbody>
                  {business.hours.map((hour, index) => (
                    <tr key={index} className="hours-row">
                      <th className="hours-day">{hour.day}</th>
                      <td className="hours-time">
                        {isEditing ? (
                          <div className="time-inputs">
                            <input
                              type="time"
                              name="openTime"
                              className="revamped-input time-input"
                              value={hour.openTime}
                              onChange={(e) => handleChange(e, 'hours', index)}
                            />
                            <span> - </span>
                            <input
                              type="time"
                              name="closeTime"
                              className="revamped-input time-input"
                              value={hour.closeTime}
                              onChange={(e) => handleChange(e, 'hours', index)}
                            />
                          </div>
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
            </div>
            <div className="section">
              <h2 className="section-header">About</h2>
              {isEditing ? (
                <textarea
                  className="revamped-textarea"
                  value={business.about}
                  onChange={(e) => handleChange(e, 'about')}
                />
              ) : (
                <p className="about-text">{business.about || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="revamped-footer">
        <div className="revamped-footer-content">
          <div className="revamped-footer-logo">
            <span className="logo-explore">Explore</span>
            <span className="logo-local">Local</span>
          </div>
          <div className="revamped-footer-links">
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="revamped-social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
        <div className="revamped-copyright">© ExploreLocal 2025 All Reserved.</div>
      </footer>
    </div>
  );
}

export default BusinessManagementPage;