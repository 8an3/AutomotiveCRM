import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Form, useActionData, useFetcher, useLoaderData, useNavigation, Outlet } from '@remix-run/react'
import { json, redirect, type ActionFunction, type DataFunctionArgstype, type MetaFunction, type LoaderFunction, } from '@remix-run/node'
import { getSession, commitSession, destroySession } from '~/sessions/auth-session.server'
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { RemixNavLink, } from "~/components"
import { Separator, Button, Input, Label, Switch, Checkbox } from '~/components/ui/index'
import { getUserIsAllowed } from "~/helpers";
import { useState } from "react"



export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

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


  return (
    <>

    </>
  )
}


export default function Mainbody() {
  const { user, deFees, dataPDF, statsData, comsRecords } = useLoaderData()
  const [docuVideos, setDocuVideos] = useState('')
  const [docsTitle, setDocsTitle] = useState('')

  // Function to handle video selection
  const handleVideoSelection = (videoUrl, title) => {
    setDocuVideos(videoUrl);
    setDocsTitle(title);
  };
  return (
    <>
      <div className="flex h-[100%] w-[98vw] left-0">
        <div className="w-[300px] rounded-lg h-[95%] bg-[#09090b] text-slate2  ">
          <hr className="solid" />
          <Button
            variant="link"
            className="w-full justify-start cursor-pointer text-[#fafafa] "
            onClick={() => handleVideoSelection('dashboard-video-url', 'Dashboard')}>
            Dashboard
          </Button>
          <Button
            variant="link"
            className="w-full justify-start cursor-pointer text-[#fafafa] "
            onClick={() => handleVideoSelection('dashboard-video-url', 'Dashboard')}>
            Client Profile
          </Button>
          <Button
            variant="link"
            className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('dashboard-video-url', 'Calendar')}>
            Calendar
          </Button>
          <Button
            variant="link"
            className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('dashboard-video-url', 'Document Builder')}>
            Document Builder
          </Button>
          <Button variant="link" className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('dashboard-video-url', 'Template Builder')}>
            Template Builder
          </Button>
          <Button variant="link" className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('dashboard-video-url', 'Email')}>
            Email
          </Button>
          <Button variant="link" className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('dashboard-video-url', 'SMS')}>
            SMS
          </Button>
          <Button variant="link" className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('https://youtu.be/IJoEmkRDhaU', 'SMS')}>
            Payment Calculator
          </Button>
          <Button variant="link" className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('dashboard-video-url', 'SMS')}>
            Inventory
          </Button>
          <Button variant="link" className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('https://youtu.be/2zSmBP6icpY', 'SMS')}>
            Scripts
          </Button>
          <Button variant="link" className="w-full justify-start cursor-pointer text-[#fafafa]"
            onClick={() => handleVideoSelection('dashboard-video-url', 'SMS')}>
            Automation
          </Button>
        </div>
        <div className='w-[98%]'>
          <div className="mx-auto my-auto w-[90%] h-[90%]">
            <h1 className='text-[#fafafa] mb-5'>{docsTitle}</h1>
            <video width="50%" autoPlay src={docuVideos} />
          </div>
        </div>
      </div>
    </>
  )
}

