import React, { createContext, useContext, useEffect, useState } from 'react';
import { type AppError, AppUser, useAppContext } from "~/components/microsoft/AppContext";
import { useProvideAppContext } from "~/components/microsoft/AppContext"
import { json } from "@remix-run/node";
import { Button, Input } from "~/components";
import { useMsal } from "@azure/msal-react";
import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { Client, ClientOptions, } from "@microsoft/microsoft-graph-client";
import { type AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { loginRequest, config, silentRequest } from '~/components/microsoft/Config';


const Test = () => {
  const app = useAppContext();

  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(null);
  const [messages2, setMessages2] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [graphData2, setGraphData2] = useState(null);
  const [inbox2, setInbox2] = useState([]);

  useEffect(() => {

    if (accounts.length > 0 && app.authProvider) {
      // -----------------------------------------------------------------------
      //  client.api('/me').get();
      getUser(app.authProvider!).then((userData) => {
        setUser(userData);
      });
      // -----------------------------------------------------------------------
      // "https://graph.microsoft.com/beta/me/messages"
      instance
        .acquireTokenSilent({
          ...loginRequest, // Define loginRequest
          account: accounts[0],
        })
        .then((response) => {
          callInbox(response.accessToken).then((response) => setGraphData2(response));
        })
        .catch((error) => {
          console.error('Error acquiring token:', error);
        });
      // -----------------------------------------------------------------------
      RequestProfileData()
      // -----------------------------------------------------------------------

    }
  }, []);

  const RequestProfileData = async () => {
    const options = {
      authProvider: app.authProvider!,
    };
    const client = Client.initWithMiddleware(options);
    let messages = await client.api(graphConfig.url)
      .version('beta')
      .get();
    setGraphData(messages)
    return messages
  };
  return (
    <div className='mt-10 '>
      {user &&
        (
          <div className=' w-[80%]'>
            <h2 className='mt-10 text-center'>user: </h2>
            <hr className='mx-auto items-center text-center text-white' />
            <p className='text-center '> {JSON.stringify(user)}</p>
          </div>
        )}
      <div>
        {graphData2 &&
          (
            <div className=' w-[80%]'>
              <h2 className='mt-10 text-center'>graphData2: </h2>
              <hr className='mx-auto items-center text-center text-white' />
              <p className='text-center '> {JSON.stringify(graphData2)}</p>
            </div>
          )}
      </div>
      <div>
        {graphData ? (
          <div className=' w-[80%]'>
            <h2 className='mt-10 text-center'>graphData: </h2>
            <hr className='mx-auto items-center text-center text-white' />
            <p className='text-center '> {JSON.stringify(graphData)}</p>
          </div>
        ) : (
          <div className=' w-[80%]'>
            <h2 className='mt-10 text-center'>graphData: </h2>
            <hr className='mx-auto items-center text-center text-white' />
            <p className='text-center '> No Data {graphConfig.url}</p>
          </div>
        )}
        <Button variant="ghost" onClick={RequestProfileData}>
          Request Profile Data
        </Button>
      </div>

    </div>
  );
};
export default Test;

const url = 'onenote/notebooks'





const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMessages: "https://graph.microsoft.com/beta/me/messages",
  url: `/me/${url}`
};
export async function callInbox(accessToken) {
  var headers = new Headers();
  var bearer = "Bearer " + accessToken;
  headers.append("Authorization", bearer);
  var options = {
    method: "GET",
    headers: headers
  };
  return fetch(graphConfig.graphMessages, options)
    .then(response => response.json())
    .catch(error => console.log(error));
}

// Define getUser function to fetch user data
const getUser = async (authProvider) => {
  try {
    const client = Client.initWithMiddleware({ authProvider });
    const userData = await client.api('/me').get();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
const getMessages = async (authProvider) => {
  try {
    const client = Client.initWithMiddleware({ authProvider });
    const userData = await client.api('/me/messages').get();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
const callMsGraph2 = async () => {
  try {
    const client = Client.initWithMiddleware({ authProvider: app.authProvider! });
    const inboxData = await client.api('/me/messages').get();
    setInbox2(inboxData.value || []);
  } catch (error) {
    console.error('Error fetching inbox data:', error);
  }
};

const callMsGraph3 = async () => {
  try {
    getMessages(app.authProvider!).then((messageData) => {
      setGraphData(messageData);
    });
  } catch (error) {
    console.error('Error fetching inbox data:', error);
  }
};
const RequestMessages = () => {
  instance
    .acquireTokenSilent({
      ...loginRequest, // Define loginRequest
      account: accounts[0],
    })
    .then((response) => {
      callMsGraph(response.accessToken).then((response) => setMessages2(response));
    })
    .catch((error) => {
      console.error('Error acquiring token:', error);
    });
};

export async function callMsGraph(accessToken) {
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

