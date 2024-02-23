/* eslint-disable tailwindcss/classnames-order */
import { Input, Button, Separator, } from '~/components/ui/index'
//import { Sheet, SheetContent, SheetTrigger, } from "~/other/sheet"
import Calendar from 'react-calendar';
import React, { useState } from "react";
import { Form, useLoaderData, useSubmit, Link, useFetcher } from '@remix-run/react'
import { DropdownMenu as DownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/other/dropdown-menu";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/other/select"
import { ScrollArea } from "~/other/scrollarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/other/accordion"
import { RemoveUser, WebWindowClose } from "iconoir-react";
import * as Toast from '@radix-ui/react-toast';
//import { ClientDetailsFunction } from "~/components/lists/clientDetails";
import { ClientResultFunction, ClientStateFunction } from '~/components/lists/clientResultList';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/other/sheet"
import MesasageContent from "./messageContent";


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function ClientCard({ data }) {
    const [value, onChange] = useState<Value>(data.pickUpDate);
    const { dashBoardCustURL } = useLoaderData()
    let finance
    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);
    const submit = useSubmit();
    const fetcher = useFetcher();

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);
    // const id = data.id ? data.id.toString() : '';

    const [formData, setFormData] = useState({
        referral: data.referral,
        visited: data.visited,
        bookedApt: data.bookedApt,
        aptShowed: data.aptShowed,
        aptNoShowed: data.aptNoShowed,
        testDrive: data.testDrive,
        metService: data.metService,
        metManager: data.metManager,
        metParts: data.metParts,
        sold: data.sold,
        depositMade: data.depositMade,
        refund: data.refund,
        turnOver: data.turnOver,
        financeApp: data.financeApp,
        approved: data.approved,
        signed: data.signed,
        pickUpSet: data.pickUpSet,
        demoed: data.demoed,
        seenTrade: data.seenTrade,
        delivered: data.delivered,
    })
    function ClientDetailsList() {
        let ClientDetails = [
            { name: "firstName", value: data.lead.first_name, placeHolder: "First Name" },
            { name: "lastName", value: data.lead.last_name, placeHolder: "Last Name" },
            { name: "phone", value: data.lead.phone, placeHolder: "Phone" },
            { name: "email", value: data.lead.email, placeHolder: "Email" },
            { name: "address", value: data.lead.address, placeHolder: "Address" },
            { name: "postal", value: data.lead.postal, placeHolder: "Postal Code" },
            { name: "city", value: data.lead.city, placeHolder: "City" },
            { name: "province", value: data.lead.province, placeHolder: "Province" },
            { name: "postal", value: data.lead.postal, placeHolder: "Postal Code" },
            { name: "dl", value: data.lead.dl, placeHolder: "Driver License" },
        ];
        return ClientDetails
    }


    function ClientStateFunction() {

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
            { name: 'depositMade', value: formData.depositMade, label: 'Deposit', },
            { name: 'refund', value: formData.refund, label: 'Refund', },
            { name: 'turnOver', value: formData.turnOver, label: 'Turn Over', },
            { name: 'financeApp', value: formData.financeApp, label: 'Finance Application', },
            { name: 'approved', value: formData.approved, label: 'approved', },
            { name: 'signed', value: formData.signed, label: 'Signed Docs', },
            { name: 'pickUpSet', value: formData.pickUpSet, label: 'Pick Up Date Set', },
            { name: 'demoed', value: formData.demoed, label: 'Demoed' },
            { name: 'delivered', value: formData.delivered, label: 'Delivered', },
        ];

        return clientResultList
    }


    const handleInputChange = (name, checked) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked ? 'on' : 'off',
        }));
    };
    const generateHiddenInputs = () => {
        return ClientResultFunction({ formData }).map((item) => (
            <input
                key={item.name}
                type="hidden"
                defaultValue={item.value === 'on' ? 'on' : 'off'}
                name={item.name}
            />
        ));
    };

    const generateHiddenInputsForState = () => {
        return ClientStateFunction().map((item) => {
            // Check if the value of the first input is 'on'
            const isFirstInputOn = ClientResultFunction({ formData }).find((result) => result.name === item.name)?.value === 'on';

            return (
                <>
                    {isFirstInputOn && (
                        <input
                            key={`${item.name}-second`}
                            type="hidden"
                            defaultValue={item.value}
                            name="customerState"
                        />
                    )}
                </>
            );
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        // ... your existing code to prepare formData ...
        const formData = new FormData(event.currentTarget);
        console.log(formData, 'formData')
        const response = await fetch('/dashboard/calls', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const id = data.id;
            const redirectTo = `/customer/${data.id}`;
            window.open(redirectTo, '_blank');
        } else {
            // Handle error
            console.error('Failed to submit form');
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    console.log(formData, 'formData')
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <p>{data.firstName} </p>
                </SheetTrigger>
                <SheetContent side='left' className='bg-[#1c2024] text-[#c7c7cb] w-full md:w-[50%] mt-3 ml-3 mr-3 overflow-y-auto border  border-slate1 shadow-[0_2px_10px] ' >
                    <Form method="post" >
                        <SheetHeader>
                            <SheetTitle>
                                <div className='flex justify-between text-[#c7c7cb]'>
                                    Edit Client Profile
                                    <Toast.Provider swipeDirection="right">
                                        <button
                                            onClick={() => {
                                                setOpen(false);
                                                window.clearTimeout(timerRef.current);
                                                timerRef.current = window.setTimeout(() => {
                                                    setOpen(true);
                                                }, 100);
                                            }}
                                            name="intent" type="submit" className='ml-auto text-[#c7c7cb] rounded border  border-slate1 cursor-pointer hover:text-[#02a9ff] hover:text-[#02a9ff]' value='updateFinance'>
                                            Update
                                        </button>
                                        <Toast.Root open={open} onOpenChange={setOpen} className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
                                            <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                                                {data.firstName}'s Quote Updated.
                                            </Toast.Title>
                                            <Toast.Description asChild>
                                            </Toast.Description>
                                        </Toast.Root>
                                        <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
                                    </Toast.Provider>

                                </div>
                            </SheetTitle>
                            <SheetDescription className='text-[#c7c7cb]'>
                                Make changes to the profile here. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid grid-cols-1  mt-3 w-[90%] ">
                            {/* Content for the first column */}
                            {ClientDetailsList({ data, finance })
                                .map((fee, index) => (
                                    <div key={index}>
                                        <Input
                                            name={fee.name}
                                            defaultValue={fee.value}
                                            placeholder={fee.placeHolder}
                                            className='mt-2 h-8'
                                        />
                                    </div>
                                ))}

                            <p className="mt-4">Prefered Contact</p>
                            <Separator className='w-[90%] mb-3' />
                            <select defaultValue={data.typeOfContact}
                                name='typeOfContact'
                                placeholder='Best Form To Contact '
                                className="w-2/3 mb-2 rounded cursor-pointer border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                                <option value="na">Best Form To Contact </option>
                                <option value="Phone">Phone</option>
                                <option value="Text">Text</option>
                                <option value="Email">Email</option>
                            </select>
                            <select defaultValue={data.timeToContact}
                                name='timeToContact'
                                placeholder='Best Time To Contact'
                                className="mx-automt-3 w-2/3  cursor-pointer rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                                <option value="na">Best Time To Contact</option>
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                                <option value="Do Not Contact">Do Not Contact</option>
                            </select>

                            <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
                            <Input type="hidden" defaultValue={data.brand} name="brand" />
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='email' value={data.email} />

                            <Accordion type="single" collapsible>
                                <AccordionItem value="1" className='mt-5'>
                                    <AccordionTrigger className=' cursor-pointer'>
                                        Result
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {ClientStateFunction({ formData, finance, dashBoardCustURL })
                                            .map((item) => (
                                                <div key={item.name} className='flex justify-between items-center ml-3'>
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

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {formData.depositMade === "on" && (
                                <>
                                    {formData.delivered === 'on' && (<p className="mt-4">Delivered On</p>)}
                                    {formData.delivered === 'off' && (<p className="mt-4">Prefered Pick Up Date</p>)}

                                    <Separator className='w-[90%] mb-3' />
                                    <div>
                                        <Calendar onChange={onChange} name="pickUpDate" value={value} calendarType="gregory" />
                                    </div>
                                    <input type="hidden" value={value} name="pickUpDate" />

                                    <select defaultValue={data.pickUpTime}
                                        name='pickUpTime'
                                        placeholder='Time of day'
                                        className="mx-auto rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                                        <option>Time of day</option>
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
                                    {generateHiddenInputs()}
                                    {generateHiddenInputsForState()}


                                </>
                            )}
                            {/* Button Group */}
                        </div>

                    </Form>
                    <div className='flex justify-between mt-3'>
                        <fetcher.Form method="post">
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='userEmail' value={data.userEmail} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='clientfileId' value={data.clientfileId} />

                            <Button name='intent' value='clientProfile' type='submit' className="bg-[#02a9ff] cursor-pointer w-[75px]  text-slate1 active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
                                Client File
                            </Button>
                        </fetcher.Form>
                        <fetcher.Form method="post"  >
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='id' value={data.id} />
                            {data.model && (<input type='hidden' name='customerState' value='Reached' />)}
                            {data.model && (

                                <Button name='intent' value='returnToQuote' type='submit' className="bg-[#02a9ff] cursor-pointer w-[75px]  text-slate1 active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
                                    Quote
                                </Button>

                            )}
                        </fetcher.Form>
                        <fetcher.Form method="post"  >
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='id' value={data.id} />
                            <input type='hidden' name='clientId' value={data.id} />
                            {!data.model && (
                                <Button name='intent' value='createQuote' type='submit' className="bg-[#02a9ff] cursor-pointer w-[80px] text-slate1 active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
                                    Create Quote
                                </Button>
                            )}
                        </fetcher.Form>
                    </div>

                </SheetContent>
            </Sheet>
        </>
    )
}

// onSubmit={handleSubmit} >
