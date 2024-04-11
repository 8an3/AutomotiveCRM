import { GetToken, EnsureScope } from "../../routes/twoAppContext";
import { MicrosoftGraph } from "@microsoft/microsoft-graph-client"
// Create an authentication provider
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
