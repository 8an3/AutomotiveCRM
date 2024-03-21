/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, Outlet, useFetcher, useLoaderData, useParams, useSubmit } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/other/card";
import { type LoaderFunction, type DataFunctionArgs, redirect, type V2_MetaFunction, type ActionFunction, json, } from '@remix-run/node'
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getAllFinanceNotes } from '~/utils/financeNote/get.server';
import { getClientListMerged, getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import React from "react";
import { prisma } from "~/libs";
import { Flex, Text, Box, TextArea, TextField, Heading, Select, Theme, ThemePanel, Inset, Grid, Avatar } from '@radix-ui/themes';
import { Badge } from "~/other/badge";
import { getSession } from "~/sessions/auth-session.server";

import { getSession as sixSession, commitSession as sixCommit, } from '~/utils/misc.user.server'

import Sidebar from "~/components/shared/sidebar";
import { model } from '~/models'

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")


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
      activixActivated: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  const deFees = await getDealerFeesbyEmail(user.email)
  const session = await sixSession(request.headers.get("Cookie"))
  const sliderWidth = session.get('sliderWidth')
  let clientfileId = session.get('clientfileId')
  let financeId = session.get('financeId')
  console.log(financeId, 'financeid')
  const finance = await getMergedFinanceOnFinance(financeId)
  const financeNotes = await getAllFinanceNotes(financeId)
  const financeEmail = await prisma.finance.findFirst({ where: { clientfileId: clientfileId, }, });
  const financeList = await prisma.finance.findMany({ where: { email: financeEmail?.email }, });
  console.log(financeList, 'listssst')
  financeId = financeList[0].id
  const { firstParam, clientId } = params;
  // console.log(clientId, financeId)
  const financeIds = financeList.map(financeRecord => financeRecord.id);
  const mergedFinanceList = await getClientListMerged(financeIds);
  const returnThis = redirect(`/customer/${clientId}/${financeId}`)
  const notifications = await prisma.notificationsUser.findMany({
    where: {
      userId: user.id,
    }
  })

  return returnThis && json({ ok: true, mergedFinanceList, clientfileId, finance, deFees, sliderWidth, user, financeNotes, financeId, notifications },)

}
export default function CustMaIN() {
  const { clientfileId, financeId, user } = useLoaderData()
  /** <>
        <Sidebar />
        <div className="flex flex-col md:flex-row   ">
          <div className="w-full md:w-64 bg-slate12 mt-[50px]">
            <Sidebar2 />
          </div>
          <div className="w-full mt-[20px]">
            <Outlet />
          </div>
        </div>
      </> */
  return (
    <>
      <div className="w-full h-full min-h-screen  px-2 sm:px-1 lg:px-3 bg-black border-gray-300   ">
        <Sidebar />
        <div className="flex flex-col md:flex-row   ">
          <div className="w-full md:w-64 bg-black mt-[50px]">
            <Sidebar2 />
          </div>
          <div className="w-full mt-[20px]">
            <Outlet />
          </div>
        </div>
      </div>
    </>

  )
}


export function Sidebar2() {
  const { clientfileId, financeId, finance, user } = useLoaderData()
  const { firstParam, clientId } = useParams();
  //console.log(finance)as
  let newFinance;
  if (user.activixActivated === 'yes') {
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
    <div className="w-[225px] md:h-screen  top-0 left-0 p-5 overflow-y-auto ">
      {finance && finance.map((financeRecord, index) => (
        <div key={index} className="w-[95%] mt-3">
          <Link to={`/customer/${clientId}/${financeId}`} className=" cursor-pointer">
            <Card color="gray" className="border border-slate9 p-3 w-auto rounded-md">
              <Flex gap="3" align="center">

                <Box className=''>
                  <Text as="div" size="2" highContrast className='text-slate3 text-sm text-center justify-center' >
                    {financeRecord.year} {financeRecord.brand}
                  </Text>
                  <Text as="div" size="2" weight="bold" highContrast className='text-slate3 text-center text-sm justify-center'>
                    {financeRecord.model.toString().slice(0, 23)}
                  </Text>

                  <div className="flex justify-between">
                    {NewListForStatus.map((item) => (
                      <div key={item.name} className="flex items-center justify-between ">
                        <p className="text-sm text-right">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </Box>
              </Flex>
            </Card>
          </Link>
        </div>
      ))
      }
    </div >
  )
}
