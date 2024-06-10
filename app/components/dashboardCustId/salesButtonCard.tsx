import { RemixNavLink, Input, Separator, Button, TextArea, Label, PopoverTrigger, PopoverContent, Popover, } from "~/components";
import { Form, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { Calendar } from '~/components/ui/calendar';
import { Cross2Icon, CaretSortIcon, CalendarIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import { cn } from "~/components/ui/utils"
import React, { useState } from "react";
import { format } from "date-fns"
import * as Toast from '@radix-ui/react-toast';


export default function SalesButtonCard({
  finance,
  user,
  NewListForStatus,
  PickUpCalendar,
  formData,
  onChange,
  value,
  generateHiddenInputs,
  generateHiddenInputsForState,
  timerRef,
  open,
  setOpen,
  fetcher,
}) {
  const [date, setDate] = useState<Date>()

  return (
    <>
      <div className="px-2 border-1 border-black  h-[176px]">
        <h2>Sales</h2>
        <div className="flex flex-wrap justify-center">

          <div className="w-full text-center">
            <fetcher.Form method="post"   >
              <Input type="hidden" defaultValue={user.name} name="author" />
              <Input type="hidden" defaultValue={finance[0].id} name="id" />
              <Input type="hidden" defaultValue="updateFinance" name="intent" />
              <div className=" py-1 lg:pt-1 pt-1 items-center">

                {NewListForStatus.map((item) => (
                  <>
                    <div key={item.name} className=" flex items-center justify-between">
                      <label className="text-sm text-left" htmlFor={item.name}>{item.label}</label>
                      <p className="text-sm text-right">{item.value}</p>
                    </div>
                    <hr className="mt-1 mb-1 border-b-1 border-gray-600" />
                  </>
                ))}



                <Input type="hidden" defaultValue={finance[0].id} name="financeId" />
                <Input type="hidden" defaultValue={finance[0].id} name="id" />
                {generateHiddenInputs()}
                {generateHiddenInputsForState()}

              </div>

              <div className="flex justify-end">
                <Input type="hidden" defaultValue={user.name} name="author" />
                <Input type="hidden" defaultValue={finance[0].id} name="id" />
                <Input type="hidden" defaultValue="updateFinance" name="intent" />


                <Toast.Provider swipeDirection="right">
                  <button
                    onClick={() => {
                      setOpen(false);
                      window.clearTimeout(timerRef.current);
                      timerRef.current = window.setTimeout(() => {
                        setOpen(true);
                      }, 100);
                    }}
                    type="submit" name='intent' value='updateFinance'
                    className="bg-[#2ebb98] cursor-pointer mt-1 ml-auto mb-1 justify-end items-end text-foreground active:bg-[#1b6e59] font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  >
                    Update
                  </button>
                  <Toast.Root open={open} onOpenChange={setOpen} className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
                    <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-foreground text-[15px]">
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

    </>
  )
}
