import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Form, useActionData, useFetcher, useLoaderData, useNavigation, Outlet } from '@remix-run/react'
import { json, redirect, type ActionFunction, type DataFunctionArgstype, type MetaFunction, type LoaderFunction, } from '@remix-run/node'
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { model } from "~/models";
import { prisma } from "~/libs";
import { RemixNavLink, } from "~/components"
import { Separator, Button, Input, Label, Switch, Checkbox } from '~/components/ui/index'
import { getUserIsAllowed } from "~/helpers";


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) { redirect('/login') }
  if (!user) { return json({ status: 302, redirect: '/login' }); };
  const userEmail = user?.email
  const deFees = await prisma.dealerFees.findUnique({ where: { userEmail: user.email } });
  const userId = user?.id
  const comsRecords = await prisma.communicationsOverview.findMany({ where: { userId: userId, }, });
  if (user?.subscriptionId === 'active' || user?.subscriptionId === 'trialing') {
    // const client = await getLatestFinanceAndDashDataForClientfile(userId)
    //const finance = client.finance
    return ({ user, deFees, comsRecords })
  }
  return redirect('/subscription/renew');
}

export function Docs() {
  const [docuVideos, setDocuVideos] = useState('')
  const [docsTitle, setDocsTitle] = useState('')

  return (
    <>
      <div className="mx-auto my-auto w-[90%] h-[90%]">
        <h1 className='text-white'>{docsTitle}</h1>
        <video width="50%" muted autoPlay loop src={docuVideos} />
      </div>
    </>
  )
}


export default function Mainbody() {
  const { user, deFees, dataPDF, statsData, comsRecords } = useLoaderData()
  const userIsAllowed = getUserIsAllowed(user, ["ADMIN"]);
  console.log(user, 'usersettings')
  return (
    <>
      <div className="flex h-[100%] w-[98vw] left-0">
        <div className="w-[300px] rounded-lg h-[95%] bg-slate12 text-slate2  ">
          <hr className="solid" />
          <RemixNavLink to={`/welcome/quote`}>
            <Button
              variant="link"
              className="w-full justify-start cursor-pointer text-white "
            >
              Dashboard
            </Button>
          </RemixNavLink>
          {userIsAllowed ? (
            <>
              <RemixNavLink to={`/admin`}>
                <Button variant="link" className="w-full justify-start cursor-pointer text-white" >
                  Admin
                </Button>
              </RemixNavLink>
            </>
          ) : (null)}
          <RemixNavLink to={`/user/dashboard/password`}>
            <Button
              variant="link"
              className="w-full justify-start cursor-pointer text-white"
            >
              Change Password
            </Button>
          </RemixNavLink>
          <RemixNavLink to={`/docs`}>
            <Button
              variant="link"
              className="w-full justify-start cursor-pointer text-white"
            >
              Docs
            </Button>
          </RemixNavLink>
          <RemixNavLink to={`/logout`}>
            <Button variant="link" className="w-full justify-start cursor-pointer text-white" >
              Log out
            </Button>
          </RemixNavLink>
        </div>
        <div className='w-[98%]'>
          <Docs />
        </div>
      </div>
    </>
  )
}

