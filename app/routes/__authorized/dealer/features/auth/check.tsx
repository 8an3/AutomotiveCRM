import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { Link, useSubmit, useNavigate } from '@remix-run/react';
import { useAppContext } from '~/components/microsoft/AppContext';



export default function AuthCheck() {
  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const navigate = useNavigate();
  const email = activeAccount?.username || '';
  const name = activeAccount?.name || '';
  if (activeAccount && name && email) {
    return null
  } else {
    app.signOut!
    return navigate('/destroySession')
  }

}
