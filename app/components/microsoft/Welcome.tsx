// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <WelcomeSnippet>
import { IdTokenData } from './DataDisplay';
import React from 'react'
import { Button } from '~/components';
import { Link } from '@remix-run/react';
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from './AppContext';


export default function Welcome() {
  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <AuthenticatedTemplate>
        <div>
          <h1><a href='/email'>Email</a>, notes and more.</h1>

          <h4>Welcome {app.user?.displayName || ''}!</h4>
          <p>Use the navigation bar at the top of the page to get started.</p>
          {activeAccount ? (
            <div>
              <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
            </div>
          ) : null}
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Button color="primary" onClick={app.signIn!}>Click here to sign in</Button>
      </UnauthenticatedTemplate>
    </div>
  );
}
