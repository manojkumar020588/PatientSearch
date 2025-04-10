const express = require('express');
const axios = require('axios');
const app = express();

// Your registered client credentials
const CLIENT_ID = '6291f555-4548-4e26-830c-7f8e445612d0';
     
const CLIENT_SECRET = 'your-client-secret'; // Keep this secure!
const REDIRECT_URI = 'https://your-app.com/redirect';

app.get('/backend-auth', async (req, res) => {
  try {
    const { launch, iss } = req.query;
    alert("aa");
    // Step 1: Get the FHIR server's authorization endpoint
    const metadataResponse = await axios.get(`${iss}/.well-known/smart-configuration`);
    const { token_endpoint, authorization_endpoint } = metadataResponse.data;
    
    // Step 2: Exchange the launch code for an access token
    const tokenResponse = await axios.post(token_endpoint, new URLSearchParams({
      grant_type: 'authorization_code',
      code: launch,
      redirect_uri: 'https://manojkumar020588.github.io/PatientSearch/example-smart-app/',
      client_id: CLIENT_ID
     
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    alert("outside");
    // Step 3: Now you have the access token to make FHIR API calls
    const { access_token, patient, encounter } = tokenResponse.data;
    
    // ... proceed with your application logic
    
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).send('Authentication failed');
  }
});
