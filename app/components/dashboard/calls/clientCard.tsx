/* eslint-disable tailwindcss/classnames-order */
import { Input, Separator, Button, Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup, } from '~/components'
import Calendar from 'react-calendar';
import React, { useState, useEffect } from "react";
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigation } from '@remix-run/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "~/components/ui/accordion"
import { toast } from "sonner"
import { ClientDetailsFunction } from "~/components/lists/clientDetails";
import { ClientResultFunction, ClientStateFunction } from '~/components/lists/clientResultList';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "~/components/ui/sheet"
import MesasageContent from "./messageContent";
import { ButtonLoading } from "~/components/ui/button-loading";
import { testLeademail, testLeadPhone } from '~/routes/__authorized/dealer/api/activix';
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"

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
            { name: "dob", value: data.dob, placeHolder: "DOB - 1988-06-15" },
        ];
        return ClientDetails;
    }
    const [checkedItems, setCheckedItems] = useState({});


    const handleCheckboxChange = (name, isChecked) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [name]: isChecked ? (prevCheckedItems[name] ?? new Date().toISOString()) : false,
        }));
    };

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <p>{data.firstName} </p>
                </SheetTrigger>
                <SheetContent side='left' className='bg-background text-foreground w-full md:w-[50%] overflow-y-auto border  border-border ' >
                    <Form method="post" >
                        <SheetHeader>
                            <SheetTitle>
                                <div className='flex justify-between text-foreground'>
                                    Edit Client Profile

                                </div>
                            </SheetTitle>
                            <SheetDescription className='text-foreground'>
                                Make changes to the profile here. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid grid-cols-1  mt-3 w-[90%] ">
                            {/* Content for the first column */}
                            {ClientDetailsFunction({ data, finance })
                                .map((fee, index) =>
                                (
                                    <div key={index} className="  mt-3">
                                        <div className="relative mt-3">
                                            <Input
                                                name={fee.name}
                                                defaultValue={fee.value}
                                                className='mt-2 h-8 text-foreground bg-background border-border'
                                            />
                                            <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{fee.placeHolder}</label>
                                        </div>
                                    </div>
                                ))}
                            <div className="relative mt-5">
                                <Select name='timeToContact'                                                >
                                    <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                                        <SelectValue defaultValue={data.timeToContact} />
                                    </SelectTrigger>
                                    <SelectContent className=' bg-background text-foreground border border-border' >
                                        <SelectGroup>
                                            <SelectLabel>Best Time To Contact</SelectLabel>
                                            <SelectItem value="Morning">Morning</SelectItem>
                                            <SelectItem value="Afternoon">Afternoon</SelectItem>
                                            <SelectItem value="Evening">Evening</SelectItem>
                                            <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Prefered Time To Be Contacted</label>
                            </div>
                            <div className="relative mt-5">

                                <Select name='typeOfContact'                                                >
                                    <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                                        <SelectValue defaultValue={data.typeOfContact} />
                                    </SelectTrigger>
                                    <SelectContent className=' bg-background text-foreground border border-border' >
                                        <SelectGroup>
                                            <SelectLabel>Contact Method</SelectLabel>
                                            <SelectItem value="Phone">Phone</SelectItem>
                                            <SelectItem value="InPerson">In-Person</SelectItem>
                                            <SelectItem value="SMS">SMS</SelectItem>
                                            <SelectItem value="Email">Email</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Prefered Type To Be Contacted</label>
                            </div>



                            <Accordion type="single" collapsible>
                                <AccordionItem value="1" className='mt-5'>
                                    <AccordionTrigger className=' cursor-pointer'>
                                        Result
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {ClientResultFunction({ formData, finance, dashBoardCustURL })
                                            .map((item) => {
                                                const isChecked =
                                                    item.value === 'on' ||
                                                    new Date(item.value) > new Date('2022-01-01');
                                                return (
                                                    <div key={item.name} className='flex justify-between items-center ml-3 mt-3'>
                                                        <label htmlFor={item.name}>{item.label}</label>
                                                        <IndeterminateCheckbox
                                                            name={item.name}
                                                            indeterminate={checkedItems[item.name] === undefined && isChecked}
                                                            checked={checkedItems[item.name] ?? isChecked}
                                                            onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
                                                            className="border-[#c72323]"
                                                        />
                                                    </div>
                                                )
                                            })}

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
                                        className="mx-auto rounded border-0 ml-2 mr-2 bg-background border-border  px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary">
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
                            <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
                            <Input type="hidden" defaultValue={data.brand} name="brand" />
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='id' value={data.id} />
                            <input type='hidden' name='activixId' value={data.activixId} />
                            <input type='hidden' name='phoneId' value={data.phoneId} />
                            <input type='hidden' name='vehicleIdWanted' value={data.vehicleIdWanted} />
                            <input type='hidden' name='vehicleIdWTrade' value={data.vehicleIdWTrade} />
                            <input type='hidden' name='emailId' value={data.emailId} />
                        </div>
                        <ButtonLoading
                            size="sm"
                            value='updateFinanceTwo'
                            className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
                            name="intent" type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`Quote updated for ${data.firstName}`)}
                            loadingText="Updating client info..."
                        >
                            Update
                        </ButtonLoading>
                    </Form>

                    <div className='flex justify-between mt-3'>
                        <Form method='post' >
                            <input type='hidden' name='intent' value='financeTurnover' />
                            <input type='hidden' name='locked' value={lockedValue} />
                            <input type='hidden' name='financeManager' value={user.email} />
                            <input type='hidden' name='financeId' value={data.id} />
                            <ButtonLoading
                                size="sm"
                                className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
                                type="submit"
                                isSubmitting={isSubmitting}
                                onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                                loadingText="Reaching out to the finance dept..."
                            >
                                Finance Turnover
                            </ButtonLoading>
                        </Form>

                        <a href={`/dealer/customer/${data.clientfileId}/${data.id}`} target="_blank">
                            <ButtonLoading
                                size="sm"
                                type="submit"
                                className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
                                name="intent"
                                value="clientProfile"
                                isSubmitting={isSubmitting}
                                loadingText="Naivigating to Client File.."
                            >
                                Client File
                            </ButtonLoading>
                        </a>
                        {data.activixId && (
                            <a href={`https://crm.activix.ca/leads/${data.activixId}`} target="_blank">
                                <ButtonLoading
                                    size="sm"
                                    type="submit"
                                    className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
                                    name="intent"
                                    value="clientProfile"
                                    isSubmitting={isSubmitting}
                                    loadingText="Naivigating to Client File.."
                                >
                                    Activix File
                                </ButtonLoading>
                            </a>
                        )}


                        <fetcher.Form method="post"  >
                            <input type='hidden' name='financeId' value={data.id} />
                            <input type='hidden' name='brand' value={data.brand} />
                            <input type='hidden' name='id' value={data.id} />
                            {data.model && (<input type='hidden' name='customerState' value='Reached' />)}
                            {data.model && (

                                <ButtonLoading
                                    size="sm"
                                    name='intent'
                                    value='returnToQuote'
                                    type='submit'
                                    className="w-auto cursor-pointer ml-auto mt-3 hover:text-primary border-border"
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
                                <Button size='sm' name='intent' value='createQuote' type='submit' className="bg-primary cursor-pointer p-3 text-foreground active:bg-black font-bold uppercase   border border-border text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
                                    Create Quote
                                </Button>
                            )}
                        </fetcher.Form>
                    </div>

                </SheetContent>
            </Sheet >
        </>
    )
}

// onSubmit={handleSubmit} >
