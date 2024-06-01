/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, Outlet, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";

import { ScrollArea } from "@radix-ui/react-scroll-area";

import * as Toast from '@radix-ui/react-toast';
import { RemixNavLink, Input, Separator, Button, TextArea, Label, } from "~/components";

import { DropdownMenu as DownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu";

import { Badge } from "~/components/ui/badge";
import { ClientServiceFunction } from "../lists/clientServiceList";
import { Calendar } from "react-calendar";



export default function SalesButtonCard({
  user,
  finance,

  PickUpCalendar,
  formData,
  onChange,
  value,
  handleInputChange,
  generateHiddenInputs,
  generateHiddenInputsForState,
  timerRef,
  open,
  setOpen,
}) {
  const fetcher = useFetcher();

  let NewListForStatus = [
    {
      name: 'status', value: finance.status === 'Active' ? <Badge className="bg-green-600">Active</Badge> :
        finance.status === 'Invalid' ? <Badge className="bg-gray-600">Invalid</Badge> :
          finance.status === 'Duplicate' ? <Badge className="bg-gray-600">Duplicate</Badge> :
            finance.status === 'Lost' ? <Badge className="bg-red-600">Lost</Badge> :
              '',
      label: <DownMenu>
        <DropdownMenuTrigger asChild>
          <Button name='intent' value='2DaysFromNow'
            className="bg-[#02a9ff] items-left justify-start items-start cursor-pointer w-[140px] mx-1 text-[#fafafa] active:bg-black font-bold uppercase h-auto  text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
          >
            Service Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-white">
          <ScrollArea className="h-auto w-[200px] rounded-md  p-4">
            {ClientServiceFunction({ formData }).map((item) => (
              <DropdownMenuCheckboxItem
                key={item.name}
                name={item.name}
                className="bg-white capitalize  cursor-pointer"
                checked={item.value === "on"}
                onCheckedChange={(checked: boolean) => {
                  handleInputChange(item.name, checked);

                }}
              >
                {item.name}
              </DropdownMenuCheckboxItem>
            )
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DownMenu>,
    },


  ]

  return (
    <>
      <div className="px-2 border-1 border-black">
        <div className="flex flex-wrap justify-center">
          <h2 className='text-left'>Service</h2>

          <div className="w-full text-center">
            <fetcher.Form method="post"   >
              <Input type="hidden" defaultValue={user.name} name="author" />
              <Input type="hidden" defaultValue={finance.id} name="id" />
              <Input type="hidden" defaultValue="updateFinance" name="intent" />
              <div className=" py-1 lg:pt-1 pt-1 items-center">

                <div className=" flex items-center justify-between">
                  <label className="text-sm text-left" htmlFor='partsonorder'>Work Order #</label>
                  <p className="text-sm text-right"></p>
                </div>
                <hr className="mt-1 mb-1 border-b-1 border-gray-600" />
              </div>

              <div className="flex justify-end">
                <Input type="hidden" defaultValue={user.name} name="author" />
                <Input type="hidden" defaultValue={finance.id} name="id" />
                <Input type="hidden" defaultValue="updateFinance" name="intent" />



              </div>

            </fetcher.Form>
          </div>

        </div>
      </div>

    </>
  )
}
function setServicePickUpCalendar(arg0: string): void {
  throw new Error("Function not implemented.");
}

