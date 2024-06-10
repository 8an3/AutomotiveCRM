import { Form, useActionData, useLoaderData, useParams, useNavigation } from '@remix-run/react'
import { Input, Label, Button, Separator } from '~/components/ui/index'
import { ActionArgs, type DataFunctionArgs, json, type MetaFunction, type LoaderFunction, redirect } from '@remix-run/node'
import { ButtonLoading, } from "~/components";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { ImageSelect } from '~/overviewUtils/imageselectInverted'
import { quoteAction, quoteLoader } from '~/components/actions/quote$brandIdAL'
import React, { useRef, useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { findQuoteById } from '~/utils/finance/get.server';
import { model } from '~/models';
import { getSession } from '~/sessions/auth-session.server';
import Sidebar from "~/components/shared/sidebar";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { useRootLoaderData } from '~/hooks/use-root-loader-data';
import { TextInput, FormControl, Octicon } from '@primer/react'
import { CheckCircleFillIcon, AlertFillIcon } from '@primer/octicons-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
export const loader: LoaderFunction = async ({ request, params }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")
    let user = await GetUser(email);
    if (!user) { redirect('/login') }
    const brandId = params.brandId
    let modelList;
    switch (brandId) {
        case 'Harley-DavidsonMY24':
            modelList = await prisma.harley24.findMany()
            break;
        case 'Ski-Doo-MY24':
            modelList = await prisma.my24canam.findMany()
            break;
        case 'Can-Am-SXS-MY24':
            modelList = await prisma.my24canam.findMany()
            break;
        case 'Kawasaki':
            modelList = await prisma.kawasaki.findMany()
            break;
        case 'Manitou':
            modelList = await prisma.manitou.findMany()
            break;
        case 'Sea-Doo':
            modelList = await prisma.seadoo.findMany()
            break;
        case 'Switch':
            modelList = await prisma.switch.findMany()
            break;
        case 'Can-Am':
            modelList = await prisma.canam.findMany()
            break;
        case 'Can-Am-SXS':
            modelList = await prisma.canamsxs.findMany()
            break;
        case 'KTM':
            modelList = await prisma.harley24.findMany()
            break;
        case 'Ski-Doo':
            modelList = await prisma.skidoo.findMany()
            break;
        case 'Suzuki':
            modelList = await prisma.suzuki.findMany()
            break;
        case 'Triumph':
            modelList = await prisma.triumph.findMany()
            break;
        case 'BMW-Motorrad':
            modelList = await prisma.bmwmoto.findMany()
            break;
        case 'Indian':
            modelList = await prisma.harley24.findMany()
            break;
        case 'Yamaha':
            modelList = await prisma.harley24.findMany()
            break;
        case 'Spyder':
            modelList = await prisma.spyder.findMany()
            break;
        case 'Harley-Davidson':
            modelList = await prisma.harley.findMany()
            break;
        default:
            null
    }

    const userId = user?.id

    const urlSegments = new URL(request.url).pathname.split('/');
    const financeId = urlSegments[urlSegments.length - 1];
    let sliderWidth = session.get("sliderWidth");
    if (!sliderWidth) {
        sliderWidth = 500;
    }

    if (financeId.length > 32) {
        const finance = await findQuoteById(financeId);
        return json({ finance, sliderWidth, financeId, userId, modelList, user, email })
    }

    else {
        return json({ email, sliderWidth, userId, modelList, user, })
    }
}

export let action = quoteAction

export default function Quote() {
    let { brandId } = useParams()
    const { userId, modelList, user, sliderWidth } = useLoaderData()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    useEffect(() => {
        const userEmail = window.sessionStorage.getItem("email");
        const userName = window.sessionStorage.getItem("name");
        setName(decodeURIComponent(userName) || '')
        setEmail(decodeURIComponent(userEmail) || '')
    }, []);
    console.log(email, name, 'from auth in quote')
    const errors = useActionData() as Record<string, string | null>;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    function BusyIndicator() {
        React.useEffect(() => {
            if (isSubmitting) {
                toast.success('Quote has been created')
            }
        }, [isSubmitting]);
    }
    const [outletSize, setOutletSize] = useState(sliderWidth);
    console.log(sliderWidth, outletSize, "sliderWidth in function");
    const handleSliderChange = (event) => {
        const newSize = `${event.target.value}%`;
        setOutletSize(newSize);
    };
    console.log(sliderWidth);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        model: '',
        year: '',
    });

    const [validity, setValidity] = useState({
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phone: undefined,
        model: undefined,
        year: undefined,
    });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ca|com)$/;

    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
            case 'model':
                return value.trim().length > 3;
            case 'email':
                return emailRegex.test(value.trim());
            case 'phone':
                return value.replace(/\D/g, '').length === 10;
            case 'year':
                return value.length === 4;
            default:
                return true; // Default to true for unknown fields
        }
    };

    const handleChange = (fieldName, value) => {
        console.log(fieldName, value)
        const isValid = validateField(fieldName, value);
        setValidity((prevValidity) => ({
            ...prevValidity,
            [fieldName]: isValid,
        }));

        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const [modelError, SetModelError] = useState(false)

    const handleHoverSubmit = () => {
        if (String(formData.model).length < 3) (
            SetModelError(true)
        )
    }
    useEffect(() => {
        console.log(modelError, validity.model, formData.model, 'modelError and validty')
    }, [modelError, validity.model]);

    console.log(brandId, modelList)

    return (
        <>
            <div className="mx-auto my-auto text-foreground mt-[50px] bg-background flex justify-center">
                <Card className="w-[95%] lg:w-[450px] border-border text-foreground bg-background rounded-md">
                    <Form method='post' className="">
                        <CardHeader>
                            <CardTitle>
                                <ImageSelect />
                            </CardTitle>
                            <CardDescription>

                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4'>
                                <div className="grid grid-cols-1 items-center gap-4 w-[98%]">
                                    <input type='hidden' name='userEmail' value={user.email} />
                                    <div className="relative  ">
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            className={`col-span-3 bg-background border-border
                                                ${validity.firstName === true ? 'border-[#42ff31]   text-foreground' : ' '}
                                                ${validity.firstName === false ? 'border-red11   text-foreground' : ''}
                                                `}
                                            onChange={(e) => handleChange('firstName', e.target.value)}
                                        />
                                        <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">First Name</label>
                                        {String(validity.firstName).length > 3 && validity.firstName === false && (
                                            <div className="text-[#ff0202] flex items-center">
                                                <AlertFillIcon size={12} />
                                                <p className="mr-3">
                                                    First name is required.
                                                </p>
                                            </div>
                                        )}
                                        {errors?.firstName ? (
                                            <p className="text-[#ff0202] flex items-center">{errors.firstName}</p>
                                        ) : null}
                                    </div>
                                    <div className="relative mt-1">
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleChange('lastName', e.target.value)}
                                            className={`col-span-3 bg-background border-border
                                                ${validity.lastName === true ? 'border-[#42ff31]   text-foreground' : ''}
                                                ${validity.lastName === false ? 'border-red11   text-foreground' : ''}
                                                `}
                                        />
                                        <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Last Name</label>
                                        {String(validity.lastName).length > 3 && validity.lastName == false && (
                                            <div className="text-[#ff0202] flex items-center">
                                                <AlertFillIcon size={12} />
                                                <p className="mr-3">
                                                    Last name is required.
                                                </p>
                                            </div>
                                        )}
                                        {errors?.lastName ? (
                                            <p className="text-[#ff0202] flex items-center">{errors.lastName}</p>
                                        ) : null}
                                    </div>
                                    <div className="relative mt-1">
                                        <Input
                                            name="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className={`col-span-3 bg-background border-border
                                        ${validity.email === true ? 'border-[#42ff31]   text-foreground' : ' '}
                                        ${validity.email === false ? 'border-red11   text-foreground' : ''}
                                        `}
                                        />
                                        <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Email</label>
                                        {String(validity.email).length > 3 && validity.email === false && (
                                            <div className="text-[#ff0202] flex items-center">
                                                <AlertFillIcon size={12} />
                                                <p className="mr-3">
                                                    Email is not valid...
                                                </p>
                                            </div>
                                        )}
                                        {errors?.email ? (
                                            <p className="text-[#ff0202] flex items-center">{errors.email}</p>
                                        ) : null}
                                    </div>
                                    <div className="relative mt-1">
                                        <Input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className={`col-span-3 bg-background border-border
                                            ${validity.phone === true ? 'border-[#42ff31]   text-foreground' : ''}
                                            ${validity.phone === false ? 'border-red11   text-foreground' : ''}
                                             `}
                                        />
                                        <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Phone</label>
                                        {String(validity.phone).length > 3 && validity.phone === false && (
                                            <div className="text-[#ff0202] flex items-center">
                                                <AlertFillIcon size={12} />
                                                <p className="mr-3">
                                                    Phone number is not valid...
                                                </p>
                                            </div>
                                        )}
                                        {errors?.phone ? (
                                            <p className="text-[#ff0202] flex items-center">{errors.phone}</p>
                                        ) : null}
                                    </div>
                                    <div className="relative mt-1">
                                        <Input
                                            name="address"
                                            className={`col-span-3 bg-background border-border `}
                                        />
                                        <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Address</label>
                                    </div>

                                    <div className="relative mt-1">
                                        <Input
                                            type="text"
                                            list="ListOptions2"
                                            name="model"
                                            className={`  col-span-3 bg-background border-border
                                                  ${modelError === false && validity.model === false ? 'border-border bg-background text-foreground' : ' '}
                                                  ${modelError === true ? 'border-red11   text-foreground' : ' '}
                                                   ${validity.model === true && modelError === false ? 'border-[#42ff31]   text-foreground' : ' '}
                                                   ${validity.model === false ? 'border-red11   text-foreground' : ''}
                                                   `}
                                            onChange={(e) => {
                                                SetModelError(false);
                                                handleChange('model', e.target.value); // Pass the selected value to handleChange
                                            }}
                                        />
                                        <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Model</label>
                                        {modelError === true && (
                                            <div className="text-[#ff0202] flex items-center">
                                                <AlertFillIcon size={12} />
                                                <p className="mr-3">
                                                    Model is required.
                                                </p>
                                            </div>
                                        )}
                                        {errors?.model ? (
                                            <p className="text-[#ff0202] flex items-center">{errors.model}</p>
                                        ) : null}
                                    </div>
                                    {modelList && (
                                        <datalist id="ListOptions2">
                                            {modelList.map((item, index) => (
                                                <option key={index} value={item.model} />
                                            ))}
                                        </datalist>
                                    )}
                                    <div className=' flex justify-between w-[97%]' >
                                        <div className="relative mt-1 w-[47%]">
                                            <Input
                                                name="year"
                                                type="number"
                                                value={formData.year}
                                                className={` bg-background border-border mr-2 w-full
                                                ${validity.year === true ? 'border-[#42ff3194]   text-foreground' : ' '}
                                                ${validity.year === false ? 'border-red11   text-foreground' : ''}
                                                `}
                                                onChange={(e) => handleChange('year', e.target.value)}
                                            />
                                            <label className="col-span-3 text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Year</label>
                                            {String(validity.year).length > 3 && validity.year === false && (
                                                <p className="text-[#ff0202] flex items-center">
                                                    <AlertFillIcon size={12} /> Year is not valid...
                                                </p>
                                            )}
                                        </div>
                                        <div className="relative mt-1  w-[47%]">
                                            <Input
                                                name="stockNum"
                                                className={` bg-background border-border ml-3 w-full `}
                                            />
                                            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Stock Number</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Input type="hidden" name="iRate" defaultValue={10.99} />
                            <Input type="hidden" name="tradeValue" defaultValue={0} />
                            <Input type="hidden" name="lien" defaultValue={0} />
                            <Input type="hidden" name="discount" defaultValue={0} />
                            <Input type="hidden" name="followUpDay" defaultValue={3} />
                            <Input type="hidden" name="deposit" defaultValue={0} />
                            <Input type="hidden" name="months" defaultValue={60} />
                            <Input type="hidden" name="accessories" defaultValue={0} />
                            <Input type="hidden" name="userId" defaultValue={userId} />
                            <Input type="hidden" name="brand" defaultValue={brandId} />
                            <Input type="hidden" name="userEmail" defaultValue={email} />
                            <Input type="hidden" name="userName" defaultValue={name} />
                            <ButtonLoading
                                size="sm"
                                type="submit"
                                className="w-auto cursor-pointer ml-auto mt-3 bg-[#dc2626] hover:bg-transparent"
                                name="intent"
                                value="submit"
                                isSubmitting={isSubmitting}
                                loadingText="Creating finance deal..."
                                onClick={() => toast.success(`Creating finance deal...`)}
                            >
                                Next
                            </ButtonLoading>

                        </CardFooter>
                    </Form>
                </Card>
            </div >
        </>
    )
}
/**      <div className="mt-1">
                                    <h3 className="text-2xl font-thin">CLIENT INFORMATION</h3>
                                </div>
                                <hr className='text-muted-foreground w-[90%]' />
                                <div className="mt-1">
                                        <h3 className="text-2xl font-thin">MODEL INFORMATION</h3>
                                        <hr className='text-muted-foreground w-[90%]' />

                                    </div> */
export const meta: MetaFunction = () => {
    return [
        { title: "Quote - Dealer Sales Assistant" },
        {
            property: "og:title",
            content: "Your very own assistant!",
        },
        {
            name: "description",
            content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
            keywords: 'Automotive Sales, dealership sales, automotive CRM',
        },
    ];
};
