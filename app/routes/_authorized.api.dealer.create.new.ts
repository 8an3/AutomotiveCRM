// src/routes/api/createRepo.ts

import { json, type LoaderFunction } from '@remix-run/node';
import axios from 'axios';

const createFirstRepo = async (newDealerRepoName) => {
  const YOUR_GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
  const templateOwner = '8an3';
  const templateRepo = 'thesalespersonscrmm';
  const newRepoName = newDealerRepoName;
  const newRepoOwner = '8an3';

  const apiUrl = `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`;

  const config = { headers: { 'Accept': 'application/vnd.github.baptiste-preview+json', 'Authorization': `token ${YOUR_GITHUB_TOKEN}`, }, };

  const data = { name: newRepoName, owner: newRepoOwner, };
  axios.post(apiUrl, data, config).then(response => { console.log('Repository created successfully:', response.data); })
    .catch(error => { console.error('Error creating repository:', error.response.data); });
};
const createSecondRepo = async (newDealerRepoName) => {
  const YOUR_GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
  const templateOwner = '8an3';
  const templateRepo = 'third';
  const newRepoName = newDealerRepoName;
  const newRepoOwner = '8an3';

  const apiUrl = `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`;

  const config = { headers: { 'Accept': 'application/vnd.github.baptiste-preview+json', 'Authorization': `token ${YOUR_GITHUB_TOKEN}`, }, };

  const data = { name: newRepoName, owner: newRepoOwner, };
  axios.post(apiUrl, data, config).then(response => { console.log('Repository created successfully:', response.data); })
    .catch(error => { console.error('Error creating repository:', error.response.data); });
};
const createThirdRepo = async (newDealerRepoName) => {
  const YOUR_GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
  const templateOwner = '8an3';
  const templateRepo = 'crmsat';
  const newRepoName = newDealerRepoName;
  const newRepoOwner = '8an3';

  const apiUrl = `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`;

  const config = { headers: { 'Accept': 'application/vnd.github.baptiste-preview+json', 'Authorization': `token ${YOUR_GITHUB_TOKEN}`, }, };

  const data = { name: newRepoName, owner: newRepoOwner, };
  axios.post(apiUrl, data, config).then(response => { console.log('Repository created successfully:', response.data); })
    .catch(error => { console.error('Error creating repository:', error.response.data); });
};

// Function to customize the GitHub repository
const customizeRepo = async (repoUrl: string, customizationData: any): Promise<void> => {
  // Implement logic to customize the GitHub repository based on the data
  // For simplicity, let's just log the customization data
  console.log('Customizing repository:', repoUrl, customizationData);
};

// Function to handle customization based on dealer preferences
const customizeForDealer = (dealerData: any): any => {
  // Implement logic to extract and format customization data based on dealer preferences
  // For simplicity, let's just return the dealer data
  return dealerData;
};

// Define the loader function for the API route
export let loader: LoaderFunction = async ({ request }) => {
  try {
    // Parse JSON data from the request body
    const data = await json(request);

    // Extract necessary information from the request
    const { dealerName } = data;

    // Create a GitHub repository for the dealer
    const repoName = `${dealerName}-crm`;
    const repoUrl = await createGitHubRepo(repoName);

    // Customize the repository based on dealer preferences
    await customizeRepo(repoUrl, customizeForDealer(data));

    // Return success response
    return json({ success: true, repoUrl });
  } catch (error) {
    console.error('Error creating repository:', error);

    // Return an error response
    return json({ success: false, error: 'Failed to create repository' }, { status: 500 });
  }
};
