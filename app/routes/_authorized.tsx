import { AuthenticatedTemplate } from '@azure/msal-react'
import { Outlet } from '@remix-run/react';

export default function AppProvider() {
  return (
    <AuthenticatedTemplate>
      <Outlet />
    </AuthenticatedTemplate>
  );
}

