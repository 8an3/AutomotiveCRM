import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import * as Toast from '@radix-ui/react-toast';
import React, { useState } from "react";
import { useRootLoaderData } from "~/hooks";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { toast } from "sonner"


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

    //  function handleDropdownChange(event) {
    //     const followUpDay1 = Number(event.target.value);
    //     setButtonText('F/U ' + followUpDay1 + ' days')
    //     setAppointmentDate(getFutureDate(followUpDay1));
    //   }
    /**           <select defaultValue={fUpDays} name='followUpDay1' className="mx-auto  rounded border-1  mz-1 px-2 border border-slate1 bg-[#09090b] h-9 text-bold uppercase text-[#fafafa] placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                        onChange={handleDropdownChange}>
                        <option value="">Days</option>
                        <option value="1">1 Day</option>
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="4">4 Days</option>
                        <option value="5">5 Days</option>
                        <option value="6">6 Days</option>
                        <option value="7">7 Days</option>
                    </select> */
    function handleDropdownChange(value) {
        const followUpDay1 = Number(value);
        setButtonText('F/U ' + followUpDay1 + ' days')
        setAppointmentDate(getFutureDate(followUpDay1));
    }

    function getFutureDate(followUpDay1: number): Date {
        const date = new Date(); // get the current date
        date.setDate(date.getDate() + followUpDay1); // add the number of days to the current date
        return date;
    }
    const [buttonText, setButtonText] = useState('F/U ' + fUpDays + ' days');

    return (
        <div className="justify-center  items-center mx-auto my-auto ">
            <Form method='post'>
                <div className="flex justify-between">
                    <Select name='followUpDay1' onValueChange={handleDropdownChange}>
                        <SelectTrigger className="w-auto border-[#27272a] text-[#fafafa] bg-[#09090b] font-bold uppercase">
                            <SelectValue placeholder="Days" />
                        </SelectTrigger>
                        <SelectContent className='border-[#27272a] text-[#fafafa] bg-[#09090b]'>
                            <SelectItem value="1">1 Day</SelectItem>
                            <SelectItem value="2">2 Days</SelectItem>
                            <SelectItem value="3">3 Days</SelectItem>
                            <SelectItem value="4">4 Days</SelectItem>
                            <SelectItem value="5">5 Days</SelectItem>
                            <SelectItem value="6">6 Days</SelectItem>
                            <SelectItem value="7">7 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <input type='hidden' value='2DaysFromNow' name='intent' />
                    <input type="hidden" defaultValue={data.userEmail} name="userEmail" />
                    <input type="hidden" defaultValue={data.brand} name="brand" />
                    <input type='hidden' name='financeId' value={data.id} />
                    <input type='hidden' name='email' value={data.email} />
                    <input type="hidden" defaultValue='no' name="completed" />
                    <input type="hidden" defaultValue='Outgoing' name="direction" />
                    <input type="hidden" defaultValue='Sales' name="apptType" />
                    <input type="hidden" defaultValue='Attempted' name="resultOfcall" />
                    <input type="hidden" defaultValue={data.model} name="unit" />
                    <input type="hidden" defaultValue={data.id} name="id" />
                    <input type="hidden" defaultValue={data.customerState} name="customerState" />
                    <input type="hidden" defaultValue={1} name="resourceId" />
                    <input type='hidden' name='activixId' value={data.activixId} />

                    <input type="hidden" defaultValue={data.firstName} name="firstName" />
                    <input type="hidden" defaultValue={data.lastName} name="lastName" />
                    <input type="hidden" defaultValue={data.email} name="email" />
                    <input type="hidden" defaultValue={data.phone} name="phone" />
                    <input type="hidden" defaultValue={data.address} name="address" />
                    <input type="hidden" defaultValue={data.id} name="financeId" />

                    <input type="hidden" defaultValue={data.apptStatus} name="apptStatus" />
                    <input type="hidden" defaultValue='Other' name="contactMethod" />
                    <input type="hidden" name="title" defaultValue={`F/U on the ${data.model}`} />
                    <input type="hidden" defaultValue={data.vin} name="vin" />
                    <input type="hidden" defaultValue={data.stockNum} name="stockNum" />

                    <Button
                        disabled={followUpDay1.getTime() < Date.now()}
                        onClick={() => {
                            toast.success(`Quote updated for ${data.firstName}`)

                            // Set the button state to pressed
                            setIsButtonPressed(true);

                            // Change the button text
                            setButtonText('Follow-up set');
                        }}
                        type='submit'
                        className={`p-3 cursor-pointer ml-2 mr-2 text-[#fafafa] font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                    >
                        {buttonText}
                    </Button>

                </div>
            </Form >
        </div >
    )
}
