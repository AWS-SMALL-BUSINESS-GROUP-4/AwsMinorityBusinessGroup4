import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE', // Sends verification code via email
    },
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['profile', 'email', 'openid'],
        attributeMapping: {
          email: 'email',          // Maps Google's 'email' to Cognito's 'email'
          givenName: 'given_name', // Maps Google's 'given_name' to Cognito's 'givenName'
          familyName: 'family_name' // Maps Google's 'family_name' to Cognito's 'familyName'
        },
      },
      callbackUrls: ['http://localhost:5173/my-businesses/business-hours/'], // Update for production
      logoutUrls: ['http://localhost:5173/'], // Update for production
    },
  },
  userAttributes: {
    givenName: { required: true },
    familyName: { required: true },
  },
});