/* eslint-disable tailwindcss/enforces-shorthand */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { overviewLoader, overviewAction, financeIdLoader } from '~/components/actions/overviewActions'
import { useFetcher, useLoaderData, useParams, useRouteLoaderData, } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import { ImageSelect } from '~/overviewUtils/imageselect'
import * as Tooltip from '@radix-ui/react-tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Button, Checkbox } from "~/components/ui/index"
import * as Toast from '@radix-ui/react-toast';
import { quotebrandIdActionLoader } from '~/components/actions/quote$brandIdAL'
import { Slider } from '~/components/ui/slider';
import { Badge } from '~/other/badge'
import ClientProfile from '~/components/dashboard/calls/actions/clientProfile'
import { Theme, ThemePanel } from '@radix-ui/themes';
import { model } from '~/models'
import { prisma } from '~/libs';
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getDataKawasaki, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou } from "~/utils/finance/get.server";
import { json, type ActionFunction, type DataFunctionArgs, type LoaderFunction, redirect, type LinksFunction } from '@remix-run/node'
import { getSession } from '~/sessions/auth-session.server';
import { requireAuthCookie } from '~/utils/misc.user.server';
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import Sidebar from '~/components/shared/sidebar';
import { GetUser } from "~/utils/loader.server";

export const links: LinksFunction = () => [{ rel: "icon", type: "image/svg", href: '/calculator.svg' },]

export let action = overviewAction;

export const meta: MetaFunction = () => {
    return [
        { title: "Payment Calculator - Dealer Sales Assistant" },
        {
            property: "og:title",
            content: "Your very own assistant!",
        },
        {
            name: "description",
            content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.", keywords: 'Automotive Sales, dealership sales, automotive CRM',
        },
    ];
};

export async function loader({ request, params }: LoaderFunction) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")

    const user = await GetUser(email)
    if (!user) { redirect('/login') }
    const notifications = await prisma.notificationsUser.findMany({ where: { userEmail: email } })
    const userId = user?.id
    let finance = await prisma.finance.findFirst({ orderBy: { createdAt: 'desc', }, });
    const financeId = finance?.id
    //  const { finance, dashboard, clientfile, } = await getClientFinanceAndDashData(financeId)
    const deFees = await prisma.dealer.findUnique({ where: { userEmail: email, } })
    const modelData = await getDataByModel(finance)
    const sliderWidth = '50%'
    return json({ ok: true, modelData, finance, deFees, sliderWidth, notifications })
}

export function PaymentCalc({ outletSize }) {
    const { modelData, deFees, manOptions, bmwMoto, bmwMoto2, user, client } = useLoaderData()
    const finance = {
        clientfileId: '1',
        dashboardId: '1',
        financeId: '1',
        financeManager: '1',
        email: 'test@gmail.com',
        firstName: 'test',
        lastName: 'test',
        phone: '61361336134',
        name: 'teset',
        address: 'test st ',
        city: 'testville',
        postal: 'k0c1g0',
        province: 'on',
        dl: 'asda87938y2r4h',
        typeOfContact: 'phone',
        timeToContact: '',
        iRate: '',
        months: '',
        discount: '',
        total: '',
        onTax: '',
        on60: '',
        biweekly: '',
        weekly: '',
        weeklyOth: '',
        biweekOth: '',
        oth60: '',
        weeklyqc: '',
        biweeklyqc: '',
        qc60: '',
        deposit: '',
        biweeklNatWOptions: '',
        weeklylNatWOptions: '',
        nat60WOptions: '',
        weeklyOthWOptions: '',
        biweekOthWOptions: '',
        oth60WOptions: '',
        biweeklNat: '',
        weeklylNat: '',
        nat60: '',
        qcTax: '',
        otherTax: '',
        totalWithOptions: '',
        otherTaxWithOptions: '',
        desiredPayments: '',
        freight: '',
        admin: '',
        commodity: '',
        pdi: '',
        discountPer: '',
        userLoanProt: '',
        userTireandRim: '',
        userGap: '',
        userExtWarr: '',
        userServicespkg: '',
        deliveryCharge: '',
        vinE: '',
        lifeDisability: '',
        rustProofing: '',
        userOther: '',
        paintPrem: '',
        licensing: '',
        stockNum: '',
        options: '',
        accessories: '',
        labour: '',
        year: '',
        brand: '',
        model: '',
        model1: '',
        color: '',
        modelCode: '',
        msrp: '',
        userEmail: '',
        tradeValue: '',
        tradeDesc: '',
        tradeColor: '',
        tradeYear: '',
        tradeMake: '',
        tradeVin: '',
        tradeTrim: '',
        tradeMileage: '',
        trim: '',
        vin: '',
        leadNote: '',
    }
    console.log(deFees, 'deFees')

    const toFormat = new Date();
    const today = toFormat.toISOString();
    let { brandId } = useParams()
    const brand = brandId
    let fetcher = useFetcher()
    const showSection = true
    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);
    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    let motorTotal = 0;
    let optionsTotalMani = 0;
    let feesTotal = 0;
    let accTotal = 0;
    let modelSpecOpt = 0;
    let maniTotal = 0;
    let bmwTotal = 0;
    let totalSum = 0;


    const initial = {
        userLabour: parseInt(deFees.userLabour) || 0,
        accessories: 0,
        labour: 0,
        msrp: 19999,
        lien: 0,

        userDemo: parseFloat(deFees.userDemo) || 0,
        userGovern: parseFloat(deFees.userGovern) || 0,
        userGasOnDel: parseFloat(deFees.userGasOnDel) || 0,
        userAirTax: parseFloat(deFees.userAirTax) || 0,
        userFinance: parseFloat(deFees.userFinance) || 0,
        destinationCharge: parseFloat(deFees.destinationCharge) || 0,
        userMarketAdj: parseFloat(deFees.userMarketAdj) || 0,
        userOther: parseFloat(deFees.userOther) || 0,

        userExtWarr: parseFloat(deFees.userExtWarr) || 0,
        userServicespkg: parseFloat(deFees.userServicespkg) || 0,
        vinE: parseFloat(deFees.vinE) || 0,
        rustProofing: parseFloat(deFees.rustProofing) || 0,
        userGap: parseFloat(deFees.userGap) || 0,
        userLoanProt: parseFloat(deFees.userLoanProt) || 0,
        userTireandRim: parseInt(deFees.userTireandRim) || 0,
        lifeDisability: parseInt(deFees.lifeDisability) || 0,
        deliveryCharge: 0,
        paintPrem: 0,
        trade: 0,
        freight: parseInt(deFees.userFreight) || 0,
        licensing: parseInt(deFees.userLicensing) || 0,
        licensingFinance: deFees.userLicensing || 0,
        commodity: parseInt(deFees.userCommodity) || 0,
        pdi: parseInt(deFees.userPDI) || 0,
        admin: parseInt(deFees.userAdmin) || 0,
        biweeklNatWOptions: 0,
        nat60WOptions: 0,
        weeklylNatWOptions: 0,
        userTireTax: parseInt(deFees.userTireTax) || 0,
        nat60: 0,
        userOMVIC: parseInt(deFees.userOMVIC) || 0,
        tradeValue: 0,
        deposit: 500,
        discount: 0,
        iRate: 10.99,
        months: 60,
        discountPer: 0,
        biweeklyqc: 0,
        weeklyqc: 0,
        biweeklNat: 0,
        weeklylNat: 0,
        biweekOth: 0,
        weeklyOth: 0,
        othTax: 13,
        firstName: finance.firstName,
        lastName: finance.lastName,
        panAmAdpRide: 0,
        panAmTubelessLacedWheels: 0,
        hdWarrAmount: 0,
    };


    const [selectedType, setSelectedType] = useState();
    const [selectedOption, setSelectedOption] = useState();
    const [selectedYear, setSelectedYear] = useState();

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        setSelectedOption();
        setSelectedYear();
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setSelectedYear();
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const [formData, setFormData] = useState(initial)


    let panAmLacedWheels = formData.panAmTubelessLacedWheels || 0;
    let panAmAdpRide = formData.panAmAdpRide || 0;

    let hdWarrAmount = formData.hdWarrAmount || 0;
    // ----- calc ----- if anyone wants to check math, go for it matches td auto loan payments to the penny ---- !!! do not fix errors it will mess up the calculations !!!
    const hdAcc = panAmLacedWheels + panAmAdpRide + hdWarrAmount;
    const paintPrem = parseInt(formData.paintPrem.toString());
    const msrp = parseFloat(formData.msrp.toString());
    const accessories = parseFloat(formData.accessories.toString()) || 0;
    const totalLabour = parseFloat(formData.labour.toString()) * parseFloat(formData.userLabour.toString()) || 0;
    const othConv = parseFloat(formData.othTax.toString());
    const downPayment = parseFloat(formData.deposit.toString()) || 0;
    const discount = parseFloat(formData.discount.toString()) || 0;
    const lien = parseFloat(formData.lien.toString()) || 0;
    const tradeValue = parseFloat(formData.tradeValue.toString()) || 0;
    const deposit = parseFloat(formData.deposit.toString()) || 0;
    const discountPer = parseFloat(formData.discountPer.toString()) || 0;
    const months = parseFloat(formData.months.toString()) || 0;
    const iRate = parseFloat(formData.iRate.toString()) || 0;
    const deliveryCharge = parseFloat(formData.deliveryCharge.toString()) || 0;

    const numberOfMonths = parseInt(formData.months.toString())
    const msrp1 = (msrp * (100 - discountPer)) / 100;
    const manitouRandomFees = (finance.brand === 'Manitou' ? 475 : 0)

    let essentials = 0

    essentials =
        formData.userDemo +
        formData.userGovern +
        formData.userGasOnDel +
        formData.userAirTax +
        formData.userFinance +
        formData.destinationCharge +
        formData.userMarketAdj +
        formData.userTireTax +
        formData.userOMVIC +
        formData.admin +
        formData.commodity +
        formData.freight +
        deliveryCharge +
        formData.pdi +
        hdAcc
    // dealer options
    const options =
        formData.userOther +
        formData.userServicespkg +
        formData.vinE +
        formData.rustProofing +
        formData.userGap +
        formData.userLoanProt +
        formData.userExtWarr +
        formData.lifeDisability +
        formData.userTireandRim;

    const total =
        essentials +
        parseInt(paintPrem) +
        parseInt(accessories) +
        parseInt(totalLabour) -
        parseInt(tradeValue) +
        (discountPer === 0 ? parseInt(msrp) : parseInt(msrp1)) - parseInt(discount);

    const totalWithOptions = total + options;

    const beforeDiscount =
        essentials +
        parseInt(paintPrem) +
        parseInt(formData.freight) +
        parseInt(formData.admin) +
        parseInt(formData.pdi) +
        parseInt(formData.commodity) +
        parseInt(accessories) +
        parseInt(totalLabour) +
        parseInt(tradeValue) +
        parseInt(msrp) -
        parseInt(discount);

    const perDiscountGiven =
        essentials +
        parseInt(paintPrem) +
        parseInt(formData.freight) +
        parseInt(formData.admin) +
        parseInt(formData.pdi) +
        parseInt(formData.commodity) +
        parseInt(accessories) +
        parseInt(totalLabour) +
        parseInt(tradeValue) +
        parseInt(msrp) -
        parseInt(discount) -
        (essentials +
            parseInt(formData.freight) +
            parseInt(paintPrem) +
            parseInt(formData.pdi) +
            parseInt(formData.admin) +
            parseInt(formData.commodity) +
            parseInt(accessories) +
            parseInt(totalLabour) +
            parseInt(tradeValue) +
            (discountPer === 0 ? parseInt(msrp) : parseInt(msrp1)) -
            parseInt(discount))

    const totalWithOptionsWithTax = (
        totalWithOptions *
        (parseFloat(deFees.userTax) / 100 + 1)
    ).toFixed(2)

    //const licensing = parseInt(formData.licensing.toString() + lien)
    const licensing = parseInt(formData.licensing) + parseInt(formData.lien)
    const conversionOth = (parseFloat(othConv) / 100 + 1).toFixed(2);
    const othTax = conversionOth

    const otherTax = (licensing + (total * othTax)).toFixed(2)
    // const onTax =  (total * (parseFloat(deFees.userTax) / 100 + 1)).toFixed(2)
    const native = (licensing + total).toFixed(2)
    const onTax = (licensing + (total * (parseFloat(deFees.userTax) / 100 + 1))).toFixed(2)
    const optionsTotal = total + options
    const qcTax = (licensing + (optionsTotal * (parseFloat(deFees.userTax) / 100 + 1))).toFixed(2)
    const otherTaxWithOptions = (licensing + (totalWithOptions * othTax)).toFixed(2)

    const loanAmountON = parseFloat(onTax)
    const loanAmountQC = parseFloat(qcTax)
    const loanAmountNAT = parseFloat(native)
    const loadAmountNATWOptions = totalWithOptions
    const loanAmountOther = parseFloat(otherTax)
    const loanAmountOtherOptions = parseFloat(otherTaxWithOptions);

    const iRateCon = parseFloat(iRate);
    const conversion = iRateCon / 100;
    const monthlyInterestRate = conversion / 12;

    const loanPrincipalON = loanAmountON - downPayment
    const loanPrincipalQC = loanAmountQC - downPayment

    const loanPrincipalNAT = loanAmountNAT - downPayment
    const loanPrincipalNATWOptions = loadAmountNATWOptions - downPayment

    const loanPrincipalOth = loanAmountOther - downPayment
    const loanPrincipalOthWOptions = loanAmountOtherOptions - downPayment

    // payments
    const on60 = parseFloat(((monthlyInterestRate * loanPrincipalON) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
    const biweekly = parseFloat(((on60 * 12) / 26).toFixed(2));
    const weekly = parseFloat(((on60 * 12) / 52).toFixed(2));

    // w/options
    const qc60 = parseFloat(((monthlyInterestRate * loanPrincipalQC) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
    const biweeklyqc = parseFloat(((qc60 * 12) / 26).toFixed(2));
    const weeklyqc = parseFloat(((qc60 * 12) / 52).toFixed(2));

    // no tax
    const nat60 = parseFloat(((monthlyInterestRate * loanPrincipalNAT) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
    const biweeklNat = parseFloat(((nat60 * 12) / 26).toFixed(2));
    const weeklylNat = parseFloat(((nat60 * 12) / 52).toFixed(2));

    // with options
    const nat60WOptions = parseFloat(((monthlyInterestRate * loanPrincipalNATWOptions) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
    const biweeklNatWOptions = parseFloat(((nat60WOptions * 12) / 26).toFixed(2));
    const weeklylNatWOptions = parseFloat(((nat60WOptions * 12) / 52).toFixed(2));

    // custom tax
    const oth60 = parseFloat(((monthlyInterestRate * loanPrincipalOth) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
    const biweekOth = parseFloat(((oth60 * 12) / 26).toFixed(2));
    const weeklyOth = parseFloat(((oth60 * 12) / 52).toFixed(2));

    // with options
    const oth60WOptions = parseFloat(((monthlyInterestRate * loanPrincipalOthWOptions) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
    const biweekOthWOptions = parseFloat(((oth60WOptions * 12) / 26).toFixed(2));
    const weeklyOthWOptions = parseFloat(((oth60WOptions * 12) / 52).toFixed(2));

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value, }))
    }

    if (!finance.model1) {
        const model1 = finance.model
    }

    const [mainButton, setMainButton] = useState('payments');
    const [subButton, setSubButton] = useState('withoutOptions');
    const [desiredPayments, setDesiredPayments] = useState('');

    const handleMainButtonClick = (mainButton) => {
        setMainButton(mainButton);
    };

    const handleSubButtonClick = (subButton) => {
        setSubButton(subButton);
    };

    const paymentMapping = {
        payments: {
            withoutOptions: 'Standard Payment',
            withOptions: 'Payments with Options',
        },
        noTax: {
            withoutOptions: 'No Tax Payment',
            withOptions: 'No Tax Payment with Options',
        },
        customTax: {
            withoutOptions: 'Custom Tax Payment',
            withOptions: 'Custom Tax Payment with Options',
        },
    };

    useEffect(() => {
        if (mainButton in paymentMapping && subButton in paymentMapping[mainButton]) {
            setDesiredPayments(paymentMapping[mainButton][subButton]);
        } else {
            setDesiredPayments('');
        }
    }, [mainButton, subButton]);


    function getStateSizeInBytes(state) {
        const jsonString = JSON.stringify(state);
        const sizeInBytes = new TextEncoder().encode(jsonString).length;
        return sizeInBytes;
    }
    /// console.log(formData, 'formData')
    const formDataSizeInBytes = getStateSizeInBytes(formData);
    //console.log(`formData size: ${formDataSizeInBytes} bytes`);
    //console.log(`formData size: ${(formDataSizeInBytes / 1024).toFixed(2)} KB`);
    // console.log(`formData size: ${(formDataSizeInBytes / (1024 * 1024)).toFixed(2)} MB`);
    // console.log('bmwmoto', bmwMoto)
    // console.log(';bmwMoto2', bmwMoto2)
    // console.log(finance)
    // console.log(deFees)
    // console.log(modelData)
    // console.log(accessories)
    // console.log(initial)
    // console.log(accTotal)
    // console.log(essentials)

    let today2 = new Date();
    const nextAppt = today2.setHours(today2.getHours() + 24);

    useEffect(() => {
        const button = document.getElementById('myButton');
        const button2 = document.getElementById('myButton2');
        const button3 = document.getElementById('myButton3');
        const button4 = document.getElementById('myButton4');
        const button5 = document.getElementById('myButton5');
        const button6 = document.getElementById('button6');
        if (button5) {
            button5.addEventListener('mousedown', function () {
                this.style.transform = 'translateY(1.5px)';
            });

            button5.addEventListener('mouseup', function () {
                this.style.transform = 'translateY(-1.5px)';
            });
        }
        if (button) {
            button.addEventListener('mousedown', function () {
                this.style.transform = 'translateY(1.5px)';
            });

            button.addEventListener('mouseup', function () {
                this.style.transform = 'translateY(-1.5px)';
            });
        }
        if (button2) {
            button2.addEventListener('mousedown', function () {
                this.style.transform = 'translateY(1.5px)';
            });

            button2.addEventListener('mouseup', function () {
                this.style.transform = 'translateY(-1.5px)';
            });
        }
        if (button3) {
            button3.addEventListener('mousedown', function () {
                this.style.transform = 'translateY(1.5px)';
            });

            button3.addEventListener('mouseup', function () {
                this.style.transform = 'translateY(-1.5px)';
            });
        }
        if (button4) {
            button4.addEventListener('mousedown', function () {
                this.style.transform = 'translateY(1.5px)';
            });

            button4.addEventListener('mouseup', function () {
                this.style.transform = 'translateY(-1.5px)';
            });
        }
        if (button6) {
            button6.addEventListener('mousedown', function () {
                this.style.transform = 'translateY(1.5px)';
            });

            button6.addEventListener('mouseup', function () {
                this.style.transform = 'translateY(-1.5px)';
            });
        }
    }, []);

    function DealerOptionsAmounts() {
        return (
            <>
                <>
                    <Sidebar />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="userServicespkg"
                                name="userServicespkg"
                                checked={formData.userServicespkg !== 0}
                                className={`form-checkbox mr-2 ${formData.userServicespkg !== 0 ? 'checked:bg-gray-500' : ''}`}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    const newValue = checked ? parseFloat(deFees.userServicespkg) : 0; // Use the correct variable name here
                                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                                }}
                            />
                            <p className="mr-4">Service Packages  </p>
                        </div>
                        <p>${formData.userServicespkg}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="userExtWarr"
                                name="userExtWarr"
                                checked={formData.userExtWarr !== 0}
                                className={`form-checkbox mr-2 ${formData.userExtWarr !== 0 ? 'checked:bg-gray-500' : ''}`}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    const newValue = checked ? parseFloat(deFees.userExtWarr) : 0; // Use the correct variable name here
                                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                                }}
                            />
                            <p className="mr-4">Extended Warranty</p>
                        </div>
                        <p>${formData.userExtWarr}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="vinE"
                                name="vinE"
                                checked={formData.vinE !== 0}
                                className={`form-checkbox mr-2 ${formData.vinE !== 0 ? 'checked:bg-gray-500' : ''}`}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    const newValue = checked ? parseFloat(deFees.vinE) : 0; // Use the correct variable name here
                                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                                }}
                            />
                            <p className="mr-4">Vin Etching</p>
                        </div>
                        <p>${formData.vinE}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rustProofing"
                                name="rustProofing"
                                checked={formData.rustProofing !== 0}
                                className={`form-checkbox mr-2 ${formData.rustProofing !== 0 ? 'checked:bg-gray-500' : ''}`}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    const newValue = checked ? parseFloat(deFees.rustProofing) : 0; // Use the correct variable name here
                                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                                }}
                            />
                            <p className="mr-4">Under Coating</p>
                        </div>
                        <p>${formData.rustProofing}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="userGap"
                                name="userGap"
                                checked={formData.userGap !== 0}
                                className={`form-checkbox mr-2 ${formData.userGap !== 0 ? 'checked:bg-gray-500' : ''}`}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    const newValue = checked ? parseFloat(deFees.userGap) : 0; // Use the correct variable name here
                                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                                }}
                            />
                            <p className="mr-4">Gap Insurance</p>
                        </div>
                        <p>${formData.userGap}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="userLoanProt"
                                name="userLoanProt"
                                checked={formData.userLoanProt !== 0}
                                className={`form-checkbox mr-2 ${formData.userLoanProt !== 0 ? 'checked:bg-gray-500' : ''}`}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    const newValue = checked ? parseFloat(deFees.userLoanProt) : 0; // Use the correct variable name here
                                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                                }}
                            />
                            <p className="mr-4">Loan Protection</p>
                        </div>
                        <p>${formData.userLoanProt}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="userTireandRim"
                                name="userTireandRim"
                                checked={formData.userTireandRim !== 0}
                                className={`form-checkbox mr-2 ${formData.userTireandRim !== 0 ? 'checked:bg-gray-500' : ''}`}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    const newValue = checked ? parseFloat(deFees.userTireandRim) : 0; // Use the correct variable name here
                                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                                }}
                            />
                            <p className="mr-4">  Tire and Rim Protection </p>
                        </div>
                        <p> ${formData.userTireandRim} </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="lifeDisability"
                                name="lifeDisability"
                                checked={formData.lifeDisability !== 0}
                                className={`form-checkbox mr-2 ${formData.lifeDisability !== 0 ? 'checked:bg-gray-500' : ''}`}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    const newValue = checked ? parseFloat(deFees.lifeDisability) : 0; // Use the correct variable name here
                                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                                }}
                            />
                            <p className="mr-4">Life and Disability</p>
                        </div>
                        <p>${formData.lifeDisability}</p>
                    </div>

                </>
            </>
        )
    }
    return (
        <div className=' h-[100vh]'>
            <div className='mt-[75px]' >
                <ImageSelect />
            </div>
            <fetcher.Form method="post">

                {/* Price Breakdown */}
                <>
                    <div className="mt-3">
                        <h3 className="text-2xl ">Price</h3>
                        <hr className="solid" />

                    </div>

                    <hr className="solid dark:text-[#fafafa]" />
                    <div className="grid grid-cols-1 justify-between  mt-2">
                        <div className='flex justify-between'>
                            <p className="basis-2/4 ">MSRP</p>
                            <Input
                                name="msrp"
                                id="msrp"
                                className='w-20 h-8 text-right'
                                autoComplete="msrp"
                                defaultValue={formData.msrp}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='flex justify-between'>
                            <p className="basis-2/4  mt-2">Licensing</p>
                            <Input
                                className="w-20 h-8 justify-end text-right  mt-2 ml-auto "
                                defaultValue={licensing}
                                placeholder="licensing"
                                type="text"
                                name="licensing"
                                onChange={handleChange}
                            />
                        </div>


                    </div>
                    <div className="flex flex-wrap justify-between  ">

                        {formData.freight > 0 && (
                            <>
                                <p className="basis-2/4  mt-3">Freight</p>
                                <Input
                                    className="w-20 h-8 items-end justify-end text-right  mt-2"
                                    defaultValue={formData.freight}
                                    placeholder="freight"
                                    type="text"
                                    name="freight"
                                    onChange={handleChange}
                                />
                            </>
                        )}

                        {formData.pdi > 0 && (
                            <>
                                <p className="basis-2/4  mt-2">PDI</p>
                                <Input
                                    className="w-20 h-8 items-end justify-end text-right  mt-2"
                                    defaultValue={formData.pdi}
                                    placeholder="pdi"
                                    type="text"
                                    name="pdi"
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        {formData.admin > 0 && (
                            <>
                                <p className="basis-2/4  mt-2">Admin</p>
                                <Input
                                    className="w-20 h-8 items-end justify-end text-right  mt-2  "
                                    defaultValue={formData.admin}
                                    placeholder="admin"
                                    type="text"
                                    name="admin"
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        {formData.commodity > 0 && (
                            <>
                                <p className="basis-2/4  mt-2">Commodity</p>
                                <Input
                                    className="w-20 h-8 items-end justify-end text-right  mt-2"
                                    defaultValue={formData.commodity}
                                    placeholder="commodity"
                                    type="text"
                                    name="commodity"
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        <>
                        </>
                    </div>
                    <>
                        <div className="mt-3">
                            <h3 className="text-2xl ">Standard Terms</h3>
                        </div>
                        <hr className="solid" />
                        <div className=''>
                            <div className='mt-3'>
                                <div className="flex main-button-group justify-between ">
                                    <Badge id='myButton'
                                        className={`button  shadow hover:text-[#fafafa] bg-[#02a9ff]  transform cursor-pointer  ${mainButton === 'payments' ? 'active bg-[#09090b] text-[#fafafa]' : 'bg-slate1 text-[#fafafa]'}`}
                                        onClick={() => handleMainButtonClick('payments')}>
                                        Payments
                                    </Badge>

                                    <Badge id='myButton1'
                                        className={`button  shadow bg-[#02a9ff] transform hover:text-[#fafafa]   cursor-pointer ${mainButton === 'noTax' ? 'active bg-[#09090b] text-[#fafafa] ' : 'bg-slate1 text-[#fafafa]'}`}
                                        onClick={() => handleMainButtonClick('noTax')}
                                    >
                                        No Tax
                                    </Badge>

                                    <Badge id='myButton2'
                                        className={`button  shadow bg-[#02a9ff] transform   hover:text-[#fafafa] cursor-pointer ${mainButton === 'customTax' ? 'active bg-[#09090b] text-[#fafafa]' : 'bg-slate1 text-[#fafafa]'}`}
                                        onClick={() => handleMainButtonClick('customTax')}
                                    >
                                        Custom Tax
                                    </Badge>
                                </div>
                                <div className="flex sub-button-group justify-between mt-2">

                                    <Badge id='myButton3'
                                        className={`button  shadow bg-[#02a9ff] transform hover:text-[#fafafa] cursor-pointer ${subButton === 'withoutOptions' ? 'active bg-[#09090b] text-[#fafafa]' : 'bg-slate1 text-[#fafafa]'}`}
                                        onClick={() => handleSubButtonClick('withoutOptions')}
                                    >
                                        W/O Options
                                    </Badge>


                                    <Badge id='myButton5'
                                        className={`button  shadow bg-[#02a9ff] transform  cursor-pointer hover:text-[#fafafa]  ${subButton === 'withOptions' ? 'active bg-[#09090b]  text-[#fafafa]' : 'bg-slate1 text-[#fafafa]'}`}
                                        onClick={() => handleSubButtonClick('withOptions')}
                                    >
                                        W/ Options
                                    </Badge>

                                </div>
                            </div>
                            {/* Render different content based on the selected main and sub buttons */}
                            <div className=''>
                                {mainButton === 'payments' && (
                                    <div className=''>
                                        {subButton === 'withoutOptions' && <div>
                                            <div className="mt-5 flex flex-wrap justify-between ">
                                                <p className="font-bold ">
                                                    ${on60}/Month
                                                </p>
                                                {on60 === Number.isNaN(on60) && <p>If numbers are NaN please verify that you have inputed tax, labour hours and licensing in your profile.</p>}
                                                <p className="font-bold  flex items-end justify-end ">
                                                    ${biweekly}/Bi-weekly
                                                </p>
                                                <p className="font-bold">
                                                    ${weekly}/Week
                                                </p>
                                            </div>
                                        </div>}
                                        {subButton === 'withOptions' && <div>
                                            <div className="mt-2">
                                                <h3 className="text-2xl ">Options Include</h3>
                                            </div>
                                            <hr className="solid" />
                                            <DealerOptionsAmounts />
                                            <div className="mt-5 flex flex-wrap justify-between ">
                                                <p className="font-bold">${qc60}/Month</p>
                                                <p className="font-bold flex items-end justify-end ">
                                                    ${biweeklyqc}/Bi-weekly
                                                </p>
                                                <p className="font-bold">${weeklyqc}/Week</p>
                                            </div>
                                        </div>}
                                    </div>
                                )}

                                {/* Render different content based on the selected main and sub buttons */}
                                {mainButton === 'noTax' && (
                                    <div className=''>
                                        {subButton === 'withoutOptions' &&
                                            <div>
                                                <div className="mt-5 flex flex-wrap justify-between ">
                                                    <p className="font-bold">${nat60}/Month</p>
                                                    <p className="font-bold flex items-end justify-end ">
                                                        ${biweeklNat}/Bi-weekly
                                                    </p>
                                                    <p className="font-bold">${weeklylNat}/Week</p>
                                                </div>
                                            </div>}
                                        {subButton === 'withOptions' &&
                                            <div>
                                                <div className="mt-2">
                                                    <h3 className="text-2xl ">Options Include</h3>
                                                </div>
                                                <hr className="solid" />
                                                <DealerOptionsAmounts />
                                                <div className="mt-5 flex flex-wrap justify-between ">
                                                    <p className="font-bold">${nat60WOptions}/Month</p>
                                                    <p className="font-bold flex items-end justify-end ">
                                                        ${biweeklNatWOptions}/Bi-weekly
                                                    </p>
                                                    <p className="font-bold">${weeklylNatWOptions}/Week</p>
                                                </div>
                                            </div>}
                                    </div>
                                )}

                                {/* Render different content based on the selected main and sub buttons */}
                                {mainButton === 'customTax' && (
                                    <div className=''>

                                        <div className='flex justify-between items-center mt-2'>
                                            <p className="basis-2/4 ">Other tax %</p>
                                            <Input
                                                name="othTax"
                                                id="othTax"
                                                className='w-20 h-8 text-right'
                                                autoComplete="othTax"
                                                defaultValue={formData.othTax}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {subButton === 'withoutOptions' &&
                                            <div className='flex justify-between mt-5'>
                                                <p className="font-bold">
                                                    ${oth60}/Month
                                                </p>
                                                <p className="font-bold flex items-end justify-end ">
                                                    ${biweekOth}/Bi-weekly
                                                </p>
                                                <p className="font-bold">
                                                    ${weeklyOth}/Week
                                                </p>
                                            </div>}
                                        {subButton === 'withOptions' &&
                                            <div>
                                                <div className="mt-2">
                                                    <h3 className="text-2xl ">Options Include</h3>
                                                </div>
                                                <hr className="solid" />
                                                <DealerOptionsAmounts />
                                                <div className="mt-5 flex flex-wrap justify-between ">
                                                    <p className="font-bold">
                                                        ${oth60WOptions}/Month
                                                    </p>
                                                    <p className="font-bold flex items-end justify-end ">
                                                        ${biweekOthWOptions}/Bi-weekly
                                                    </p>
                                                    <p className="font-bold">
                                                        ${weeklyOthWOptions}/Week
                                                    </p>
                                                </div>
                                            </div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                    {/* Contract Variables */}
                    <>
                        <div className="mt-5">
                            <h3 className="text-2xl ">Contract Variables</h3>
                        </div>
                        <hr className="solid" />
                        <div className="grid grid-cols-2 ">
                            <div className=" mt-2 ">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <label htmlFor="Term">Term</label>
                                    <Input
                                        className="w-20 h-8"
                                        name="months"
                                        id="months"
                                        autoComplete="months"
                                        defaultValue={months}
                                        onChange={handleChange}
                                        type='number'
                                    />
                                </div>
                            </div>
                            <div className="mt-2 grid items-end justify-end ">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <label className="text-right" htmlFor="iRate">
                                        Rate
                                    </label>
                                    <Input
                                        className="w-20 h-8 items-end justify-end text-right  "
                                        name="iRate"
                                        id="iRate"
                                        autoComplete="iRate"
                                        defaultValue={iRate}
                                        onChange={handleChange}

                                    />
                                </div>
                            </div>
                            <div className=" mt-2 ">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <label htmlFor="deposit">Deposit</label>
                                    <Input
                                        className="w-20 h-8"
                                        name="deposit"
                                        id="deposit"
                                        autoComplete="deposit"
                                        defaultValue={deposit}
                                        onChange={handleChange}
                                        type='number'
                                    />
                                </div>
                            </div>
                            <div className=" mt-2 grid items-end justify-end ">
                                <div className="grid w-full max-w-sm items-center gap-1.5 ">
                                    <label htmlFor="tradeValue">Trade Value</label>
                                    <Input
                                        className="w-20 h-8 text-right ml-auto"
                                        name="tradeValue"
                                        id="tradeValue"
                                        autoComplete="tradeValue"
                                        defaultValue={tradeValue}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className=" mt-2 ">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <label htmlFor="deposit">Lien</label>
                                    <Input
                                        className="w-20 h-8"
                                        name="lien"
                                        id="lien"
                                        autoComplete="lien"
                                        defaultValue={lien}
                                        onChange={handleChange}
                                        type='number'
                                    />
                                </div>
                            </div>
                        </div>

                        <Accordion type="single" collapsible className="mt-3 w-full cursor-pointer">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Other Inputs</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid  grid-cols-2">
                                        <div className=" mt-2 ">
                                            <div className="grid  max-w-sm items-center gap-1.5">
                                                <label htmlFor="discount">Discount $ </label>
                                                <Input
                                                    className="w-20 h-8"
                                                    name="discount"
                                                    id="discount"
                                                    autoComplete="discount"
                                                    defaultValue={discount}
                                                    onChange={handleChange}
                                                    type='number'
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 ml-auto">
                                            <div className="grid  max-w-sm items-center gap-1.5">
                                                <label htmlFor="discountPer">Discount (1.1-15)%</label>
                                                <Input
                                                    className="w-20 h-8 text-right ml-auto"
                                                    name="discountPer"
                                                    id="discountPer"
                                                    autoComplete="discountPer"
                                                    defaultValue={0}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className=" mt-2 ">
                                            <div className="grid  max-w-sm items-center gap-1.5">
                                                <label htmlFor="discountPer">Delivery Charge</label>
                                                <Input
                                                    className="w-20 h-8"
                                                    name="deliveryCharge"
                                                    id="deliveryCharge"
                                                    autoComplete="deliveryCharge"
                                                    defaultValue={deliveryCharge}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        {totalLabour > 0 &&
                                            <>
                                                <p className="basis-2/4  mt-3">Total Labour</p>
                                                <p className="flex basis-2/4 items-end justify-end  ">
                                                    ${totalLabour}
                                                </p>
                                            </>
                                        }


                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </>
                    {/* total and payments */}
                    <>
                        <div className="mt-3">
                            <h3 className="text-2xl ">Total</h3>
                        </div>
                        <hr className="solid" />
                        <div className="mt-2 flex flex-wrap justify-between ">
                            {perDiscountGiven > 0 && (
                                <>
                                    <p className="basis-2/4 ">Total Before Discount</p>
                                    <p className="flex basis-2/4 items-end justify-end  ">
                                        ${beforeDiscount}
                                    </p>
                                </>
                            )}
                            {perDiscountGiven > 0 && (
                                <>
                                    <p className="basis-2/4 ">
                                        Discount (MSRP only)
                                    </p>
                                    <p className="flex basis-2/4 items-end justify-end  ">
                                        ${perDiscountGiven}
                                    </p>
                                </>
                            )}
                        </div>
                        <div>
                            {mainButton === 'payments' && (
                                <div>
                                    {subButton === 'withoutOptions' &&
                                        <div className="mt-2 flex flex-wrap justify-between ">
                                            <p className="basis-2/4  mt-2">Total</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">

                                                ${total}

                                            </p>
                                            <p className="basis-2/4  ml-auto">With taxes</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">
                                                <Tooltip.Provider>
                                                    <Tooltip.Root>
                                                        <Tooltip.Trigger>
                                                            ${onTax - deposit}
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Portal>
                                                            <Tooltip.Content
                                                                className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                                                sideOffset={5}
                                                            >
                                                                W/O Deposit ${onTax}
                                                            </Tooltip.Content>
                                                        </Tooltip.Portal>
                                                    </Tooltip.Root>
                                                </Tooltip.Provider>
                                            </p>
                                        </div>
                                    }
                                    {subButton === 'withOptions' &&
                                        <div className="mt-2 flex flex-wrap justify-between ">
                                            <p className="basis-2/4  mt-2">Total</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">

                                                ${totalWithOptions}

                                            </p>
                                            <p className="basis-2/4  mt-2">With taxes</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">

                                                ${qcTax}

                                            </p>
                                        </div>
                                    }
                                </div>
                            )}
                            {mainButton === 'noTax' && (
                                <div>
                                    {subButton === 'withoutOptions' &&
                                        <div className="mt-2 flex flex-wrap justify-between ">
                                            <p className="basis-2/4  mt-2">Total</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">

                                                ${total}

                                            </p>
                                            <p className="flex basis-2/4 items-end justify-end  ">
                                                <Tooltip.Provider>
                                                    <Tooltip.Root>
                                                        <Tooltip.Trigger>
                                                            ${native - deposit}
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Portal>
                                                            <Tooltip.Content
                                                                className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                                                sideOffset={5}
                                                            >
                                                                W/O Deposit ${native}
                                                            </Tooltip.Content>
                                                        </Tooltip.Portal>
                                                    </Tooltip.Root>
                                                </Tooltip.Provider>
                                            </p>
                                        </div>
                                    }
                                    {subButton === 'withOptions' &&
                                        <div className="mt-2 flex flex-wrap justify-between ">
                                            <p className="basis-2/4  mt-2">Total</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">

                                                ${totalWithOptions}

                                            </p>
                                        </div>
                                    }
                                </div>
                            )}
                            {mainButton === 'customTax' && (
                                <div>
                                    {subButton === 'withoutOptions' &&
                                        <div className="mt-2 flex flex-wrap justify-between ">
                                            <p className="basis-2/4  mt-2">Total</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">

                                                ${total}

                                            </p>
                                            <p className="basis-2/4  mt-2">With taxes</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">
                                                <Tooltip.Provider>
                                                    <Tooltip.Root>
                                                        <Tooltip.Trigger>
                                                            ${otherTax - deposit}
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Portal>
                                                            <Tooltip.Content
                                                                className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                                                sideOffset={5}
                                                            >
                                                                W/O Deposit ${otherTax}
                                                            </Tooltip.Content>
                                                        </Tooltip.Portal>
                                                    </Tooltip.Root>
                                                </Tooltip.Provider>
                                            </p>
                                        </div>
                                    }
                                    {subButton === 'withOptions' &&
                                        <div className="mt-2 flex flex-wrap justify-between ">
                                            <p className="basis-2/4  mt-2">Total</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">

                                                ${totalWithOptions}

                                            </p>
                                            <p className="basis-2/4  mt-2">With taxes</p>
                                            <p className="flex basis-2/4 items-end justify-end  ">
                                                <Tooltip.Provider>
                                                    <Tooltip.Root>
                                                        <Tooltip.Trigger>
                                                            ${otherTaxWithOptions - deposit}
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Portal>
                                                            <Tooltip.Content
                                                                className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                                                sideOffset={5}
                                                            >
                                                                W/O Deposit ${otherTaxWithOptions}
                                                            </Tooltip.Content>
                                                        </Tooltip.Portal>
                                                    </Tooltip.Root>
                                                </Tooltip.Provider>
                                            </p>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    </>
                    <>


                    </>
                </>
            </fetcher.Form >
        </div>
    )
}



export default function PaymentsCalc() {
    const { notifications, user, sliderWidth } = useLoaderData()

    const [outletSize, setOutletSize] = useState(sliderWidth);
    console.log(sliderWidth, outletSize, 'sliderWidth in function')
    const handleSliderChange = (event) => {

        const newSize = `${event.target.value}%`;
        setOutletSize(newSize);

    };
    console.log(sliderWidth)
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link rel='icon' href='/public/calculator.svg' />
            </head>
            <body>
                <Theme
                    appearance="light"
                    accentColor="sky"
                    grayColor="slate"
                    panelBackground="solid"
                    scaling="90%"
                    radius="medium"
                >

                    <div className="flex min-h-screen px-4 sm:px-6 lg:px-8 bg-slate1">
                        <div className="w-full overflow-hidden rounded-lg">
                            <div className="md:flex my-auto mx-auto">
                                <div
                                    className="my-auto mx-auto"
                                    style={{ width: outletSize }}
                                >
                                    <div className="my-auto mx-auto ">
                                        <PaymentCalc outletSize={outletSize} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-[25px] mb-[25px]">

                        <input
                            name="sliderWidth"
                            type="range"
                            min="35"
                            max="100"
                            value={parseInt(outletSize)}
                            onChange={handleSliderChange}
                            className="w-1/2 appearance-none h-3 rounded-full bg-gray-300 outline-none shadow-sm "
                            style={{
                                background: `linear-gradient(to right, slate10 ${parseInt(outletSize)}%, black ${parseInt(outletSize)}%)`,
                            }}
                        />
                        <style>
                            {`


        `}
                        </style>


                    </div>
                </Theme>
            </body>
        </html>
    );
}
/***

//// wookring do not touch.

export default function Quote() {
  const { sliderWidth } = useLoaderData()
  const [outletSize, setOutletSize] = useState(sliderWidth);
  console.log(sliderWidth, outletSize, 'sliderWidth in function')
  const handleSliderChange = (event) => {

    const newSize = `${event.target.value}%`;
    setOutletSize(newSize);

  };
  console.log(sliderWidth)
  return (
    <>
      <div className="flex min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full overflow-hidden rounded-lg">
          <div className="md:flex my-auto mx-auto">
            <div
              className="my-auto mx-auto"
              style={{ width: outletSize }}
            >
              <div className="my-auto mx-auto ">
                <Overview outletSize={outletSize} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-[25px] mb-[25px]">

        <input
          name="sliderWidth"
          type="range"
          min="35"
          max="100"
          value={parseInt(outletSize)}
          onChange={handleSliderChange}
          className="w-1/2 appearance-none h-3 rounded-full bg-gray-300 outline-none shadow-sm "
          style={{
            background: `linear-gradient(to right, slate10 ${parseInt(outletSize)}%, black ${parseInt(outletSize)}%)`,
          }}
        />
        <style>
          {`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            display: block;
            width: 20px;
            height: 20px;
            background-color: black;

            cursor: pointer;
            transform: rotate(45deg);
            border: none;
            box-shadow: 0 1.5px 10px var(--black-a7);
            border-radius: 10px;
            transition-colors: 0.2s;
            focus-visible: outline-none;
            focus-visible: ring-1;
            border: bg-gray-300;
          }

          input[type="range"]::-moz-range-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background-color: #0284c7;
            border-radius: 50%;
            cursor: pointer;
            transform: rotate(45deg);
            border: none;
          }

          input[type="range"]::-ms-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background-color: #e31746;
            border-radius: 50%;
            cursor: pointer;
            transform: rotate(45deg);
            border: none;
          }
        `}
        </style>


      </div>
    </>
  );
}
*/


/**  <Input type="hidden" defaultValue={on60} name="on60" />
            <Input type="hidden" defaultValue={biweekly} name="biweekly" />
            <Input type="hidden" defaultValue={weekly} name="weekly" />
            <Input type="hidden" defaultValue={weeklyOth} name="weeklyOth" />
            <Input type="hidden" defaultValue={biweekOth} name="biweekOth" />
            <Input type="hidden" defaultValue={oth60} name="oth60" />
            <Input type="hidden" defaultValue={weeklyqc} name="weeklyqc" />
            <Input type="hidden" defaultValue={biweeklyqc} name="biweeklyqc" />
            <Input type="hidden" defaultValue={qc60} name="qc60" />
            <Input type="hidden" defaultValue={brand} name="brand" />
            <Input type="hidden" defaultValue={formData.userExtWarr} name="userExtWarr" />
            <Input type="hidden" defaultValue={formData.userGap} name="userGap" />
            <Input type="hidden" defaultValue={formData.userServicespkg} name="userServicespkg" />
            <Input type="hidden" defaultValue={formData.vinE} name="vinE" />
            <Input type="hidden" defaultValue={formData.rustProofing} name="rustProofing" />
            <Input type="hidden" defaultValue={formData.userLoanProt} name="userLoanProt" />
            <Input type="hidden" defaultValue={formData.userTireandRim} name="userTireandRim" />
            <Input type="hidden" defaultValue={formData.userOther} name="userOther" />
            <Input type="hidden" defaultValue={formData.lifeDisability} name="lifeDisability" />
            <Input type="hidden" defaultValue={total} name="total" />
            <Input type="hidden" defaultValue={msrp} name="msrp" />
            <Input type="hidden" defaultValue={modelData.color} name="color" />
            <Input type="hidden" defaultValue={modelData.model1} name="model1" />
            <Input type="hidden" defaultValue={modelData.modelCode} name="modelCode" />
            <Input type="hidden" defaultValue={onTax} name="onTax" />
            <Input type="hidden" defaultValue={qcTax} name="qcTax" />
            <Input type="hidden" defaultValue={otherTax} name="otherTax" />
            <Input type="hidden" defaultValue={otherTaxWithOptions} name="otherTaxWithOptions" />
            <Input type="hidden" defaultValue={totalWithOptions} name="totalWithOptions" />
            <Input type="hidden" defaultValue={formData.freight} name="freight" />
            <Input type="hidden" defaultValue={formData.admin} name="admin" />
            <Input type="hidden" defaultValue={formData.pdi} name="pdi" />
            <Input type="hidden" defaultValue={formData.commodity} name="commodity" />
            <Input type="hidden" defaultValue={weeklyOthWOptions} name="weeklyOthWOptions" />
            <Input type="hidden" defaultValue={biweekOthWOptions} name="biweekOthWOptions" />
            <Input type="hidden" defaultValue={oth60WOptions} name="oth60WOptions" />
            <Input type="hidden" defaultValue={formData.accessories} name="accessories" />
            <Input type="hidden" defaultValue={formData.labour} name="labour" />

            <Input type="hidden" defaultValue={formData.msrp} name="msrp" />
            <Input type="hidden" defaultValue={weeklylNat} name="weeklylNat" />
            <Input type="hidden" defaultValue={biweeklNat} name="biweeklNat" />
            <Input type="hidden" defaultValue={biweeklNatWOptions} name="biweeklNatWOptions" />
            <Input type="hidden" defaultValue={nat60WOptions} name="nat60WOptions" />
            <Input type="hidden" defaultValue={weeklylNatWOptions} name="weeklylNatWOptions" />
            <Input type="hidden" defaultValue={nat60} name="nat60" />
            <Input type="hidden" defaultValue={licensing} name="licensing" />
            <Input type="hidden" defaultValue={desiredPayments} name="desiredPayments" />
            <Input type="hidden" defaultValue='Reached' name="customerState" />
            <Input type="hidden" defaultValue='Active' name="status" />
            <Input type="hidden" defaultValue={outletSize} name="sliderWidth" />
 */
