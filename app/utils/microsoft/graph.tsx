import { GetToken, EnsureScope } from "../../routes/twoAppContext";
import { MicrosoftGraph } from "@microsoft/microsoft-graph-client"
import { graphConfig } from "./_auth/microsoft";

export async function callMsGraph(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
}


const authProvider = {
  getAccessToken: async () => {
    // Call getToken in auth.js
    return await GetToken();
  }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
//Get user info from Graph
export async function GetUser() {
  EnsureScope('user.read');
  return await graphClient
    .api('/me')
    .select('id,displayName')
    .get();
}
