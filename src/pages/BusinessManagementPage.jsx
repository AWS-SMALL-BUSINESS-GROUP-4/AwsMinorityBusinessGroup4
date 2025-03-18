// BusinessManagementPage.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";
import "../components/ContainerStyles.css";
import "./BusinessManagementPage.css";
import "../components/TextStyles.css";
import BusinessNavBar from "../components/NavBar";

function BusinessManagementPage() {
  const location = useLocation();
  const { formData: formDataFromState } = location.state || {};

  // Function to convert 24-hour time to 12-hour AM/PM format
  const formatTimeTo12Hour = (time) => {
    if (!time || time === '') return '';
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const adjustedHour = hourNum % 12 || 12; // Convert 0 or 12 to 12
    return `${adjustedHour}:${minutes} ${period}`;
  };

  const [business, setBusiness] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem("businessFormData"));
    const initialData = formDataFromState || storedData || {
      name: "",
      address_1: "",
      address_2: "",
      phone: "",
      categories: "",
      website: "",
      hours: [],
      about: "",
    };

    console.log('Initial data source:', { formDataFromState, storedData, initialData });

    if (initialData.businessName || initialData.name) {
      const hours = (initialData.businessHours || []).map((dayObj) => {
        if (dayObj.isClosed) return "Closed";
        if (dayObj.isOpen24) return "Open 24 hours";
        if (dayObj.openTime && dayObj.closeTime) {
          return `${formatTimeTo12Hour(dayObj.openTime)} - ${formatTimeTo12Hour(dayObj.closeTime)}`;
        }
        return "Not set";
      });

      const transformed = {
        name: initialData.businessName || "",
        address_1: initialData.street || "",
        address_2: `${initialData.city || ""}, ${initialData.state || ""} ${initialData.zip || ""}`,
        phone: initialData.phoneNumber ? `+1${initialData.phoneNumber}` : "", // Add +1 prefix
        categories: initialData.categories || "",
        website: initialData.website || "",
        hours: hours.length > 0 ? hours : [],
        about: initialData.description || "",
      };
      console.log('Transformed business data:', transformed);
      return transformed;
    }

    return {
      ...initialData,
      phone: initialData.phoneNumber ? `+1${initialData.phoneNumber}` : "", // Add +1 prefix
      hours: initialData.hours || [],
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [storedState, setStoredState] = useState(business);

  useEffect(() => {
    if (formDataFromState) {
      const hours = (formDataFromState.businessHours || []).map((dayObj) => {
        if (dayObj.isClosed) return "Closed";
        if (dayObj.isOpen24) return "Open 24 hours";
        if (dayObj.openTime && dayObj.closeTime) {
          return `${formatTimeTo12Hour(dayObj.openTime)} - ${formatTimeTo12Hour(dayObj.closeTime)}`;
        }
        return "Not set";
      });

      const newBusiness = {
        name: formDataFromState.businessName || "",
        address_1: formDataFromState.street || "",
        address_2: `${formDataFromState.city || ""}, ${formDataFromState.state || ""} ${formDataFromState.zip || ""}`,
        phone: formDataFromState.phoneNumber ? `+1${formDataFromState.phoneNumber}` : "", // Add +1 prefix
        categories: formDataFromState.categories || "",
        website: formDataFromState.website || "",
        hours: hours.length > 0 ? hours : [],
        about: formDataFromState.description || "",
      };

      console.log('Updated business with formData:', newBusiness);
      setBusiness(newBusiness);
      setStoredState(newBusiness);
    }
  }, [formDataFromState]);

  const handleChange = (e, field, index = null) => {
    if (index !== null) {
      const updatedHours = [...business.hours];
      updatedHours[index] = e.target.value;
      setBusiness({ ...business, hours: updatedHours });
    } else {
      setBusiness({ ...business, [field]: e.target.value });
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  const saveChanges = () => {
    console.log("Saving changes:", business);
    setStoredState(business);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setBusiness(storedState);
  };

  const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

  return (
    <>
      <BusinessNavBar />
      <div className="sidebar-page-container">
        <div className="sidebar">
          <a href="#">Business Information</a>
          <a href="#">Reviews</a>
          <a href="#">Photos</a>
        </div>
        <div className="main">
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
                <label style={{ display: "block", marginBottom: "5px" }}>Business Name:</label>
                <input type="text" value={business.name} onChange={(e) => handleChange(e, "name")} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Address Line 1:</label>
                <input type="text" value={business.address_1} onChange={(e) => handleChange(e, "address_1")} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Address Line 2:</label>
                <input type="text" value={business.address_2} onChange={(e) => handleChange(e, "address_2")} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Phone:</label>
                <input type="text" value={business.phone} onChange={(e) => handleChange(e, "phone")} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Categories:</label>
                <input type="text" value={business.categories} onChange={(e) => handleChange(e, "categories")} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Website:</label>
                <input type="text" value={business.website} onChange={(e) => handleChange(e, "website")} style={{ width: "100%", padding: "8px" }} />
              </div>
            </div>
          ) : (
            <p>
              {business.name || "Not set"}<br />
              {business.address_1 || "Not set"}<br />
              {business.address_2 || "Not set"}<br /><br />
              {business.phone || "Not set"}<br /><br />
              <b>Categories</b>: {business.categories || "Not set"}<br />
              {business.website || "Not set"}
            </p>
          )}
          <hr />
          <h2>Hours</h2>
          <table className="hours">
            <tbody>
              {business.hours && business.hours.length === 7 ? (
                days.map((day, index) => (
                  <tr key={index}>
                    <th>{day}</th>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={business.hours[index]}
                          onChange={(e) => handleChange(e, "hours", index)}
                          style={{ width: "100%", padding: "5px" }}
                        />
                      ) : (
                        business.hours[index]
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Hours not set</td>
                </tr>
              )}
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
            <p>{business.about || "Not set"}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default BusinessManagementPage;