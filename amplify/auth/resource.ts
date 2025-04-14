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
          email: 'email',
          givenName: 'given_name',
          familyName: 'family_name',
        },
      },
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET'),
        scopes: ['public_profile', 'email'], // Updated to Facebook-specific scopes
        attributeMapping: {
          email: 'email',
          givenName: 'first_name', // Matches Facebook's API response
          familyName: 'last_name', // Matches Facebook's API response
        },
      },
      callbackUrls: [
        'http://localhost:5173/', // Added homepage for general login/signup
        'http://localhost:5173/add-business/business-hours',
        'https://feature-databasecrud.d203198uhav1xc.amplifyapp.com/',
        'https://feature-databasecrud.d203198uhav1xc.amplifyapp.com/add-business/business-hours',
      ],
      logoutUrls: [
        'http://localhost:5173/',
        'https://feature-databasecrud.d203198uhav1xc.amplifyapp.com/',
      ],
    },
  },
  userAttributes: {
    givenName: { required: true },
    familyName: { required: true },
  },
});