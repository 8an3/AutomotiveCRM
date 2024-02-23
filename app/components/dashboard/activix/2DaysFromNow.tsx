import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import * as Toast from '@radix-ui/react-toast';
import React, { useState } from "react";
import { useRootLoaderData } from "~/hooks";

export default function TwoDaysFromNow({ data }) {
    const [isButtonPressed, setIsButtonPressed] = React.useState(false);
    const { user } = useRootLoaderData()
    const id = data.id ? data.id.toString() : '';
    const [open, setOpen] = React.useState(false);
    let followUpDay;
    if (data.followUpDay < 1) followUpDay = 1;
    const [fUpDays, setFUpDays] = React.useState(followUpDay);
    const timerRef = React.useRef(0);

    const [followUpDay1, setAppointmentDate] = useState(new Date());

    function handleDropdownChange(event) {
        const followUpDay1 = Number(event.target.value);
        setAppointmentDate(getFutureDate(followUpDay1));
    }

    function getFutureDate(followUpDay1: number): Date {
        const date = new Date(); // get the current date
        date.setDate(date.getDate() + followUpDay1); // add the number of days to the current date
        return date;
    }

    return (
        <div className="mx-auto justify-center flex">
            <Form method='post'>
                <div className="flex justify-center items-center">

                    <>
                        <select defaultValue={fUpDays} name='followUpDay1' className="mx-auto  rounded border-1  mz-1 px-2 border border-slate1 bg-slate12 h-9 text-bold uppercase text-slate1 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                            onChange={handleDropdownChange}>
                            <option value="1">1 Day</option>
                            <option value="2">2 Days</option>
                            <option value="3">3 Days</option>
                            <option value="4">4 Days</option>
                            <option value="5">5 Days</option>
                            <option value="6">6 Days</option>
                            <option value="7">7 Days</option>
                        </select>
                        <input type='hidden' value='2DaysFromNow' name='intent' />
                        <input type="hidden" defaultValue={data.userEmail} name="userEmail" />
                        <input type="hidden" defaultValue={data.brand} name="brand" />
                        <input type='hidden' name='financeId' value={data.id} />
                        <input type='hidden' name='email' value={data.email} />
                        <input type="hidden" defaultValue='No' name="completed" />
                        <input type="hidden" defaultValue='Outgoing' name="direction" />
                        <input type="hidden" defaultValue='Sales' name="apptType" />
                        <input type="hidden" defaultValue='Attempted' name="resultOfcall" />
                        <input type="hidden" defaultValue={data.model} name="unit" />
                        <input type="hidden" defaultValue={data.id} name="id" />
                        <input type="hidden" defaultValue={data.customerState} name="customerState" />

                        <input type="hidden" defaultValue={data.firstName} name="firstName" />
                        <input type="hidden" defaultValue={data.lastName} name="lastName" />
                        <input type="hidden" defaultValue={data.email} name="email" />
                        <input type="hidden" defaultValue={data.phone} name="phone" />
                        <input type="hidden" defaultValue={data.address} name="address" />
                        <input type="hidden" defaultValue={data.id} name="financeId" />

                        <input type="hidden" defaultValue={data.apptStatus} name="apptStatus" />
                        <input type="hidden" defaultValue='Other' name="contactMethod" />
                        <input type="hidden" name="title" defaultValue={`F/U on the ${data.model}`} />

                        <Toast.Provider swipeDirection="right">
                            <Button
                                onClick={() => {
                                    setOpen(false);
                                    window.clearTimeout(timerRef.current);
                                    timerRef.current = window.setTimeout(() => {
                                        setOpen(true);
                                    }, 100);

                                    // Set the button state to pressed
                                    setIsButtonPressed(true);
                                }}
                                name='intent' value='2DaysFromNow' type='submit'
                                className={`w-[75px] cursor-pointer ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                            >
                                F/U {fUpDays} days
                            </Button>
                            <Toast.Root open={open} onOpenChange={setOpen} className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
                                <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                                    Follow-up set for {data?.firstName}.
                                </Toast.Title>
                                <Toast.Description asChild>
                                </Toast.Description>
                            </Toast.Root>
                            <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
                        </Toast.Provider>
                    </>

                </div>
            </Form>
        </div>
    )
}
//   <input type="hidden" defaultValue={data.brand} name="brand" />
