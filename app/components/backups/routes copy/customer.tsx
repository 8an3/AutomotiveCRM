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

import { commitSession as commitPref, getSession as getPref } from '~/utils/pref.server';
import Sidebar from "~/components/shared/sidebar";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  const deFees = await getDealerFeesbyEmail(email)
  const session = await getPref(request.headers.get("Cookie"))
  const sliderWidth = session.get('sliderWidth')
  let clientfileId = session.get('clientfileId')
  let financeId = session.get('financeId')
  const finance = await getMergedFinanceOnFinance(financeId)
  const financeNotes = await getAllFinanceNotes(financeId)
  const financeList = await prisma.finance.findMany({ where: { clientfileId: clientfileId, }, });
  financeId = financeList[0].id
  const { firstParam, clientId } = params;
  console.log(clientId, financeId)
  const financeIds = financeList.map(financeRecord => financeRecord.id);
  const mergedFinanceList = await getClientListMerged(financeIds);
  const returnThis = redirect(`/customer/${clientId}/${financeId}`)

  return returnThis && json({ ok: true, mergedFinanceList, clientfileId, finance, deFees, sliderWidth, user, financeNotes, financeId, },)

}
export default function CustMaIN() {
  const { clientfileId, financeId, user } = useLoaderData()

  return (
    <>
      <Sidebar />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 bg-slate12">
          <Sidebar2 />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </>
  )
}


export function Sidebar2() {
  const { clientfileId, financeId, finance } = useLoaderData()
  const { firstParam, clientId } = useParams();
  //console.log(finance)

  let NewListForStatus = [
    {
      name: 'status',
      value: finance[0].status === 'Active' ? <Badge className="bg-[#22c55e]">Active</Badge> :
        finance[0].status === 'Invalid' ? <Badge className="bg-white">Invalid</Badge> :
          finance[0].status === 'Duplicate' ? <Badge className="bg-white">Duplicate</Badge> :
            finance[0].status === 'Lost' ? <Badge className="bg-[#e11d48]">Lost</Badge> :
              '',
      label: 'Customer status'
    },
    {
      name: 'customerState',
      value: finance[0].customerState === 'Reached' ? (<Badge className="bg-[#22c55e]">Reached</Badge>
      ) : finance[0].customerState === 'Attemted' ? (<Badge className="bg-white">Attemted</Badge>
      ) : finance[0].customerState === 'Pending' ? (<Badge className="bg-[#e11d48]">Pending</Badge>
      ) : finance[0].customerState === 'Visited' ? (<Badge className="bg-white">Visited</Badge>
      ) : finance[0].customerState === 'bookedApt' ? (<Badge className="bg-white">Booked Apt</Badge>
      ) : finance[0].customerState === 'aptShowed' ? (<Badge className="bg-white">Apt Showed</Badge>
      ) : finance[0].customerState === 'aptNoShowed' ? (<Badge className="bg-white">Apt No Showed</Badge>
      ) : finance[0].customerState === 'sold' ? (<Badge className="bg-[#22c55e]">Sold</Badge>
      ) : finance[0].customerState === 'depositMade' ? (<Badge className="bg-[#f97316]">Deposit</Badge>
      ) : finance[0].customerState === 'turnOver' ? (<Badge className="bg-[#fbbf24]">Turn Over</Badge>
      ) : finance[0].customerState === 'finance[0]App' ? (<Badge className="bg-blue-600">Application Done</Badge>
      ) : finance[0].customerState === 'approved' ? (<Badge className="bg-[#22c55e]">Approved</Badge>
      ) : finance[0].customerState === 'signed' ? (<Badge className="bg-[#22c55e]">Signed</Badge>
      ) : finance[0].customerState === 'pickUpSet' ? (<Badge className="bg-[#22c55e]">Pick Up Set</Badge>
      ) : finance[0].customerState === 'delivered' ? (<Badge className="bg-[#22c55e]">Delivered</Badge>
      ) : finance[0].customerState === 'refund' ? (<Badge className="bg-[#f97316]">Refunded</Badge>
      ) : finance[0].customerState === 'funded' ? (<Badge className="bg-[#f97316]">Funded</Badge>
      ) : (
        ''
      ),
      label: 'Customer State'
    },
  ]
  return (
    <div className="w-[225px] md:h-screen  top-0 left-0 p-5 overflow-y-auto ">
      {finance && finance.map((financeRecord, index) => (
        <div key={index} className="w-[95%]">
          <Link to={`/customer/${clientId}/${financeId}`} className=" cursor-pointer">
            <Card color="gray" className="border border-slate9 p-3 w-auto">
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
