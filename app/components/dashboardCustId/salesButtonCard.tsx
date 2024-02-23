import { RemixNavLink, Input, Separator, Button, TextArea, Label, } from "~/components";
import { Form, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import Calendar from "react-calendar";
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

                {PickUpCalendar === "yes" && (
                  <>
                    {formData.delivered === "on" && (
                      <p className="mt-1">Delivered On</p>
                    )}
                    {formData.delivered === "off" && (
                      <p className="mt-1">Prefered Pick Up Date</p>
                    )}

                    <div className="flex justify-center">
                      <Calendar
                        onChange={onChange}
                        name="pickUpDate"
                        defaultValue={value}
                        calendarType="gregory"
                      />
                    </div>

                    <input type="hidden" defaultValue={value} name="pickUpDate" />

                    <select
                      defaultValue={finance[0].pickUpTime}
                      name='pickUpTime'
                      placeholder="Preferred Time To P/U"
                      className="w-1/2 mx-auto rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                    >
                      <option value="9:00">9:00</option>
                      <option value="9:30">9:30</option>
                      <option value="10:00">10:00</option>
                      <option value="10:30">10:30</option>
                      <option value="11:00">11:00</option>
                      <option value="11:30">11:30</option>
                      <option value="12:00">12:00</option>
                      <option value="12:30">12:30</option>
                      <option value="1:00">1:00</option>
                      <option value="1:30">1:30</option>
                      <option value="2:00">2:00</option>
                      <option value="2:30">2:30</option>
                      <option value="3:00">3:00</option>
                      <option value="3:30">3:30</option>
                      <option value="4:00">4:00</option>
                      <option value="4:30">4:30</option>
                      <option value="5:00">5:00</option>
                      <option value="5:30">5:30</option>
                      <option value="6:00">6:00</option>
                    </select>
                  </>
                )}
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
                    className="bg-[#2ebb98] cursor-pointer mt-1 ml-auto mb-1 justify-end items-end text-slate1 active:bg-[#1b6e59] font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
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
          </div>

        </div>
      </div>

    </>
  )
}
