/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, Outlet, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import * as Tabs from '@radix-ui/react-tabs'
import * as Toast from '@radix-ui/react-toast';
import { Overview } from '~/routes/__authorized/dealer/overview/overview.$brandId'
import { RemixNavLink, Input, Separator, Button, TextArea, Label, } from "~/components";
import PrintAndDocs from "~/components/dashboardCustId/printAndDocs";
import Print from "~/components/dashboardCustId/print"
import { getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import { commitSession as commitPref, getSession as getPref } from '~/utils/pref.server';
import { json } from "@remix-run/node";
import { getClientFileById } from "~/utils/finance/get.server";
import FinanceOverview from "~/routes/__authorized/dealer/customer/finance.overview";
import FinanceTab from "./financeTab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { prisma } from "~/libs";


export async function loader({ request }) {
  const session = await getPref(request.headers.get("Cookie"))
  const clientfileId = session.get('clientfileId')
  const financeId = session.get('financeId')
  const finance = await getMergedFinanceOnFinance(financeId)
  const clientFile = await getClientFileById(clientfileId)
  const userList = await prisma.user.findMany()
  return json({ clientFile, finance, userList })
}

export function SalesTab({ timerRef, open, setOpen, outletSize, merged, NewListForStatus, clientUnit }) {
  let fetcher = useFetcher();
  const { finance, clientFile, userList } = useLoaderData()
  //  console.log(finance, 'checking finance')

  const customerStates = [
    { label: 'Reached', value: finance[0].reached, name: 'reached' },
    { label: 'Attempted', value: finance[0].attempted, name: 'attempted' },
    { label: 'Pending', value: finance[0].pending, name: 'pending' },
    { label: 'Visited', value: finance[0].visited, name: 'visited' },
    { label: 'Booked Apt', value: finance[0].bookedApt, name: 'bookedApt' },
    { label: 'Apt Showed', value: finance[0].aptShowed, name: 'aptShowed' },
    { label: 'Apt No Showed', value: finance[0].aptNoShowed, name: 'aptNoShowed' },
    { label: 'Sold', value: finance[0].sold, name: 'sold' },
    { label: 'Deposit', value: finance[0].deposit, name: 'deposit' },
    { label: 'Turn Over', value: finance[0].turnOver, name: 'turnOver' },
    { label: 'Application Done', value: finance[0].applicationDone, name: 'applicationDone' },
    { label: 'Approved', value: finance[0].approved, name: 'approved' },
    { label: 'Signed', value: finance[0].signed, name: 'signed' },
    { label: 'Licensing Sent', value: finance[0].licensingSent, name: 'licensingSent' },
    { label: 'Licening Done', value: finance[0].liceningDone, name: 'liceningDone' },
    { label: 'Pick Up Set', value: finance[0].pickUpSet, name: 'pickUpSet' },
    { label: 'Delivered', value: finance[0].delivered, name: 'delivered' },
    { label: 'Refunded', value: finance[0].refunded, name: 'refunded' },
    { label: 'Funded', value: finance[0].funded, name: 'funded' },
    { label: 'Cancelled', value: finance[0].cancelled, name: 'cancelled' },
    { label: 'Lost', value: finance[0].lost, name: 'lost' },

  ];

  const handleCheckboxChange = (name: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: prevData[name] === 'on' ? 'off' : 'on',
    }));
  };

  const handleInputChange = (name, checked) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked ? 'on' : 'off',
    }));
  };


  const [formData, setFormData] = useState({
    reached: finance[0].reached,
    attempted: finance[0].attempted,
    pending: finance[0].pending,
    visited: finance[0].visited,
    bookedApt: finance[0].bookedApt,
    aptShowed: finance[0].aptShowed,
    aptNoShowed: finance[0].aptNoShowed,
    sold: finance[0].sold,
    deposit: finance[0].deposit,
    turnOver: finance[0].turnOver,
    applicationDone: finance[0].applicationDone,
    approved: finance[0].approved,
    signed: finance[0].signed,
    licensingSent: finance[0].licensingSent,
    liceningDone: finance[0].liceningDone,
    pickUpSet: finance[0].pickUpSet,
    delivered: finance[0].delivered,
    refund: finance[0].refund,
    funded: finance[0].funded,
    cancelled: finance[0].cancelled,
    lost: finance[0].lost,
    financeApp: finance[0].financeApp,
    referral: finance[0].referral,
    testDrive: finance[0].testDrive,
    seenTrade: finance[0].seenTrade,
    metService: finance[0].metService,
    metManager: finance[0].metManager,
    metParts: finance[0].metParts,
    demoed: finance[0].demoed,
  })
  function ClientResultFunction({ formData, }) {
    let clientResultList = [

      { name: 'referral', value: formData.referral, label: 'Referral', },
      { name: 'visited', value: formData.visited, label: 'Visited', },
      { name: 'bookedApt', value: formData.bookedApt, label: 'Booked Apt', },
      { name: 'aptShowed', value: formData.aptShowed, label: 'Apt Showed', },
      { name: 'aptNoShowed', value: formData.aptNoShowed, label: 'Apt No Showed', },
      { name: 'testDrive', value: formData.testDrive, label: 'Test Drive', },
      { name: 'seenTrade', value: formData.seenTrade, label: 'Seen Trade', },
      { name: 'metService', value: formData.metService, label: 'Met Service', },
      { name: 'metManager', value: formData.metManager, label: 'Met Manager', },
      { name: 'metParts', value: formData.metParts, label: 'Met Parts', },
      { name: 'sold', value: formData.sold, label: 'Sold', },
      { name: 'deposit', value: formData.deposit, label: 'Deposit', },
      { name: 'refund', value: formData.refund, label: 'Refund', },
      { name: 'turnOver', value: formData.turnOver, label: 'Turn Over', },
      { name: 'financeApp', value: formData.financeApp, label: 'Finance Application Done', },
      { name: 'approved', value: formData.approved, label: 'approved', },
      { name: 'signed', value: formData.signed, label: 'Signed Docs', },
      { name: 'licensingSent', value: formData.licensingSent, label: 'Licensing Sent', },
      { name: 'liceningDone', value: formData.liceningDone, label: 'Licening Done', },
      { name: 'pickUpSet', value: formData.pickUpSet, label: 'Pick Up Date Set', },
      { name: 'demoed', value: formData.demoed, label: 'Demoed' },
      { name: 'delivered', value: formData.delivered, label: 'Delivered', },
      { name: 'funded', value: formData.funded, label: 'Funded', },
      { name: 'cancelled', value: formData.cancelled, label: 'Cancelled', },
      { name: 'lost', value: formData.lost, label: 'Lost', },
    ];

    return clientResultList
  }


  const submit = useSubmit()
  return (
    <>
      <Tabs.Root className="flex flex-col w-full mt-3 "
        defaultValue="Purchasing"  >
        <Tabs.List className="shrink-0 flex border-b border-white justify-between bg-myColor-900 text-slate1" aria-label="Manage your account">
          <Tabs.Trigger
            className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate1 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
    focus:text-[#02a9ff]    mx-1"
            value="Purchasing"
          >
            <p className="text-slate1 ">
              Purchasing
            </p>

          </Tabs.Trigger>
          <Tabs.Trigger
            className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate1 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
              focus:outline-none  focus:text-[#02a9ff]   mx-1"
            value="Trade"
          >
            <p className="text-slate1 ">
              Trade
            </p>
          </Tabs.Trigger>
          <Tabs.Trigger
            className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate1 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer  focus:outline-none focus:text-[#02a9ff]  mx-1"
            value="Finance"
          >
            <p className="text-slate1 ">
              Finance
            </p>

          </Tabs.Trigger>



          <Tabs.Trigger
            className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate1 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
              focus:outline-none  focus:text-[#02a9ff]  mx-1"
            value="Print"
          >
            <p className="text-slate1 ">
              Docs
            </p>
          </Tabs.Trigger>

        </Tabs.List>
        {/* purchasing  */}
        <Tabs.Content
          className="grow p-5 rounded-tl-md bg-myColor-900 text-slate1 rounded-b-md outline-none  focus:shadow-black"
          value="Purchasing"  >
          <div className="mb-8">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0"  >
              <div className="rounded-t bg-slate12 mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <h6 className="text-slate1 text-xl font-bold uppercase">
                    Purchasing
                  </h6>
                </div>
              </div>
              <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11">
                <fetcher.Form method="post">
                  <Input type="hidden" defaultValue={finance[0].id} name="financeId" />
                  <Input type="hidden" defaultValue={finance[0].id} name="id" />
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase mt-2 text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Brand
                        </label>
                        <input
                          type="text"
                          className="w-full  rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                          defaultValue={finance[0].brand}
                          name='brand'
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase mt-2 text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Model
                        </label>
                        <input
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].model}
                          name='model'
                        />
                      </div>
                    </div>
                    {clientUnit && clientUnit.year ? (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Year
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            defaultValue={clientUnit.year}
                            name='year'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Year
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"

                            name='year'
                          />
                        </div>
                      </div>
                    )}
                    {clientUnit && clientUnit.submodel ? (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Trim
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            defaultValue={clientUnit.submodel}
                            name='trim'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Trim
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            name='trim'
                          />
                        </div>
                      </div>
                    )}

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Stock Number
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].stockNum}
                          name='stockNum'
                        />
                      </div>
                    </div>
                    {clientUnit && clientUnit.model ? (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Model Code
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            defaultValue={clientUnit.model}
                            name='modelCode'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Model Code
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            name='modelCode'
                          />
                        </div>
                      </div>
                    )}
                    {clientUnit && clientUnit.exteriorColor ? (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Color
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            defaultValue={clientUnit.exteriorColor}
                            name='color'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Color
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            name='color'
                          />
                        </div>
                      </div>
                    )}
                    {clientUnit && clientUnit.mileage ? (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Mileage
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            defaultValue={clientUnit.mileage}
                            name='color'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Mileage
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            name='color'
                          />
                        </div>
                      </div>
                    )}
                    {clientUnit && clientUnit.location ? (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            defaultValue={clientUnit.location}
                            name='color'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            name='color'
                          />
                        </div>
                      </div>
                    )}

                    {clientUnit && clientUnit.vin ? (
                      <div className="w-full  px-4">

                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            vin
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            defaultValue={clientUnit.vin}
                            name='vin'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full  px-4">

                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-slate1 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            vin
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                            name='vin'
                          />
                        </div>
                      </div>
                    )}



                    <Toast.Provider swipeDirection="right">
                      <button
                        onClick={() => {
                          setOpen(false);
                          window.clearTimeout(timerRef.current);
                          timerRef.current = window.setTimeout(() => {
                            setOpen(true);
                          }, 100);
                        }}
                        type="submit" name='intent' value='updateWantedUnit'
                        className="bg-[#2ebb98] cursor-pointer  mt-3 ml-auto text-slate1 active:bg-[#1b6e59] font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      >
                        Update
                      </button>
                      <Toast.Root open={open} onOpenChange={setOpen} className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
                        <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                          {finance[0].firstName}'s File Updated.
                        </Toast.Title>
                        <Toast.Description asChild>
                        </Toast.Description>
                      </Toast.Root>
                      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
                    </Toast.Provider>
                  </div>
                </fetcher.Form>

                <div className=" items-center space-x-2 mt-5">
                  <fetcher.Form method="post"
                    onChange={(event) => {
                      submit(event.currentTarget);
                    }}
                    className=" items-center space-x-2 grid grid-cols-2 "
                  >
                    {ClientResultFunction({ formData })
                      .map((item) => (
                        <div key={item.name} className='flex justify-between items-center '>
                          <label htmlFor={item.name}>{item.label}</label>
                          <input
                            className='mr-3 cursor-pointer'
                            type="checkbox"
                            id={item.name}
                            name={item.name}
                            checked={item.value === 'on'}
                            onChange={(e) => handleInputChange(item.name, e.target.checked)}
                          />
                        </div>
                      ))}


                    <input type='hidden' name='intent' value='dealProgress' />
                    <Input type="hidden" defaultValue={finance[0].id} name="financeId" />
                    <Input type="hidden" defaultValue={finance[0].id} name="id" />
                  </fetcher.Form>
                  <div className=' flex mt-2 justify-between'>
                    <fetcher.Form method="post"
                      onChange={(event) => {
                        submit(event.currentTarget);
                      }}
                      className="space-x-2 "
                    >
                      <Select name='userEmail' defaultValue={finance[0].userEmail}>
                        <SelectTrigger className="max-w-sm rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                          <SelectValue>Assigned Sales Person</SelectValue>
                        </SelectTrigger>
                        <SelectContent className='bg-slate1 text-slate12'>
                          {userList.map((user, index) => (
                            <SelectItem key={index} value={user.email}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </fetcher.Form>
                    <fetcher.Form method="post"
                      onChange={(event) => {
                        submit(event.currentTarget);
                      }}
                      className="space-x-2 "
                    >
                      <Select name='financeManager' defaultValue={finance[0].financeManager}>
                        <SelectTrigger className="max-w-sm  rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                          <SelectValue>Assigned F & I</SelectValue>
                        </SelectTrigger>
                        <SelectContent className='bg-slate1 text-slate12'>
                          {userList.map((user, index) => (
                            <SelectItem key={index} value={user.id}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </fetcher.Form>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </Tabs.Content>
        {/* trade  */}
        <Tabs.Content className="grow p-5 rounded-tl-md bg-myColor-900 rounded-b-md outline-none  focus:shadow-black"
          value="Trade"  >
          <div className="mb-8">
            <div
              className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0"
            >
              <div className="rounded-t bg-slate12 mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <h6 className="text-slate1 text-xl font-bold uppercase">
                    Trade-In
                  </h6>
                </div>
              </div>
              <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11">
                <fetcher.Form method="post">
                  <Input type="hidden" defaultValue={finance[0].id} name="financeId" />
                  <Input type="hidden" defaultValue={finance[0].id} name="id" />
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase mt-2  text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Brand
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].tradeMake}
                          name='tradeMake'
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase  mt-2 text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          model
                        </label>
                        <input
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].tradeDesc}
                          name='tradeDesc'
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          year
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].tradeYear}
                          name='tradeYear'
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          trim
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].tradeTrim}
                          name='tradeTrim'
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Color
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].tradeColor}
                          name='tradeColor'
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Mileage
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].tradeMileage}
                          name='tradeMileage'
                        />
                      </div>
                    </div>


                    <div className="w-full  px-4">

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-slate1 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          VIN
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                          defaultValue={finance[0].tradeVin}
                          name='tradeVin'
                        />
                      </div>
                    </div>
                    <Toast.Provider swipeDirection="right">
                      <button
                        onClick={() => {
                          setOpen(false);
                          window.clearTimeout(timerRef.current);
                          timerRef.current = window.setTimeout(() => {
                            setOpen(true);
                          }, 100);
                        }}
                        type="submit" name='intent' value='updateTrade'
                        className="bg-[#2ebb98] cursor-pointer  mt-3 ml-auto text-slate1 active:bg-[#1b6e59] font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      >
                        Update
                      </button>
                      <Toast.Root open={open} onOpenChange={setOpen} className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut
                   background: inherit;
                   background-color: rgba(255, 255, 255, .3);
                   backdrop-filter: blur(5px);
                   height: 80%; width: 80%;
                   margin:auto!important;">
                        <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                          {finance[0].firstName}'s File Updated.
                        </Toast.Title>
                        <Toast.Description asChild>
                        </Toast.Description>
                      </Toast.Root>
                      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
                    </Toast.Provider>
                  </div>
                </fetcher.Form>

              </div>
            </div>
          </div>
        </Tabs.Content>
        {/* fiance  */}
        <Tabs.Content className="grow p-5 rounded-tl-md bg-myColor-900 rounded-b-md outline-none  focus:shadow-black"
          value="Finance"  >
          <div className="mb-8">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0" >
              <div className="rounded-t bg-slate12 mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <h6 className="text-slate1 text-xl font-bold uppercase">
                    Finance
                  </h6>
                </div>
              </div>
              <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11">
                <FinanceTab merged={merged} />
              </div>
            </div>
          </div>
        </Tabs.Content>
        {/* overview  */}
        <Tabs.Content className="grow p-5 rounded-tl-md bg-myColor-900 rounded-b-md outline-none  focus:shadow-black"
          value="Overview"  >
          <div className="mb-8">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0"  >
              <div className="rounded-t bg-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <h6 className="text-gray-700 text-xl font-bold">
                    Overview
                  </h6>
                </div>
              </div>
              <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-gray-100">
                <FinanceOverview />
              </div>
            </div>
          </div>
        </Tabs.Content>
        {/* docs and print  */}
        <Tabs.Content
          className="grow p-5 bg-myColor-900 text-slate1 rounded-b-md outline-none  focus:shadow-black"
          value="Print"  >
          <PrintAndDocs finance={finance} />
        </Tabs.Content>

      </Tabs.Root >
    </>
  )
}
