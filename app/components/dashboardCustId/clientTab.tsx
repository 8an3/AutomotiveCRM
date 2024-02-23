/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, Outlet, useActionData, useFetcher, useLoaderData, useParams } from "@remix-run/react";
import * as Toast from '@radix-ui/react-toast';
import { Overview } from './overview.$brandId'
import { RemixNavLink, Input, Separator, Button, TextArea, Label, } from "~/components";
import { getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import { getSession } from "~/utils/pref.server";
import { json } from "@remix-run/node";
import { getClientFileById } from "~/utils/finance/get.server";

export function ClientTab({ timerRef, open, setOpen, user, }) {
  let fetcher = useFetcher();
  const params = useParams();

  const clientId = params.clientId
  const financeId = params.financeId

  const { finance, clientFile, clientfileId } = useLoaderData()
  return (
    <div className="mb-8 mt-3">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0"  >
        <div className="rounded-t bg-slate12 mb-0 px-6 py-6 border-t border-white border-x">
          <div className="text-center flex justify-between">
            <h6 className="text-slate1 text-xl font-bold uppercase">
              Client Details
            </h6>
          </div>
        </div>
        <div >

          <fetcher.Form method="post">
            <Input type="hidden" defaultValue={financeId} name="dashboardId" />
            <Input type="hidden" defaultValue={clientId} name="clientId" />
            <Input type="hidden" defaultValue={finance.clientfileId} name="financeId" />
            <Input type="hidden" defaultValue={clientfileId} name="clientfileId" />
            <Input type="hidden" defaultValue={clientFile.id} name="id" />
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-slate11">

              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2 mt-2"
                      htmlFor="grid-password"
                    >
                      First Name
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.firstName}
                      name='firstName'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2 mt-2"
                      htmlFor="grid-password"
                    >
                      Last Name
                    </label>
                    <Input

                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.lastName}
                      name='lastName'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Phone
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.phone}
                      name='phone'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <Input
                      type="email"
                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.email}
                      name='email'
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 text-white" />

              <h6
                className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase"
              >
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Address
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.address}
                      name='address'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      City
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.city}
                      name='city'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      province
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.province}
                      name='province'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.postal}
                      name='postal'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-slate1 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Drivers License
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={clientFile.dl}
                      name='dl'
                    />
                  </div>
                </div>

              </div>

              <hr className="mt-6 border-b-1 text-white" />

              <h6 className="text-white text-sm mt-3 mb-6 font-bold uppercase"  >
                Prefered Contact
              </h6>

              <div className="grid md:grid-cols-2 sm:grid-cols-1 mx-auto">
                <select
                  defaultValue={clientFile.typeOfContact}
                  name='typeOfContact'
                  placeholder=""
                  className=" max-w-sm mx-2 rounded border-0 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"              >
                  <option value="">Best Form To Contact</option>
                  <option value="Phone">Phone</option>
                  <option value="Text">Text</option>
                  <option value="Email">Email</option>
                </select>

                <select
                  defaultValue={clientFile.timeToContact}
                  name='timeToContact'
                  className="  max-w-sm mx-2 rounded border-0 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                >
                  <option value="">Best Time To Contact</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Do Not Contact">Do Not Contact</option>
                </select>
              </div>

              <hr className="mt-6 border-b-1 text-white" />


            </div>
            <div className="flex mb-5 items-end mr-5 justify-end  ml-auto">
              <Toast.Provider swipeDirection="right">
                <button
                  onClick={() => {
                    setOpen(false);
                    window.clearTimeout(timerRef.current);
                    timerRef.current = window.setTimeout(() => {
                      setOpen(true);
                    }, 100);
                  }}
                  type="submit" name='intent' value='updateClientInfoFinance'
                  className="bg-[#2ebb98]  cursor-pointer  mt-3 ml-auto text-slate1 active:bg-[#1b6e59] font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                >
                  Update
                </button>
                <Toast.Root open={open} onOpenChange={setOpen} className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
                  <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                    {clientFile.firstName}'s File Updated.
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
  )
}
