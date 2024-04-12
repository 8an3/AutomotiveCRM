import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { Outlet } from '@remix-run/react';

export default function AppProvider() {
  return (
    <>
        <Outlet />

    </>

  );
}
/** <AuthenticatedTemplate>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>Not currently signed in.</p>
      </UnauthenticatedTemplate> */
