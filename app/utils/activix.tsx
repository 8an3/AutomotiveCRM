import axios from 'axios';
import { env } from 'process';


export default async function makeApiCall(endpoint, method = 'get', extraHeaders = {}, data = null) {
  const apiUrl = `https://api.crm.activix.ca/v2/${endpoint}`;
  // const apiUrl = 'https://api.dev.crm.activix.ca/v2/account';
  const accessToken = env.API_ACTIVIX; // Replace with your actual access token
  // console.log(accessToken)
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    ...extraHeaders,
  };

  // Example of a GET request
  const response = await axios({ method, url: apiUrl, headers, data })
    .then(response => {
      // Handle successful response
      console.log(response.data);
    })
    .catch(error => {
      // Handle error
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
      console.error('Full error object:', error);
    });

  return response
}
