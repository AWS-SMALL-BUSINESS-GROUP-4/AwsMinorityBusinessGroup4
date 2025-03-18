import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessForm } from './BusinessFormContext';
import { stepToRouteMap } from './BusinessFormContext';
import './BusinessCreationForm.css';

export default function BusinessHours() {
  const {
    step,
    setStep,
    formData,
    handleHoursChange,
    isStepComplete,
    nextStep,
    prevStep
  } = useBusinessForm();
  const navigate = useNavigate();

  function handleSidebarClick(e, targetStep) {
    e.preventDefault();
    setStep(targetStep);
    navigate(stepToRouteMap[targetStep]);
  }

  return (
    <div className="form-container">
      <header className="header">
        <div className="nav-content">
          <div className="header-left">
            <span className="logo-text">Logo</span>
            <span className="for-businesses">for Businesses</span>
          </div>
          <nav className="header-nav">
            <a href="#">My Business</a>
            <a href="#">Account Settings</a>
            <a href="#">Support</a>
          </nav>
        </div>
      </header>

      <div className="form-area step8-wrapper">
        <div className="sidebar">
          <a
            href="#"
            className={step === 8 ? 'active' : ''}
            onClick={(e) => handleSidebarClick(e, 8)}
          >
            Business hours
          </a>
          <a
            href="#"
            className={step === 9 ? 'active' : ''}
            onClick={(e) => handleSidebarClick(e, 9)}
          >
            Description
          </a>
          <a
            href="#"
            className={step === 10 ? 'active' : ''}
            onClick={(e) => handleSidebarClick(e, 10)}
          >
            Photos
          </a>
        </div>

        <div className="step8-content">
          <div className="grey-container wide">
            <div className="form-step">
              <h1>Business Hours</h1>
              <p>Let customers know when you’re open by adding your regular hours.</p>
              <div className="hours-list">
                {formData.businessHours.map((dayObj, index) => (
                  <div key={index} className="day-row">
                    <div className="day-name">{dayObj.day}</div>
                    <div className="time-slot">
                      <div className="time-select">
                        <label>Opens at</label>
                        <input
                          type="time"
                          value={dayObj.openTime}
                          onChange={(e) =>
                            !dayObj.isOpen24 &&
                            !dayObj.isClosed &&
                            handleHoursChange(index, 'openTime', e.target.value)
                          }
                          disabled={dayObj.isOpen24 || dayObj.isClosed}
                        />
                      </div>
                      <div className="time-select">
                        <label>Closes at</label>
                        <input
                          type="time"
                          value={dayObj.closeTime}
                          onChange={(e) =>
                            !dayObj.isOpen24 &&
                            !dayObj.isClosed &&
                            handleHoursChange(index, 'closeTime', e.target.value)
                          }
                          disabled={dayObj.isOpen24 || dayObj.isClosed}
                        />
                      </div>
                    </div>
                    <div className="checkbox-group">
                      <div id="isopen24">
                        <input
                          className="checkbox"
                          type="checkbox"
                          checked={dayObj.isOpen24}
                          onChange={(e) => handleHoursChange(index, 'isOpen24', e.target.checked)}
                        />
                        Open 24 hours
                      </div>
                      <div id="isclosed">
                        <input
                          className="checkbox"
                          type="checkbox"
                          checked={dayObj.isClosed}
                          onChange={(e) => handleHoursChange(index, 'isClosed', e.target.checked)}
                        />
                        Closed
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="button-group step8-buttons">
                <button
                  className={`continue-button save-continue-button ${
                    !isStepComplete(step) ? 'disabled' : ''
                  }`}
                  onClick={nextStep}
                  disabled={!isStepComplete(step)}
                >
                  Save and continue
                </button>
                <button className="skip-button" onClick={nextStep}>
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="right-space"></div>
      </div>
    </div>
  );
}
