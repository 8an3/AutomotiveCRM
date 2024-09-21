import { loginRequest, graphConfig } from "./config.server";
import { useMsal } from "@azure/msal-react";

export async function callMsGraph() {
  const { instance, accounts, inProgress } = useMsal();

  const account = instance.getActiveAccount();
  if (!account) {
    throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
  }

  const response = await instance.acquireTokenSilent({
    ...loginRequest,
    account: account
  });

  const headers = new Headers();
  const bearer = `Bearer ${response.accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
}
