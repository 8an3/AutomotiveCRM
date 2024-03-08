import { json, type LoaderFunction, type ActionFunctionArgs, redirect } from '@remix-run/node';
import axios from 'axios';

import { Form } from "@remix-run/react";


export async function action({ request, }: ActionFunctionArgs) {
  const body = await request.formData();

  return null
}

export async function loader() {
  return null
}

export default function Todos() {
  return (
    <div>
      <Form method="post">
        <input type="text" name="title" />
        <button type="submit">Create Todo</button>
      </Form>
    </div>
  );
}


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
