const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { CognitoIdentityServiceProvider } = require('aws-sdk');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const AWS = require('aws-sdk');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const cognito = new CognitoIdentityServiceProvider({ region: process.env.REGION });
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

// Google Authentication Route
app.post('/auth/google', async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: 'ID token is required' });

    // Fetch Google's public keys
    const { data: keys } = await axios.get('https://www.googleapis.com/oauth2/v3/certs');
    const decodedToken = jwt.decode(id_token, { complete: true });
    const kid = decodedToken.header.kid;
    const jwk = keys.keys.find((key) => key.kid === kid);
    if (!jwk) return res.status(400).json({ message: 'Public key not found' });

    const pem = jwkToPem(jwk);
    const verifiedToken = jwt.verify(id_token, pem, {
      issuer: 'https://accounts.google.com',
      audience: '795357684710-1a00aherbf45cn035f2okupnprtokuma.apps.googleusercontent.com', // Replace with your Google Client ID
    });

    const email = verifiedToken.email;
    const given_name = verifiedToken.given_name;
    const family_name = verifiedToken.family_name;

    // Link user to Cognito
    const params = {
      ProviderName: 'Google',
      ProviderAttributeName: 'email',
      ProviderAttributeValue: email,
      UserPoolId: process.env.AUTH_AWSMINORITYBUSINESSGD3EFBD9C_USERPOOLID,
      User: {
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'given_name', Value: given_name },
          { Name: 'family_name', Value: family_name },
          { Name: 'email_verified', Value: 'true' },
        ],
      },
    };

    try {
      await cognito.adminLinkProviderForUser(params).promise();
    } catch (error) {
      if (error.code !== 'UserNotFoundException') throw error;
      await cognito.adminCreateUser({
        UserPoolId: process.env.AUTH_AWSMINORITYBUSINESSGD3EFBD9C_USERPOOLID,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'given_name', Value: given_name },
          { Name: 'family_name', Value: family_name },
          { Name: 'email_verified', Value: 'true' },
        ],
      }).promise();
    }

    res.json({ message: 'Authentication successful', email, given_name, family_name });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Authentication failed', error: error.message });
  }
});

// Form Submission Route
app.post('/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    if (!formData.businessName) return res.status(400).json({ message: 'Business name is required' });

    const params = {
      TableName: 'BusinessData', // Replace with your DynamoDB table name
      Item: {
        id: Date.now().toString(),
        ...formData,
      },
    };

    await dynamoDb.put(params).promise();
    res.json({ message: 'Form submitted successfully', data: formData });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Form submission failed', error: error.message });
  }
});

app.listen(3000, function() {
  console.log("App started");
});

module.exports = app;