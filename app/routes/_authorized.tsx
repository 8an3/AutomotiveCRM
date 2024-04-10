
import { MsalProvider } from '@azure/msal-react'
import { type IPublicClientApplication } from '@azure/msal-browser';

import ProvideAppContext, { useAppContext } from '~/utils/microsoft/appContext.server';

import { Outlet } from '@remix-run/react';


function ErrorMessage() {
  const app = useAppContext();

  if (app.error) {
    return (
      <p variant="danger" dismissible onClose={() => app.clearError!()}>
        <p className="mb-3">{app.error.message}</p>
        {app.error.debug ?
          <pre className="alert-pre border bg-light p-2"><code>{app.error.debug}</code></pre>
          : null
        }
      </p>
    );
  }

  return null;
}
type AppProps = {
  pca: IPublicClientApplication
};

export default function App({ pca }: AppProps): JSX.Element {
  return (
    <MsalProvider instance={pca}>
      <ProvideAppContext>
        <ErrorMessage />
        <Outlet />
      </ProvideAppContext>
    </MsalProvider>
  );
}
