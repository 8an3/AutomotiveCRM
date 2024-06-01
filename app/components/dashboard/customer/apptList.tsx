/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useTransition, useParams, useLocation } from "@remix-run/react";
import { RemixNavLink, Input, Separator, Button, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, TextArea, Label, } from "~/components";
import * as Toolbar from "@radix-ui/react-toolbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { getAllFinanceApts, getAllFinanceApts2, getFinanceAppts } from '~/utils/financeAppts/get.server';
import { createSalesInput } from '~/utils/salestracker.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';

import { model } from "~/models";
import {
  type DataFunctionArgs, type V2_MetaFunction, type ActionFunction,
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  redirect,
} from '@remix-run/node'
import { getSession } from "~/sessions/auth-session.server";
import { deleteBMW, deleteFinance, deleteManitou } from '~/utils/finance/delete.server';
import { createFinance, createFinanceManitou, createBMWOptions, createBMWOptions2, } from "~/utils/finance/create.server";
import { createFinanceNote } from '~/utils/financeNote/create.server';
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getLatestFinance, getLatestFinance2, getLatestFinanceManitou, getDataKawasaki, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou, getFinance } from "~/utils/finance/get.server";
import { updateFinance } from "~/utils/finance/update.server";
import { getAllFinanceNotes, getSingleCustomerNote } from '~/utils/financeNote/get.server';
import { deleteFinanceNote } from '~/utils/financeNote/delete.server';
import { updateFinanceNote } from '~/utils/financeNote/update.server';
import { createDashData } from '~/utils/dashboard/create.server';
import { updateDashData } from '~/utils/dashboard/update.server';
import { createFinanceAppt } from '~/utils/financeAppts/create.server';
import { updateFinanceAppt } from '~/utils/financeAppts/update.server';
import { prisma } from "~/libs";

export async function loader({ params, request }: DataFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  const email = user?.email
  const deFees = await getDealerFeesbyEmail(email)
  const session = await getSession(request.headers.get("Cookie"))
  const sliderWidth = session.get('sliderWidth')
  const financeCookie = session.get('financeId')

  const urlSegments = new URL(request.url).pathname.split('/');
  const financeId = financeCookie

  const finance = await findQuoteById(financeCookie);
  const dashData = await findDashboardDataById(financeCookie);
  const brand = finance?.brand

  const urlSegmentsDashboard = new URL(request.url).pathname.split('/');
  const dashBoardCustURL = urlSegmentsDashboard.slice(0, 3).join('/');

  const customerId = finance?.id
  const financeNotes = await getAllFinanceNotes(customerId)
  console.log(financeCookie, financeCookie, 'financeId')

  if (brand === 'Manitou') {
    const modelData = await getDataByModelManitou(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth, user, dashData, financeNotes, dashBoardCustURL })
  }

  if (brand === 'Switch') {
    const modelData = await getDataByModel(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth, user, dashData, financeNotes, dashBoardCustURL })
  }

  if (brand === 'Kawasaki') {
    const modelData = await getDataKawasaki(finance);
    return json({ ok: true, modelData, finance, deFees, sliderWidth, user, dashData, financeNotes, dashBoardCustURL })
  }

  if (brand === 'BMW-Motorrad') {
    const financeId = finance?.id
    const bmwMoto = await getLatestBMWOptions(financeId)
    const bmwMoto2 = await getLatestBMWOptions2(financeId)
    const modelData = await getDataBmwMoto(finance);
    return json({ ok: true, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth, user, dashData, financeNotes, dashBoardCustURL })
  }

  if (brand === 'Triumph') {
    const modelData = await getDataTriumph(finance);
    return json({ ok: true, modelData, finance, deFees, sliderWidth, user, dashData, financeNotes, dashBoardCustURL })
  }

  if (brand === 'Harley-Davidson') {
    const modelData = await getDataHarley(finance);
    const apptFinance2 = await getAllFinanceApts2(financeId)
    const aptFinance3 = await getAllFinanceApts(financeId)
    return json({ ok: true, modelData, apptFinance2, aptFinance3, finance, deFees, sliderWidth, user, dashData, financeNotes, dashBoardCustURL })
  }

  else {
    const modelData = await getDataByModel(finance)
    return json({ ok: true, modelData, finance, deFees, sliderWidth, user, dashData, financeNotes, dashBoardCustURL })
  }
}

export default function ApptList({ aptFinance3 }) {
  const { finance, user, dashData, dashBoardCustURL, } = useLoaderData();
  console.log(aptFinance3, 'financeId')
  const [formData, setFormData] = useState({
    note: '',
    apptStatus: 'future',
    completed: 'no',
    financeId: '',//aptPayload.financeId,
    contactMethod: '',//aptPayload.contactMethod,
    apptDay: '',// aptPayload.apptDay,
    apptTime: '',//aptPayload.apptTime,
    appointment: '',// aptPayload.appointment,
    userId: '',// aptPayload.userId,
    apptType: '',// aptPayload.apptType,
    appts: [],
  });
  //console.log(formData)
  const [editItemId, setEditItemId] = useState(null);

  const handleEditClick = (itemId) => {
    setEditItemId(itemId);
  };


  const fetcher = useFetcher();
  let transition = useTransition();
  let isDeleting =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "deleteFinanceNote";
  let isAdding =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "saveFinanceNote";

  let formRef = useRef();

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const submit = useSubmit();



  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function isPast(date) {
    const today = new Date();
    return date < today;
  }


  return (
    <div className="flex flex-col">
      <div className="relative mx-3 mt-3 max-h-[600px] h-auto overflow-y-auto">
        <ul>

          {aptFinance3.map((message) => (
            <li
              key={message.id}
              style={{
                opacity: isDeleting ? 0.5 : 1, d
              }}
              className="flex-cols-2 flex "
            >
              <Card
                className={`mr-1 mt-1 w-full rounded-[0px]
                 ${isToday(new Date(message?.start)) ? 'border-yellow-500 border:w-[4px] ' :
                    isPast(new Date(message.start)) ? 'border-red-500 border:w-[3px]  text-black bg-red-300' :
                      message.appStatus === 'completed' ? 'border:w-[5px]' :
                        'border-green-500 border:w-[5px] text-black'
                  }`}
              >
                <CardContent className="flex flex-col " >
                  <div className="mt-1 flex justify-between">
                    <p className="text-thin ">{message.start} </p>
                  </div>
                  <p className="text-thin ">{message.contactMethod} </p>
                  <p className="text-thin ">{message.title} </p>
                  {editItemId === message.id ? (
                    <TextArea
                      placeholder="Type your message here."
                      key={message.id}
                      name="note"
                      className=" mt-2 h-[50px] rounded-[0px]"
                      defaultValue={message.note}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-thin  text-left">
                      {message.note}
                    </p>
                  )}
                  {message.completed === 'yes' && (
                    <p className="text-thin ">Completed! </p>

                  )}
                </CardContent>
              </Card>
              <Input
                type="hidden"
                defaultValue={user.name}
                name="author"
              />
              <Input
                type="hidden"
                defaultValue={finance.id}
                name="customerId"
              />

              {/* Toolbar */}
              < Toolbar.Root className="my-auto ml-auto mt-1 mt-1 flex h-full  w-[30px] justify-center bg-white p-[10px] shadow-[0_2px_2px] shadow-blackA4" >
                <Toolbar.ToggleGroup
                  type="multiple"
                  className="flex flex-col"
                >

                  <fetcher.Form method="post" onSubmit={(event) => {
                    submit(event.currentTarget);
                  }}>
                    <Toolbar.ToggleItem
                      name="intent"
                      type="submit"
                      value="updateFinanceAppt"
                      className="cursor-pointer"
                      onClick={() => { setEditItemId(null); }}  >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="none"
                        strokeWidth="1.2"
                        viewBox="0 0 24 24"
                        color="#000000"
                      >
                        <path
                          stroke="#000000"
                          strokeWidth="1.2"
                          d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                        ></path>
                        <path
                          stroke="#000000"
                          strokeWidth="1.2"
                          d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z"
                        ></path>
                      </svg>
                    </Toolbar.ToggleItem>

                    <Input type="hidden" defaultValue={user.name} name="author" />
                    <Input type="hidden" defaultValue={message.id} name="customerId" />
                    <Input type="hidden" defaultValue={message.id} name="id" />
                    <Input type="hidden" defaultValue="updateFinanceAppt" name="intent" />
                    <Input type="hidden" defaultValue={formData.note} name="note" />
                    <Input type="hidden" defaultValue={user.id} name="userId" />
                    <Input type="hidden" defaultValue={finance.id} name="financeId" />

                    <Toolbar.ToggleItem

                      value="updateFinanceAppt"
                      className="cursor-pointer mt-1"
                      onClick={() => {
                        handleEditClick(message.id)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="none"
                        strokeWidth="1.2"
                        viewBox="0 0 24 24"
                        color="#000000"
                      >
                        <path
                          stroke="#000000"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.363 5.652 1.48-1.48a2 2 0 0 1 2.829 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.48 1.48m-4.243-4.242-9.616 9.615a2 2 0 0 0-.578 1.238l-.242 2.74a1 1 0 0 0 1.084 1.085l2.74-.242a2 2 0 0 0 1.24-.578l9.615-9.616m-4.243-4.242 4.243 4.242"
                        ></path>
                      </svg>
                    </Toolbar.ToggleItem>
                  </fetcher.Form>

                  <fetcher.Form method="post">
                    <Input type="hidden" defaultValue={user.name} name="author" />
                    <Input type="hidden" defaultValue={user.id} name="userId" />
                    <Input type="hidden" defaultValue={finance.id} name="financeId" />
                    <Input type="hidden" defaultValue={message.id} name="id" />
                    <Input type="hidden" defaultValue={dashData.customerState} name="customerState" />
                    <Input type="hidden" defaultValue='yes' name="completed" />
                    <input type='hidden' value='completeApt' name='intent' />
                    <Toolbar.ToggleItem type="submit" value='completeApt' className="cursor-pointer mt-1"   >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </Toolbar.ToggleItem>
                  </fetcher.Form>
                </Toolbar.ToggleGroup>
              </Toolbar.Root>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

