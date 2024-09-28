
export function CallResourceApi(res, authResponse, templateParams, scenarioConfig) {
  // Get scenario specific resource API
  const resourceApi = require(RESOURCE_API_PATH)(scenarioConfig.resourceApi);
  const username = authResponse.account.username;

  // Call graph after successfully acquiring token
  resourceApi.call(authResponse.accessToken, (authResponse, endpoint) => {
    // Successful silent request
    templateParams = {
      ...templateParams,
      username,
      profile: JSON.stringify(authResponse, null, 4)
    };
    res.render("authenticated", templateParams);
  });
}

export function RootHelper({ request, response, url }) {
  if (request.query.code) return response.redirect(url.format({ pathname: "/redirect", query: request.query }));
  // res.render("login", { showSignInButton: true });
}

export async function LoginHelper() {
  // This route performs interactive login to acquire and cache an Access Token/ID Token

  const loginHelper = await clientApplication.getAuthCodeUrl(requestConfig.authCodeUrlParameters)
    .then((response) => {
      response.redirect(response);
    })
    .catch((error) => console.log(JSON.stringify(error)));
  return loginHelper
}

export async function SilentLogin() {
  // Retrieve all cached accounts
  const accounts = await msalTokenCache.getAllAccounts();

  if (accounts.length > 0) {
    const account = accounts[0];
    // Set global homeAccountId of the first cached account found
    app.locals.homeAccountId = account.homeAccountId;
    // Build silent token request
    const silentRequest = { ...requestConfig.silentRequest, account: account };

    let templateParams = { showLoginButton: false };

    /**
     * MSAL Usage
     * The code below demonstrates the correct usage pattern of the ClientApplicaiton.acquireTokenSilent API.
     *
     * In this code block, the application uses MSAL to obtain an Access Token from the MSAL Cache. If successful,
     * the response contains an `accessToken` property. Said property contains a string representing an encoded Json Web Token
     * which can be added to the `Authorization` header in a protected resource request to demonstrate authorization.
     */
    clientApplication.acquireTokenSilent(silentRequest)
      .then((authResponse) => {
        app.locals.authResponse = authResponse;
        templateParams.acquiredTokenSilently = true
        res.render("authenticated", templateParams);
      })
      .catch((error) => {
        console.log(error);
        templateParams.couldNotAcquireToken = true;
        res.render("authenticated", templateParams)
      });
  } else {
    // If there are no cached accounts, render the login page
    response.render("login", { failedSilentLogin: true, showSignInButton: true });
  }

}
export async function GetTokenSilent(scenarioConfig, clientApplication, port, msalTokenCache) {

  /**
   * Silent Login route
   *
   * This route attempts to login a user silently by checking
   * the persisted cache for accounts.
   */

  // Second leg of Auth Code grant
  router.get('/redirect', (req, res) => {
    const tokenRequest = { ...requestConfig.tokenRequest, code: req.query.code };
    clientApplication.acquireTokenByCode(tokenRequest).then((response) => {
      app.locals.homeAccountId = response.account.homeAccountId;
      const templateParams = { showLoginButton: false, username: response.account.username, profile: false };
      res.render("authenticated", templateParams);
    }).catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
  });

  // Displays all cached accounts
  router.get('/allAccounts', async (req, res) => {
    const accounts = await msalTokenCache.getAllAccounts();
    const formattedAccounts = accounts.map((account) => {
      let tenantProfiles = [];
      account.tenantProfiles.forEach((profile) => {
        tenantProfiles.push(profile);
      });
      return { ...account, tenantProfiles };
    });
    if (formattedAccounts.length > 0) {
      res.render("authenticated", { accounts: JSON.stringify(formattedAccounts, null, 4) })
    } else if (formattedAccounts.length === 0) {
      res.render("authenticated", { accounts: JSON.stringify(formattedAccounts), noAccounts: true, showSignInButton: true });
    } else {
      res.render("authenticated", { failedToGetAccounts: true, showSignInButton: true })
    }
  });

  // Call a resource API with an Access Token silently obtained from the MSAL Cache
  router.get('/graphCall', async (req, res) => {

    if (!app.locals.authResponse) {
      return res.redirect('/silentAcquireToken');
    }

    let templateParams = { showLoginButton: false };
    return callResourceApi(res, app.locals.authResponse, templateParams, scenarioConfig);
  });

  return app.listen(serverPort, () => console.log(`Msal Node Silent Flow Sample app listening on port ${serverPort}!`));
};


/**
* The code below checks if the script is being executed manually or in automation.
* If the script was executed manually, it will initialize a PublicClientApplication object
* and execute the sample application.
*/
if (argv.$0 === "index.js") {
  const loggerOptions = {
    loggerCallback(loglevel, message, containsPii) {
      console.log(message);
    },
    piiLoggingEnabled: false,
    logLevel: msal.LogLevel.Verbose,
  }

  // Build MSAL ClientApplication Configuration object
  const clientConfig = {
    auth: {
      clientId: config.authOptions.clientId,
      authority: config.authOptions.authority,
      redirectUri: config.authOptions.redirectUri,
      clientSecret: process.env.CLIENT_SECRET,
      knownAuthorities: config.authOptions.knownAuthorities
    },
    cache: {
      cachePlugin
    },
    // Uncomment the code below to enable the MSAL logger
    /*
     *   system: {
     *    loggerOptions: loggerOptions
     *   }
     */
  };

  // Create an MSAL PublicClientApplication object
  const publicClientApplication = new msal.PublicClientApplication(clientConfig);
  const msalTokenCache = publicClientApplication.getTokenCache();

  // Execute sample application with the configured MSAL PublicClientApplication
  return getTokenSilent(config, publicClientApplication, null, msalTokenCache);
}



const requestConfig = scenarioConfig.request;

const accounts = await msalTokenCache.getAllAccounts();

if (accounts.length > 0) {
  const account = accounts[0];
  // Set global homeAccountId of the first cached account found
  app.locals.homeAccountId = account.homeAccountId;
  // Build silent token request
  const silentRequest = { ...requestConfig.silentRequest, account: account };

  let templateParams = { showLoginButton: false };

  /**
   * MSAL Usage
   * The code below demonstrates the correct usage pattern of the ClientApplicaiton.acquireTokenSilent API.
   *
   * In this code block, the application uses MSAL to obtain an Access Token from the MSAL Cache. If successful,
   * the response contains an `accessToken` property. Said property contains a string representing an encoded Json Web Token
   * which can be added to the `Authorization` header in a protected resource request to demonstrate authorization.
   */
  clientApplication.acquireTokenSilent(silentRequest)
    .then((authResponse) => {
      app.locals.authResponse = authResponse;
      templateParams.acquiredTokenSilently = true
      response.render("authenticated", templateParams);
    })
    .catch((error) => {
      console.log(error);
      templateParams.couldNotAcquireToken = true;
      response.render("authenticated", templateParams)
    });
}


const tokenRequest = { ...requestConfig.tokenRequest, code: request.query.code };
clientApplication.acquireTokenByCode(tokenRequest).then((response) => {
  app.locals.homeAccountId = response.account.homeAccountId;

  response.render("authenticated", templateParams);
}).catch((error) => {
  console.log(error);
  response.status(500).send(error);
});
