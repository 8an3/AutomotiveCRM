import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "~/components/ui/dialog"
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label } from '~/components/ui/index'
import { ClipboardCheck, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose } from "iconoir-react";
import DateTimePicker from 'react-datetime-picker'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/other/select"
import { ScrollArea } from "~/other/scrollarea"
import React, { useState } from "react";
import { Form, useLoaderData, useSubmit } from '@remix-run/react'
import * as Toast from '@radix-ui/react-toast';
import MesasageContent from "./messageContent";
import DateTimeComponent from "./DateTime";
import Calendar from 'react-calendar';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CompleteCall = ({ data, contactMethod }) => {
    const [value, onChange] = useState<Value>(new Date());
    const [open, setOpen] = React.useState(false);
    const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

    const timerRef = React.useRef(0);
    const [date, setDate] = React.useState<Date>()
    const handleDateSelect = (selectedDate) => { setDate(selectedDate) };
    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);
    const id = data.id ? data.id.toString() : '';
    const [isButtonPressed, setIsButtonPressed] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='mx-auto'>
                    <ClipboardCheck className='mx-auto  text-[#EEEEEE] items-center justify-center hover:text-[#02a9ff] target:text-[#02a9ff]' />
                </div>
            </DialogTrigger>
            <DialogContent className="w-full md:w-[50%] bg-white border border-black">
                <DialogHeader>
                    <DialogTitle>  <p className="mt-4">Schedule Follow-up</p>
                    </DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form method="post" >
                    <div className='flex '>

                        <div className='mx-auto'>

                            <Select name='resultOfcall' >
                                <SelectTrigger className="w-[180px] mt-5" >
                                    <SelectValue placeholder="Result of call" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Reached">Reached</SelectItem>
                                    <SelectItem value="Attempted">N/A</SelectItem>
                                    <SelectItem value="Attempted">Left Message</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="grid gap-2 mx-auto">
                                <Label className='mt-2' htmlFor="area">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    defaultValue={`F/U on the ${data.model}`}
                                    className="w-[80%] rounded border-1 border-[#60b9fd] h-8 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                                />
                            </div>

                            <div className="grid gap-2 mx-auto">
                                <Label className='mt-2' htmlFor="area">Note</Label>
                                <MesasageContent />
                                <Input
                                    name="note"
                                    className="w-[80%] rounded border-1 border-[#60b9fd] h-8 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                                />
                            </div>
                            <div className="grid gap-2 mx-auto">
                                <Label className='mt-2' htmlFor="area">Contact Method</Label>

                                <select
                                    name='contactMethod'
                                    className='w-[80%] text-xs h-8 cursor-pointer rounded border-1 border-[#60b9fd] bg-white text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
                                    <option value="">Contact Method</option>
                                    <option value="Phone">Phone</option>
                                    <option value="InPerson">In-Person</option>
                                    <option value="SMS">SMS</option>
                                    <option value="Email">Email</option>
                                </select>
                            </div>
                            <Calendar onChange={onChange} value={value} calendarType="gregory" />

                            <select
                                name="timeOfDayModal"
                                className={`mx-auto w-[80%] text-xs mt-3 h-10 cursor-pointer rounded border-1 border-[#60b9fd] bg-white text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] `}>
                                <option value="Time of day">Time of day</option>
                                <option value="09:00">9:00</option>
                                <option value="09:30">9:30</option>
                                <option value="10:00">10:00</option>
                                <option value="10:30">10:30</option>
                                <option value="11:00">11:00</option>
                                <option value="11:30">11:30</option>
                                <option value="12:00">12:00</option>
                                <option value="12:30">12:30</option>
                                <option value="01:00">1:00</option>
                                <option value="01:30">1:30</option>
                                <option value="02:00">2:00</option>
                                <option value="02:30">2:30</option>
                                <option value="03:00">3:00</option>
                                <option value="03:30">3:30</option>
                                <option value="04:00">4:00</option>
                                <option value="04:30">4:30</option>
                                <option value="05:00">5:00</option>
                                <option value="05:30">5:30</option>
                                <option value="06:00">6:00</option>
                            </select>
                        </div>

                    </div>
                    <Input type='hidden' value={value} name='dateModal' />

                    <Input type='hidden' value={value} name='followUpDay' />
                    <input type='hidden' value={data.firstName} name='firstName' />
                    <input type='hidden' value={data.lastName} name='lastName' />
                    <input type='hidden' value={data.phone} name='phone' />

                    <input type='hidden' value={data.email} name='email' />
                    <input type='hidden' value='scheduleFUp' name='intent' />
                    <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
                    <Input type="hidden" defaultValue={data.id} name="financeId" />
                    <Input type="hidden" defaultValue={id} name="id" />
                    <Input type="hidden" defaultValue={data.brand} name="brand" />
                    <Input type="hidden" defaultValue='future' name="apptStatus" />
                    <Input type="hidden" defaultValue={data.model} name="unit" />
                    <Input type="hidden" defaultValue='no' name="completed" />
                    <Input type="hidden" defaultValue='Sales' name="apptType" />



                    <div className="mt-[25px] flex justify-end">
                        <DialogClose >
                            <Button
                                onClick={() => {
                                    setIsButtonPressed(true);
                                }}
                                name='intent' value='scheduleFUp' type='submit'
                                className={`w-[75px] cursor-pointer ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                            >
                                Complete
                            </Button>
                        </DialogClose>
                    </div>

                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default CompleteCall
