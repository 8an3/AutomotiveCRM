/* eslint-disable tailwindcss/classnames-order */
import { Form, Outlet, useFetcher, useLoaderData, useParams, useSubmit, Link, useNavigate, } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/other/card";
import { type LoaderFunction, type DataFunctionArgs, redirect, type V2_MetaFunction, type ActionFunction, json, LinksFunction, } from '@remix-run/node'
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getAllFinanceNotes } from '~/utils/financeNote/get.server';
import { getClientListMerged, getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import React, { useEffect, useState } from "react";
import { prisma } from "~/libs";
import { Flex, Text, Box, TextArea, TextField, Heading, Select, Theme, ThemePanel, Inset, Grid, Avatar } from '@radix-ui/themes';
import { Badge } from "~/ui/badge";
import { getSession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { getSession as sixSession, commitSession as sixCommit, } from '~/utils/misc.user.server'
import { getSession as sixsix, commitSession as sixsixcommit, } from '~/utils/pref.server'
import { Separator } from "~/components/ui/separator"
import { cn } from "~/components/ui/utils"
import { Button, buttonVariants } from "~/components/ui/button"
import secondary from "~/styles/secondary.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
  { rel: "stylesheet", href: secondary },

]


export function SidebarNav({ mergedFinanceList, }) {
  // console.log(mergedFinanceList, 'mergedFinanceListp')
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0  ",
      )}
    >
      {mergedFinanceList && mergedFinanceList.map((item) => (
        <Link
          key={item.to}
          to={`/dealer/customer/${item.clientfileId}/${item.financeId}`}
          className="justify-start py-3" >
          <p variant='ghost' className="bg-muted hover:bg-muted hover:bg-transparent hover:underline" >
            <div>
              <p>
                {item.year} {item.brand}
              </p>
            </div>
            <div>
              <p>
                {item.model.toString().slice(0, 28)}
              </p>
            </div>
            <Badge className="">{item.customerState}</Badge>

          </p>
        </Link>
      ))
      }
    </nav >
  )
}

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)

  const { clientId, financeId } = params;

  if (!user) { redirect('/login') }
  const deFees = await getDealerFeesbyEmail(user.email)
  const session = await sixsix(request.headers.get("Cookie"))
  const sliderWidth = session.get('sliderWidth')
  let clientfileId = session.get('clientfileId')
  let financeId12 = session.get('financeId')
  const finance = await getMergedFinanceOnFinance(financeId)

  const financeNotes = await getAllFinanceNotes(financeId)

  const financeEmail = await prisma.finance.findFirst({ where: { id: financeId }, });
  const financeList = await prisma.finance.findMany({ where: { email: financeEmail?.email }, });
  const financeIds = financeList.map(financeRecord => financeRecord.id);
  const mergedFinanceList = await getClientListMerged(financeIds);

  const returnThis = redirect(`/customer/${clientId}/${financeId}`)
  const notifications = await prisma.notificationsUser.findMany({
    where: { userEmail: email }
  })
  // console.log(financeIds, financeId, 'quote loader');

  return returnThis && json({ ok: true, mergedFinanceList, clientfileId, finance, deFees, sliderWidth, user, financeNotes, financeId, notifications, financeList }, { headers: { 'Set-Cookie': await sixsixcommit(session) } });

}

export default function SettingsLayout() {
  const { firstParam, clientId } = useParams();
  const { mergedFinanceList, financeId, finance, user, financeList, } = useLoaderData()
  let newFinance;
  const [userIntegration, setuserIntegration] = useState()
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const userIntegration2 = await prisma.userIntergration.findUnique({
        where: { userEmail: user?.email }
      })
      setuserIntegration(userIntegration2)
    };
    fetchUnreadCount();
  }, [user?.email]);

  const activixActivated = userIntegration?.activixActivated
  if (activixActivated === 'yes') {
    newFinance = finance
  } else {
    newFinance = finance
  }
  let NewListForStatus = [
    {
      name: 'status',
      value: newFinance.status === 'Active' ? <Badge className="bg-[#22c55e]">Active</Badge> :
        newFinance.status === 'Invalid' ? <Badge className="bg-white">Invalid</Badge> :
          newFinance.status === 'Duplicate' ? <Badge className="bg-white">Duplicate</Badge> :
            newFinance.status === 'Lost' ? <Badge className="bg-[#e11d48]">Lost</Badge> :
              '',
      label: 'Customer status'
    },
    {
      name: 'customerState',
      value: newFinance.customerState === 'Reached' ? (<Badge className="bg-[#22c55e]">Reached</Badge>
      ) : newFinance.customerState === 'Attemted' ? (<Badge className="bg-white">Attemted</Badge>
      ) : newFinance.customerState === 'Pending' ? (<Badge className="bg-[#e11d48]">Pending</Badge>
      ) : newFinance.customerState === 'Visited' ? (<Badge className="bg-white">Visited</Badge>
      ) : newFinance.customerState === 'bookedApt' ? (<Badge className="bg-white">Booked Apt</Badge>
      ) : newFinance.customerState === 'aptShowed' ? (<Badge className="bg-white">Apt Showed</Badge>
      ) : newFinance.customerState === 'aptNoShowed' ? (<Badge className="bg-white">Apt No Showed</Badge>
      ) : newFinance.customerState === 'sold' ? (<Badge className="bg-[#22c55e]">Sold</Badge>
      ) : newFinance.customerState === 'depositMade' ? (<Badge className="bg-[#f97316]">Deposit</Badge>
      ) : newFinance.customerState === 'turnOver' ? (<Badge className="bg-[#fbbf24]">Turn Over</Badge>
      ) : newFinance.customerState === 'finance[0]App' ? (<Badge className="bg-blue-600">Application Done</Badge>
      ) : newFinance.customerState === 'approved' ? (<Badge className="bg-[#22c55e]">Approved</Badge>
      ) : newFinance.customerState === 'signed' ? (<Badge className="bg-[#22c55e]">Signed</Badge>
      ) : newFinance.customerState === 'pickUpSet' ? (<Badge className="bg-[#22c55e]">Pick Up Set</Badge>
      ) : newFinance.customerState === 'delivered' ? (<Badge className="bg-[#22c55e]">Delivered</Badge>
      ) : newFinance.customerState === 'refund' ? (<Badge className="bg-[#f97316]">Refunded</Badge>
      ) : newFinance.customerState === 'funded' ? (<Badge className="bg-[#f97316]">Funded</Badge>
      ) : (
        ''
      ),
      label: 'Customer State'
    },
  ]
  return (
    <>
      <Outlet />

    </>
  )
}
/** <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Client File</h2>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/6">
            {/*  <SidebarNav mergedFinanceList={mergedFinanceList} />*
            </aside>
            <div className="flex-1 mr-3">
              <Outlet />
            </div>
          </div>
        </div> */
