import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BusinessFormProvider } from './BusinessFormContext';

// Updated file names for steps.
import BusinessName from './BusinessName';
import BusinessEmail from './BusinessEmail';
import BusinessPhone from './BusinessPhone';
import BusinessWebsite from './BusinessWebsite';
import BusinessCategories from './BusinessCategories';
import BusinessAddress from './BusinessAddress';
import BusinessAccount from './BusinessAccount';
import BusinessHours from './BusinessHours';
import BusinessDescription from './BusinessDescription';
import BusinessPhotos from './BusinessPhotos';

/**
 * A component to handle the empty subpath "/my-businesses"
 * where Cognito typically returns the user.
 */
function RedirectFromRoot() {
  return <div>Loading...</div>;
}

export default function BusinessFormRoutes() {
  return (
    <BusinessFormProvider>
      <Routes>
        <Route path="" element={<RedirectFromRoot />} />

        <Route path="business-name" element={<BusinessName />} />
        <Route path="business-email" element={<BusinessEmail />} />
        <Route path="business-phone" element={<BusinessPhone />} />
        <Route path="business-website" element={<BusinessWebsite />} />
        <Route path="business-categories" element={<BusinessCategories />} />
        <Route path="business-address" element={<BusinessAddress />} />
        <Route path="business-account" element={<BusinessAccount />} />
        <Route path="business-account/verify" element={<BusinessAccount />} />

        <Route path="business-hours" element={<BusinessHours />} />
        <Route path="business-description" element={<BusinessDescription />} />
        <Route path="business-photos" element={<BusinessPhotos />} />

        <Route path="*" element={<Navigate to="business-name" replace />} />
      </Routes>
    </BusinessFormProvider>
  );
}
