import * as msal from "@azure/msal-node";
import "dotenv/config"; // process.env now has the values defined in a .env file

const tenantId = "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6";

const microsoftAuthConfig = {
    clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
    clientSecret: "rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D",
    redirectUri: "http://localhost:3000/microsoft/callback",
    authorizationUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
    tokenUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token?`,
    userInfoUrl: "https://graph.microsoft.com/oidc/userinfo",
    scopes: ["openid", "profile", "email", "offline_access"],
    prompt: "login",
    resource: "https://graph.microsoft.com",
    authority: "https://login.microsoftonline.com",

};

const clientConfig = {
    auth: {
        clientId: microsoftAuthConfig.clientId,
        authority: microsoftAuthConfig.authority,
        clientSecret: microsoftAuthConfig.clientSecret, // OR

    }
};
const pca = new msal.ConfidentialClientApplication(clientConfig);



export async function UseRefreshToken(refreshToken) {
    const { clientSecret, clientId, redirectUri, } = microsoftAuthConfig;
    const scopes = "openid profile email offline_access"
    async function GetNewAccessToken(refreshToken) {
        try {
            const requestBody = new URLSearchParams({
                'grant_type': 'refresh_token',
                'refresh_token': refreshToken,
                'client_id': clientId,
                'client_secret': clientSecret,
                'scope': scopes,
                'redirect_uri': redirectUri,
            });

            const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody
            });

            if (!response.ok) {
                throw new Error(`Failed to refresh token: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Refresh token error:', error);
            throw error;
        }
    }

    // Example usage:
    const response = await GetNewAccessToken(refreshToken)
        .then(data => {
            console.log('Token refreshed successfully:', data);
            // Handle the refreshed token data
            console.log(data, 'refreshtoken request')
            return data
        })
        .catch(error => {
            // Handle errors
            console.error('Refresh token failed:', error);
        });
    return response
}
// Function to generate authorization URL
export function GetAuthorizationUrl() {
    const { clientId, redirectUri, authorizationUrl, scopes, prompt } = microsoftAuthConfig;
    const scopeString = scopes.join(" ");
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: scopeString,
        prompt: prompt,
    });
    return `${authorizationUrl}?${params.toString()}`;
}
// Function to exchange authorization code for access token
export async function ExchangeCodeForToken(code) {
    const { clientId, clientSecret, redirectUri, tokenUrl } = microsoftAuthConfig;

    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code: code,
    });

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    };

    try {
        // Make the token exchange request
        const response = await fetch(tokenUrl, requestOptions);

        // Log the actual request being made (for debugging purposes)
        console.log(`Request to ${tokenUrl}${params.toString()}`);

        // Log the response received (for debugging purposes)
        console.log(`Response from ${tokenUrl}:`, response);

        // Check if the response is successful (HTTP status 2xx)
        if (!response.ok) {
            throw new Error(`Failed to exchange code for token: ${response.statusText}`);
        }

        // Parse and return the JSON response (access token)
        return await response.json();
    } catch (error) {
        // Log any error that occurs during the token exchange
        console.error('Error exchanging code for token:', error);

        // Re-throw the error to propagate it further if needed
        throw error;
    }
}

/**
https://login.microsoftonline.com/common/oauth2/v2.0/token?
client_id=0fa1346a-ab27-4b54-bffd-e76e9882fcfe&
client_secret=rut8Q%7Es5LpXMnEjujrxkcJs9H3KpUzxO%7ELfAOc-D&
redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fmicrosoft%2Fcallback&
grant_type=authorization_code&
code=0.Ab0A0iuB-h89W0Wc5Uv9Ck37pmo0oQ8nq1RLv_3nbpiC_P7LADQ.AgABBAIAAADnfolhJpSnRYB1SVj-Hgd8AgDs_wUA9P816r9zhaulPSUUbXxPx438UnLdYfAfQacXX-QBUq7nIoMGpQO0tun8Sru8iq_REciPVKIMCIJC2S4wexkY2gEa0PoTV0kMdFSUMmYHI8RV2GkEY5ZaZRTwvlV6g1taZy3PFK5QVil6jPt_M4I2EYA0QQiZfzNKloDk6DlK8atfskYTvR7NAmyT-uXBCHY8v3yVqoSh1HI0NDQwmaWxqXbDaUQ3OyFLpPrFR31VY7UOVM4MGj9N-irNA9h_UhsQ5GTdL5dhgjF9FDrZS7ZkbcZexYaxF6J6hN33IzqFo4nZGj3koWVjEIIjgXSPRjjtxiHo2r-xXbwEnyN-GfMnqHfNTwEwTvI2poKKbtZTyrbjisjoDOkilMW-MbR463UDSV92n8qnAbIK6ixEm3BISTBnt9fd4QN8VypaT5NLqxH-vUo-S-0-9THGLST0fP7xdKBeZS10HSvZobQTZzlVpK6GQP69GElggyMNEs3vKUPI9qElZoJZScz4Oz6aI1MFIKggPdygxxsuZ3ScMZl2Mg2YQ4PUD4RC7U9j3295PzxtF5cmTUrolyUb2Bpki21EoeWn1Q-2qkaU4TRgKp6AJ54XkmIaVxtn0Sdcjyurt_zVA5e_IM6fd0qjxAykTfdfesptwThxI7ASTCZWLzCEvGWVeDT2dlaNr-fgW1xpD-jAYCwfRHpQw34p1kGb6W2bIucfd-QL4BaRtBQvHcYFuZ3dOEQOmQXKPDRBKM_GtTNExIB_uvWiE8rtYA9ixXWgfcI0GUpoag9i3QrhRi3i3-3esizbXgpnobHcQfGMaG_oRfOKhKiSumPrDP_RkRJszPu0BY92Xt7JdEm8_fA4QgvprlsIRiII91iXyyieeD3I47kkT2eo7a7eEYitEe8_W55KLoQTz4TPeDiu9b7nxmku6dSpHLPyUin_qtR0uwoQe_dhRDQfYJzJ_a20u2N9CA9EJqiri6oBVg7c0-eiRn5H4ZuhLmxXQJqxLBqKg-lJVPVWI-WWzdu8waH0Kj2zNyUUSpAWzbVVBJPRh5nIN7cgfbAmFryj8ciGh8iQxN_aWiWMaDAt4Mn-dUHAAsDE_afogmlcXml3kSjKDyDbNBrwOeqjNWcvcw6sFrd-nKKjF8myOrML8pDAew5JYrjXMQWAvb_nEKw7xZs_oC0G-Fa3iB-pXyQOxhEc_Ybd0U2vudNf5hERCGy5sAraLcx7aNqBKU_zVSXzIfPJrpqS9DdPEyUxrHTAGCuB1FIIr8bigiYn3Xin334vBESMCvTB8BBqdqVQRgjWGe-aYWD8iw */
// Function to fetch user profile using access token
export async function FetchUserProfile(accessToken) {
    const { userInfoUrl } = microsoftAuthConfig;

    const response = await fetch(userInfoUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return await response.json();
}

// Export functions for authentication flow
