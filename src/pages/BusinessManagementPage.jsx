import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import "../App.css";
import "../components/ContainerStyles.css";
import "./BusinessManagementPage.css";
import "../components/TextStyles.css";
import BusinessNavBar from "../components/NavBar";

function BusinessManagementPage() {
  const location = useLocation();
  const { formData } = location.state || {};

  const [isEditing, setIsEditing] = useState(false);

  const [business, setBusiness] = useState({
    name: '',
    address_1: '',
    address_2: '',
    phone: '',
    categories: '',
    website: '',
    hours: [],
    about: '',
  });

  const [storedState, setStoredState] = useState(business);

  useEffect(() => {
    if (formData) {
      const hours = formData.businessHours.map(dayObj => {
        if (dayObj.isClosed) {
          return 'Closed';
        } else if (dayObj.isOpen24) {
          return 'Open 24 hours';
        } else if (dayObj.openTime && dayObj.closeTime) {
          return `${dayObj.openTime} - ${dayObj.closeTime}`;
        } else {
          return 'Not set';
        }
      });

      const newBusiness = {
        name: formData.businessName,
        address_1: formData.street,
        address_2: `${formData.city}, ${formData.state} ${formData.zip}`,
        phone: formData.phoneNumber,
        categories: formData.categories,
        website: formData.website,
        hours: hours,
        about: formData.description,
      };

      setBusiness(newBusiness);
      setStoredState(newBusiness);
    }
  }, [formData]);

  // Handle input changes
  const handleChange = (e, field, index = null) => {
    if (index !== null) {
      // Handle hours array update
      const updatedHours = [...business.hours];
      updatedHours[index] = e.target.value;
      setBusiness({
        ...business,
        hours: updatedHours,
      });
    } else {
      // Handle regular field update
      setBusiness({
        ...business,
        [field]: e.target.value,
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

  return (
    <>
      <BusinessNavBar />
      <div className="sidebar-page-container">
        {/*Sidebar Nav*/}
        <div className="sidebar">
          <a href="">Business Information</a>
          <a href="">Reviews</a>
          <a href="">Photos</a>
        </div>

        {/*Main content*/}
        <div className="main">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
          <hr />
          <h2>Basic Information</h2>
          {isEditing ? (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Business Name:
                </label>
                <input
                  type="text"
                  value={business.name}
                  onChange={(e) => handleChange(e, "name")}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Address Line 1:
                </label>
                <input
                  type="text"
                  value={business.address_1}
                  onChange={(e) => handleChange(e, "address_1")}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Address Line 2:
                </label>
                <input
                  type="text"
                  value={business.address_2}
                  onChange={(e) => handleChange(e, "address_2")}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Phone:
                </label>
                <input
                  type="text"
                  value={business.phone}
                  onChange={(e) => handleChange(e, "phone")}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Categories:
                </label>
                <input
                  type="text"
                  value={business.categories}
                  onChange={(e) => handleChange(e, "categories")}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Website:
                </label>
                <input
                  type="text"
                  value={business.website}
                  onChange={(e) => handleChange(e, "website")}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
            </div>
          ) : (
            <p>
              {business.name}
              <br />
              {business.address_1}
              <br />
              {business.address_2}
              <br />
              <br />
              {business.phone}
              <br />
              <br />
              <b>Categories</b>: {business.categories}
              <br />
              {business.website}
            </p>
          )}
          <hr />
          <h2>Hours</h2>
          <table className="hours">
            <tbody>
              {business.hours.map((hour, index) => (
                <tr key={index}>
                  <th>{days[index]}</th>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={hour}
                        onChange={(e) => handleChange(e, "hours", index)}
                        style={{ width: "100%", padding: "5px" }}
                      />
                    ) : (
                      hour
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <h2>About</h2>
          {isEditing ? (
            <textarea
              value={business.about}
              onChange={(e) => handleChange(e, "about")}
              style={{ width: "100%", minHeight: "200px", padding: "10px" }}
            />
          ) : (
            <p>{business.about}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default BusinessManagementPage;