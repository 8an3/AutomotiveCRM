import { Client } from "@microsoft/microsoft-graph-client"
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials"
import { ClientSecretCredential } from "@azure/identity"
import config from "../email/secrets"
require("isomorphic-fetch");

const port = "3000";
const redirectUri = `http://localhost:${port}/authresponse`;
const authorityHost = "https://login.microsoftonline.com";

const credential = new ClientSecretCredential(config.tenantId, config.clientId, config.clientSecret);
const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: [config.scopes] });

export default function EmailClient() {
  const client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider,
  });

  client
    .api("/me")
    .select("displayName")
    .get()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  return (client);
}
