import { type ActionFunction, json, redirect, type LoaderFunction } from "@remix-run/node"
import { Link, useSubmit, useNavigate } from '@remix-run/react';
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from '~/components/microsoft/AppContext';
import { useState, useEffect } from 'react'
import type { IPublicClientApplication } from '@azure/msal-browser';
import {
  authSessionStorage,
  commitSession,
  destroySession,
  getSession,
} from "~/sessions/auth-session.server"


type AppProps = {
  pca: IPublicClientApplication
};

export async function action({ request }: ActionFunction) {
  let session = await getSession(request.headers.get("Cookie"))
  return redirect('/auth/login', { headers: { 'Set-Cookie': await destroySession(session) } });
}

export default function Welcome({ pca }: AppProps) {
  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const submit = useSubmit();
  const [tokenClaims, setTokenClaims] = useState({})
  const navigate = useNavigate();

  // app.signOut! || instance.logoutRedirect({    postLogoutRedirectUri: "/",  });
  useEffect(() => {
    if (instance && activeAccount) {
      const fetchUnreadCount = async () => {
        await instance.logoutPopup({
          postLogoutRedirectUri: "/",
          mainWindowRedirectUri: "/"
        });
        const formData = new FormData();
        formData.append("name", activeAccount.name);
        formData.append("email", activeAccount.email);
        return submit(formData, { method: "post" });
      };
      fetchUnreadCount();
    } else {
      navigate('/auth/login')
    }
  }, []);
  return submit
}
/** if (!activeAccount) {
    const email = activeAccount?.username || '';
    const name = activeAccount?.name || '';
    const encodedEmail = encodeURIComponent(email);
    const encodedName = encodeURIComponent(name);
    const url = `/destorySession`;

    return navigate(url);
  } */
/** let tableRow
 if (tokenClaims) {

   tableRow = Object.keys(tokenClaims).map((key) => {
     return (
       <tr key={key}>
         {tokenClaims[key]?.map((claimItem) => (
           <td key={claimItem} className="tableColumn">
             {claimItem}
           </td>
         ))}
       </tr>
     );
   });
 }

 return (
   <>
     <div className="p-5 mb-4 bg-light rounded-3">
       <AuthenticatedTemplate>
         <div className="grid  w-full grid-cols-1">
           <div className="w-[50%]">
             <div className="flex items-center justify-center text-center">

               <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                 <h1 className="text-foreground">Have a nice day!</h1>
                 <p className="mt-5 text-foreground">
                   Are you sure you want to log out?
                 </p>
                 <Button onClick={app.signOut!} variant="outline" className="mt-5 w-auto rounded-xl border border-white px-8 py-5 text-xl text-foreground "  >
                   <p className="mr-1">Logout of your </p>
                   <TfiMicrosoft className="text-[28px]" />{" "}
                   <p className="ml-2">account</p>
                 </Button>
                 <hr className="solid mb-5 mt-5 text-foreground" />
                 <Link to="/privacy">
                   <p className="text-foreground">To review our Privacy Policy</p>
                 </Link>
               </div>

             </div>
           </div>
         </div>
         {activeAccount?.idTokenClaims ? (
           <>
             <div>
               <p>activeAccount?.idTokenClaims</p>
             </div>
             <p>{JSON.stringify(activeAccount?.idTokenClaims)}</p>
           </>
         ) : (
           <p>No idTokenClaims available</p>
         )}
         {activeAccount?.idToken ? (
           <>
             <div>
               <p> activeAccount?.idToken</p>
             </div>
             <p>{JSON.stringify(activeAccount?.idToken)}</p>
           </>
         ) : (
           <p>No idTokenClaims available</p>
         )}

         <>
           <div className="data-area-div">
             <p>
               <strong> ID token Claims </strong>
               For more information about ID token Claims please visit the following page:{' '}
               <span>
                 <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token">
                   Claims in an ID token
                 </a>
               </span>
             </p>
             <div className="data-area-div table">
               <Table responsive striped bordered hover>
                 <thead>
                   <tr>
                     <th>Claim</th>
                     <th>Value</th>
                     <th>Description</th>
                   </tr>
                 </thead>
                 <tbody>{tableRow}</tbody>
               </Table>
             </div>
           </div>
         </>
       </AuthenticatedTemplate>
     </div>
     <div className="p-5 mb-4 bg-light rounded-3">

       <UnauthenticatedTemplate>
         <div className="p-5 mb-4 bg-light rounded-3">
           <div className="grid  w-full grid-cols-1">
             <div className="w-[50%]">
               <div className="flex items-center justify-center text-center">

                 <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                   <h1 className="text-foreground">Welcome to D.S.A.</h1>
                   <p className="mt-5 text-foreground">
                     Log-in
                   </p>
                   <Button onClick={app.signIn!} variant="outline" className="mt-5 w-auto rounded-xl border border-white px-8 py-5 text-xl text-foreground "  >
                     <p className="mr-1">Login with your </p>
                     <TfiMicrosoft className="text-[28px]" />{" "}
                     <p className="ml-2">account</p>
                   </Button>
                   <hr className="solid mb-5 mt-5 text-foreground" />
                   <Link to="/privacy">
                     <p className="text-foreground">To review our Privacy Policy</p>
                   </Link>
                 </div>

               </div>
             </div>
           </div>
         </div>
       </UnauthenticatedTemplate>
     </div>
   </>
 );
}
*/
