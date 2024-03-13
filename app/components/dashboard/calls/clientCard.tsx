/* eslint-disable tailwindcss/classnames-order */
import { Input, Separator, Button } from '~/components/ui/index'
import Calendar from 'react-calendar';
import React, { useState, useEffect } from "react";
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigation } from '@remix-run/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/other/accordion"
import { toast } from "sonner"
import { ClientDetailsFunction } from "~/components/lists/clientDetails";
import { ClientResultFunction, ClientStateFunction } from '~/components/lists/clientResultList';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "~/other/sheet"
import MesasageContent from "./messageContent";
import { ButtonLoading } from "~/components/ui/button-loading";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function ClientCard({ data }) {
    const [value, onChange] = useState<Value>(data.pickUpDate);
    const { dashBoardCustURL, user } = useLoaderData()
    let finance
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);
    const submit = useSubmit();
    const fetcher = useFetcher();

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);
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
        const formData = new FormData(event.currentTarget);
        const response = await fetch('/dashboard/calls', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const id = data.id;
            const redirectTo = `/customer/${data.id}`;
            window.open(redirectTo, '_blank');
        } else {
            console.error('Failed to submit form');
        }
    };
    const [isOpen, setIsOpen] = useState(false);

    if (!data) {
        return null;
    }
    const lockedValue = Boolean(true)
    function ClientDetailsFunction() {
        let ClientDetails = [
            { name: "firstName", value: data.firstName, placeHolder: "First Name" },
            { name: "lastName", value: data.lastName, placeHolder: "Last Name" },
            { name: "phone", value: data.phone, placeHolder: "Phone" },
            { name: "email", value: data.email, placeHolder: "Email" },
            { name: "address", value: data.address, placeHolder: "Address" },
            { name: "city", value: data.city, placeHolder: "City" },
            { name: "province", value: data.province, placeHolder: "Province" },
            { name: "postal", value: data.postal, placeHolder: "Postal Code" },
            { name: "dl", value: data.dl, placeHolder: "Driver License" },
        ];
        return ClientDetails;
    }

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <p>{data.firstName} </p>
                </SheetTrigger>
                <SheetContent side='left' className='bg-[#1c2024] text-white w-full md:w-[50%] overflow-y-auto border  border-slate1 shadow-[0_2px_10px] ' >
                    <Form method="post" >
                        <SheetHeader>
                            <SheetTitle>
                                <div className='flex justify-between text-[#c7c7cb]'>
                                    Edit Client Profile

                                </div>
                            </SheetTitle>
                            <SheetDescription className='text-[#c7c7cb]'>
                                Make changes to the profile here. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid grid-cols-1  mt-3 w-[90%] ">
                            {/* Content for the first column */}
                            {ClientDetailsFunction({ data, finance })
                                .map((fee, index) => (
                                    <div key={index}>
                                        <Input
                                            name={fee.name}
                                            defaultValue={fee.value}
                                            placeholder={fee.placeHolder}
                                            className='mt-2 h-8 text-slate1 bg-slate11'
                                        />
                                    </div>
                                ))}

                            <p className="mt-4">Prefered Contact</p>
                            <Separator className='w-[90%] mb-3' />
                            <select defaultValue={data.typeOfContact}
                                name='typeOfContact'
                                placeholder='Best Form To Contact '
                                className="w-2/3 mb-2 rounded text-black cursor-pointer border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm  placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                                <option value="na">Best Form To Contact </option>
                                <option value="Phone">Phone</option>
                                <option value="Text">Text</option>
                                <option value="Email">Email</option>
                            </select>
                            <select defaultValue={data.timeToContact}
                                name='timeToContact'
                                placeholder='Best Time To Contact'
                                className="mx-automt-3 w-2/3 text-black cursor-pointer rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
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
                            <input type='hidden' name='activixId' value={data.activixId} />

                            <Accordion type="single" collapsible>
                                <AccordionItem value="1" className='mt-5'>
                                    <AccordionTrigger className=' cursor-pointer'>
                                        Result
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {ClientResultFunction({ formData, finance, dashBoardCustURL })
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
                        <ButtonLoading
                            size="lg"
                            value='updateFinance'
                            className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff]"
                            name="intent" type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`Quote updated for ${data.firstName}`)}
                            loadingText="Updating client info..."
                        >
                            Update
                        </ButtonLoading>
                    </Form>
                    <Form method='post' >
                        <input type='hidden' name='intent' value='financeTurnover' />
                        <input type='hidden' name='locked' value={lockedValue} />
                        <input type='hidden' name='financeManager' value={user.email} />
                        <input type='hidden' name='financeId' value={data.id} />
                        <ButtonLoading
                            size="lg"
                            className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff]"
                            type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                            loadingText="Reaching out to the finance dept..."
                        >
                            Finance Turnover
                        </ButtonLoading>
                    </Form>
                    <div className=' mt-3'>
                        <fetcher.Form method="post">
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='userEmail' value={data.userEmail} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='clientfileId' value={data.clientfileId} />
                            <ButtonLoading
                                size="lg"
                                type="submit"
                                className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff]"
                                name="intent"
                                value="clientProfile"
                                isSubmitting={isSubmitting}
                                loadingText="Naivigating to Client File.."
                            >
                                Client File
                            </ButtonLoading>
                        </fetcher.Form>
                        <fetcher.Form method="post"  >
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='id' value={data.id} />
                            {data.model && (<input type='hidden' name='customerState' value='Reached' />)}
                            {data.model && (

                                <ButtonLoading
                                    size="lg"
                                    name='intent'
                                    value='returnToQuote'
                                    type='submit'
                                    className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff]"
                                >
                                    Quote
                                </ButtonLoading>

                            )}
                        </fetcher.Form>
                        <fetcher.Form method="post"  >
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='id' value={data.id} />
                            <input type='hidden' name='clientId' value={data.id} />
                            {!data.model && (
                                <Button name='intent' value='createQuote' type='submit' className="bg-[#02a9ff] cursor-pointer p-3 text-slate1 active:bg-black font-bold uppercase   border border-slate1 text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
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
