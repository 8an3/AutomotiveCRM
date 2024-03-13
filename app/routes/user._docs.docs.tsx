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
import { useState } from "react"
import harleyDavidson from './logos/hd.png'
import Indexvideo from './images/proof40secs.mp4'

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      role: { select: { symbol: true, name: true } },
    },
  });
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
  return json({ user, deFees, comsRecords })
}

export function Docs() {


  return (
    <>

    </>
  )
}
export default function Mainbody() {
  const { user, deFees, dataPDF, statsData, comsRecords } = useLoaderData()
  const userIsAllowed = getUserIsAllowed(user, ["ADMIN"]);
  console.log(user, 'usersettings')
  const [docuVideos, setDocuVideos] = useState(Indexvideo);
  const [docsTitle, setDocsTitle] = useState('Quote');
  const [selectedVideo, setSelectedVideo] = useState(null); // State to hold the selected video

  // Function to handle video selection
  const handleVideoSelection = (video) => {
    setSelectedVideo(video);
    setDocuVideos(video.url);
    setDocsTitle(video.name);
    console.log(video, video.url, video.name)
  };
  // Mapping object for video URLs
  // Mapping object for const videoUrls = [
  const videoUrls = [
    { name: 'Quote', url: Indexvideo },
    { name: 'Dashboard', url: harleyDavidson },
    { name: 'Calendar', url: harleyDavidson },
    { name: 'Payment Calculator', url: harleyDavidson },
    { name: 'Document Builder', url: harleyDavidson },
    { name: 'Template Builder', url: harleyDavidson },
    { name: 'Scripts', url: harleyDavidson },
    { name: 'Automation', url: harleyDavidson },
    { name: 'Ad Manager', url: harleyDavidson },
    { name: 'Finance Dashboard', url: harleyDavidson },
    { name: 'Activix Dashboard', url: harleyDavidson },
    { name: 'Unit Inventory', url: harleyDavidson },
    { name: 'Roadmap', url: harleyDavidson }
  ];

  return (
    <>
      <div className="flex h-[100%] w-[98vw] left-0">
        <div className="w-[300px] rounded-lg h-[95%] bg-slate12 text-slate2 space-between ">
          <div className='mt-10'>
            <hr className="solid" />
            <RemixNavLink to={`/leads/sales`}>
              <Button
                variant="link"
                className="w-full justify-start cursor-pointer text-white "
              >
                Dashboard
              </Button>
            </RemixNavLink>
            {userIsAllowed && (
              <RemixNavLink to={`/admin`}>
                <Button
                  variant="link"
                  className="w-full justify-start cursor-pointer text-white"
                >
                  Admin
                </Button>
              </RemixNavLink>
            )}
            <RemixNavLink to={`/user/dashboard/password`}>
              <Button
                variant="link"
                className="w-full justify-start cursor-pointer text-white"
              >
                Change Password
              </Button>
            </RemixNavLink>
            <RemixNavLink to={`/user/docs`}>
              <Button
                variant="link"
                className="w-full justify-start cursor-pointer text-white"
              >
                Docs
              </Button>
            </RemixNavLink>
            <RemixNavLink to={`/logout`}>
              <Button
                variant="link"
                className="w-full justify-start cursor-pointer text-white"
              >
                Log out
              </Button>
            </RemixNavLink>
          </div>

          <div className='mt-10'>
            <ul>
              {/* Display list of document videos */}
              {videoUrls.map((video, index) => (
                <li key={index}>
                  <Button
                    variant="link"
                    className="w-full justify-start cursor-pointer text-white hover:underline "
                    onClick={() => handleVideoSelection(video)}>
                    {video.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='w-[98%]  items-center justify-center text-center'>
          <div className=" fixed mx-auto my-auto  w-[80%] h-[80%]  top-[50%]  translate-y-[-50%]">
            <h1 className='text-white'>{docsTitle}</h1>
            <video className='mx-auto justify-center align-center items-center' controls autoPlay src={docuVideos} />
          </div>
        </div>
      </div>
    </>
  );
}
