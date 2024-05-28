import React, { useCallback, useEffect, useRef, useState } from "react";
import ProvideAppContext, { useAppContext } from '~/components/microsoft/AppContext';
import { useMsal } from '@azure/msal-react';
import { testInbox } from "~/components/microsoft/GraphService";
import { Client, type GraphRequestOptions, type PageCollection, PageIterator, type ClientOptions } from '@microsoft/microsoft-graph-client';
import { type AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

const useFetchEmails = () => {
  const app = useAppContext();
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
  useEffect(() => {
    const fetchEmails = async () => {
      await delay(150);
      try {
        const response = await testInbox(app.authProvider!);
        setEmails(response.value);
        console.log(response, 'response fgor emialssssss')
      } catch (error) {
        setError(error);
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);
  useEffect(() => {
    const serializedEmail = JSON.stringify(emails);
    window.localStorage.setItem("emails", serializedEmail)
  }, []);
  return emails
};

export default useFetchEmails;
