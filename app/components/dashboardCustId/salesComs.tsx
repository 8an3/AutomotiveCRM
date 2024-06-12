/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, Outlet, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import FinanceNotes from "~/components/dashboard/customer/financeNotes";
import * as Tabs from '@radix-ui/react-tabs'
import { RemixNavLink, Input, Separator, Button, TextArea, Label, } from "~/components";
import * as Toolbar from "@radix-ui/react-toolbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card";
import { commitSession as commitPref, getSession as getPref } from '~/utils/pref.server';
import ClientComs from "~/components/dashboard/customer/clientComs";
import { getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import { json } from "@remix-run/node";
import { getClientFileById } from "~/utils/finance/get.server";
import React from "react";
import Print from "~/components/dashboardCustId/print"
import { getSession } from "~/sessions/auth-session.server";


export async function loader({ request }) {
  const session = await getPref(request.headers.get("Cookie"))
  const clientfileId = session.get('clientfileId')
  const financeId = session.get('financeId')
  const finance = await getMergedFinanceOnFinance(financeId)
  const clientFile = await getClientFileById(clientfileId)
  return json({ clientFile, finance, })
}

export function SalesComms({
  Coms, user, handleEditClick, aptFinance3, isToday, isPast, editItemId, setEditItemId, handleChange, isDeleting, submit
}) {
  let fetcher = useFetcher();
  const { finance, clientFile } = useLoaderData()
  //console.log(aptFinance3, 'aptFinance3')

  return (
    <Tabs.Root className="flex flex-col w-full mt-3  bg-blak mx-auto"
      defaultValue="notes"
    >
      <Tabs.List className="shrink-0 flex border-b border-white bg-myColor-900 text-foreground" aria-label="Manage your account">
        <Tabs.Trigger
          className="bg-myColor-900 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary text-foreground active:bg-primary font-bold uppercase  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150 cursor-pointer"
          value="notes" >
          <p className="text-foreground ">
            Notes

          </p>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-myColor-900 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary text-foreground active:bg-primary font-bold uppercase  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150 cursor-pointer"
          value="aptHist" >
          <p className="text-foreground ">
            Apt history
          </p>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-myColor-900 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary text-foreground active:bg-primary font-bold uppercase  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150 cursor-pointer"
          value="coms" >
          <p className="text-foreground ">
            Client Interactions

          </p>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary text-foreground active:bg-primary font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
              focus:outline-none  focus:text-primary  mx-1"
          value="Upload"
        >
          <p className="text-foreground ">
            Upload
          </p>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="grow  bg-myColor-900 text-foreground rounded-b-md outline-none  focus:shadow-black" value="notes"  >
        <div className="mb-4 p-5 h-full   text-foreground">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 shadow-lg rounded-lg  border-0 bg-background1" >
            <div className="rounded-t bg-background mb-4 p-4 ">
              <div className="text-center flex justify-between">
                <h6 className="text-foreground text-xl font-bold uppercase px-3 py-2">
                  notes
                </h6>
              </div>
            </div>
            <div className="">
              <FinanceNotes />
            </div>
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content className="grow p-5 rounded-tr-md bg-myColor-900 text-foreground rounded-b-md outline-none  focus:shadow-black" value="aptHist" >
        <div className="mb-4 w-full  text-foreground">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 shadow-lg rounded-lg  border-0 bg-background1" >
            <div className="rounded-t bg-background mb-0 p-4 ">
              <div className="text-center flex justify-between">
                <h6 className="text-foreground text-xl font-bold uppercase px-3 py-2">
                  Appointments
                </h6>
              </div>
            </div>
            <div className="py-6 px-6">
              <ul>

                {aptFinance3.map((message) => (
                  <li
                    key={message.id}
                    style={{
                      opacity: isDeleting ? 0.5 : 1,
                    }}
                    className="flex-cols-2 flex mb-4"
                  >
                    <Card
                      className={`w-full rounded  bg-background text-sm text-foreground placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary
${isToday(new Date(message?.start)) ? 'border-yellow-500 border:w-[4px] ' :
                          isPast(new Date(message.start)) ? 'border-red-500 border:w-[3px] bg-red-600' :
                            message.appStatus === 'completed' ? 'border-gray-500 border:w-[5px] bg-gray-600' :
                              message.completed === 'yes' ? 'border:w-[5px] border-black' :
                                'border-green-500 border:w-[5px]'
                        }`}
                    >
                      <CardContent className="flex flex-col " >
                        <div className="mt-1 flex justify-between">
                          <p className="text-thin text-[13px]">{message.start} </p>
                        </div>
                        <p className="text-thin text-[11px]">{message.contactMethod} </p>
                        <p className="text-thin text-[11px]">{message.title} </p>
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
                          <p className="text-thin text-[11px] text-left">
                            {message.note}
                          </p>
                        )}
                        {message.completed === 'yes' && (
                          <p className="text-thin text-[13px]">Completed! </p>

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
                      defaultValue={finance[0].id}
                      name="customerId"
                    />

                    {/* Toolbar */}
                    < Toolbar.Root className="my-auto ml-auto mt-1 mt-1 flex h-full  w-[30px] justify-center  p-[10px]   bg-background1" >
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
                            className="cursor-pointer hover:text-primary"
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
                                stroke="#bed5db"
                                strokeWidth="1.2"
                                d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                              ></path>
                              <path
                                stroke="#bed5db"
                                strokeWidth="1.2"
                                d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z"
                              ></path>
                            </svg>
                          </Toolbar.ToggleItem>

                          <Input type="hidden" defaultValue={user.name} name="author" />
                          <Input type="hidden" defaultValue={message.id} name="customerId" />
                          <Input type="hidden" defaultValue={message.id} name="messageId" />
                          <Input type="hidden" defaultValue="updateFinanceAppt" name="intent" />
                          <Input type="hidden" defaultValue={user.id} name="userId" />
                          <Input type="hidden" defaultValue={finance[0].id} name="financeId" />

                          <Toolbar.ToggleItem

                            value="updateFinanceAppt"
                            className="cursor-pointer mt-1 hover:text-primary"
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
                                stroke="#bed5db"
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
                          <Input type="hidden" defaultValue={finance[0].id} name="financeId" />
                          <Input type="hidden" defaultValue={message.id} name="messageId" />
                          <Input type="hidden" defaultValue={finance[0].customerState} name="customerState" />
                          <input type='hidden' value='completeApt' name='intent' />
                          <Toolbar.ToggleItem type="submit" value='completeApt' className="cursor-pointer mt-1 hover:text-primary"   >
                            <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                          </Toolbar.ToggleItem>
                        </fetcher.Form>

                        {user.email === 'skylerzanth@gmail.com' && (
                          <fetcher.Form method="post">
                            <Input type="hidden" defaultValue={user.name} name="author" />
                            <Input type="hidden" defaultValue={user.id} name="userId" />
                            <Input type="hidden" defaultValue={finance[0].id} name="financeId" />
                            <Input type="hidden" defaultValue={message.id} name="messageId" />
                            <Input type="hidden" defaultValue={finance[0].customerState} name="customerState" />
                            <Input type="hidden" defaultValue='yes' name="completed" />
                            <input type='hidden' value='deleteApt' name='intent' />
                            <Toolbar.ToggleItem type="submit" value='deleteApt' className="cursor-pointer mt-1 hover:text-primary"   >
                              <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>                                          </Toolbar.ToggleItem>
                          </fetcher.Form>
                        )}

                      </Toolbar.ToggleGroup>
                    </Toolbar.Root>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>




      </Tabs.Content>
      <Tabs.Content className="grow p-5 rounded-tr-md bg-myColor-900 text-foreground rounded-b-md outline-none  focus:shadow-black" value="coms" >
        <div className="mb-4 h-full  text-foreground">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 shadow-lg rounded-lg  border-0 bg-background1" >
            <div className="rounded-t bg-background mb-0 p-4 ">
              <div className="text-center flex justify-between">
                <h6 className="text-foreground text-xl font-bold uppercase px-3 py-2">
                  Client Communications
                </h6>
              </div>
            </div>
            <div className="p-4">
              <ClientComs Coms={Coms} />
            </div>
          </div>
        </div>

      </Tabs.Content>
      <Tabs.Content className="grow p-5 rounded-tr-md bg-myColor-900 text-foreground rounded-b-md outline-none  focus:shadow-black" value="Upload"  >
        <Print finance={finance} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
