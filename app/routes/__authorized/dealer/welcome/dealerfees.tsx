import { useLoaderData, Form, useActionData } from '@remix-run/react'
import { type MetaFunction, json, redirect, type ActionFunction, type LoaderFunction, } from '@remix-run/node'
import { Input, Label, Separator, Button, } from '~/components/ui/index'
import { prisma } from "~/libs";
import financeFormSchema from '~/overviewUtils/financeFormSchema'
import { createDealerfees, getDealerFeesbyEmail, updateDealerFees, updateUser } from '~/utils/user.server'
import * as Toast from '@radix-ui/react-toast';
import React from 'react';
import { deleteDailyPDF } from '~/utils/dailyPDF/delete.server'
import { saveDailyWorkPlan } from '~/utils/dailyPDF/create.server'
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import { GetUser } from "~/utils/loader.server";


export function invariant(
  condition: any,
  message: string | (() => string),
): asserts condition {
  if (!condition) {
    throw new Error(typeof message === 'function' ? message() : message)
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload)

  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const userEmail = email
  const userLicensing = formPayload.userLicensing
  const userTax = formPayload.userTax
  const userLabour = formPayload.userLabour;
  const intent = formData.intent
  const DealerInfo = await prisma.dealerInfo.findUnique({
    where: {
      id: 1
    }
  })
  if (intent === 'updateUser') {
    delete formData.intent;

    const saveUser = await updateUser(formData)
    const saveDealer = await updateDealerFees(formData)
    return ({ saveUser, saveDealer })
  }
  if (intent === 'dailyPPDF') {
    const userId = formData.userId
    const delete2 = await deleteDailyPDF(userId)
    delete formData.intent;
    const savedaily = await saveDailyWorkPlan(formData)
    console.log(savedaily)
    return ({ savedaily, delete2 })

  }
  const errors = {
    userLicensing: (userLicensing && parseInt(userLicensing) > 1) ? null : "Licensing is required",
    userTax: (userTax && parseInt(userTax) > 1) ? null : "Tax is required",
    userLabour: (userLabour && parseInt(userLabour) > 1) ? null : "Labour is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof userLicensing === "string", "Licensing must be a string");
  invariant(typeof userTax === "string", "Tax must be a string");
  invariant(typeof userLabour === "string", "Labour must be a string");

  if (user?.plan === 'prod_Q9tYUe0dEVzaRf') {
    return redirect("/dealer/welcome/quote");
  } else {
    await prisma.dealer.create({
      data: {
        userEmail: userEmail,
        dealerName: formData.dealer,
        dealerAddress: formData.dealerAddress,
        dealerProv: formData.dealerProv,
        dealerPhone: formData.dealerPhone,
        userLoanProt: formData.userLoanProt,
        userTireandRim: formData.userTireandRim,
        userGap: formData.userGap,
        userExtWarr: formData.userExtWarr,
        userServicespkg: formData.userServicespkg,
        vinE: formData.vinE,
        lifeDisability: formData.lifeDisability,
        rustProofing: formData.rustProofing,
        userLicensing: formData.userLicensing,
        userFinance: formData.userFinance,
        userDemo: formData.userDemo,
        userGasOnDel: formData.userGasOnDel,
        userOMVIC: formData.userOMVIC,
        userOther: formData.userOther,
        userTax: formData.userTax,
        userAirTax: formData.userAirTax,
        userTireTax: formData.userTireTax,
        userGovern: formData.userGovern,
        userPDI: formData.userPDI,
        userLabour: formData.userLabour,
        userMarketAdj: formData.userMarketAdj,
        userCommodity: formData.userCommodity,
        destinationCharge: formData.destinationCharge,
        userFreight: formData.userFreight,
        userAdmin: formData.userAdmin,
      },
    });
    return redirect("/dealer/welcome/quote");
  }
}


export const loader = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) {
    redirect('/login')
  }
  if (user?.plan === 'prod_OY8EMf7RNoJXhX') {
    redirect('/dealer/user/dashboard/settings')

  }
  // if (!deFees) { deFees = await prisma.dealer.findUnique({ where: { userEmail: user?.email } }); }
  const urlSegmentsDashboard = new URL(request.url).pathname.split('/');
  const url = urlSegmentsDashboard.slice(0, 3).join('/');
  console.log(url)
  let DealerInfo

  let deFees = await prisma.dealer.findUnique({ where: { id: 1 } })
  if (!deFees) {
    deFees = await prisma.dealer.create({
      data: {
        dealerName: 'Dealer Name',
        dealerAddress: '1234 Example St',
        dealerProv: 'Ottawa, ON K1A 0B1',
        dealerPhone: '8198198194',
        userLoanProt: 0,
        userTireandRim: '0',
        userGap: 0,
        userExtWarr: '0',
        userServicespkg: 0,
        vinE: 0,
        lifeDisability: 0,
        rustProofing: 0,
        userLicensing: 60,
        userFinance: '0',
        userDemo: '0',
        userGasOnDel: '0',
        userOMVIC: '60',
        userOther: 0,
        userTax: '13',
        userAirTax: '0',
        userTireTax: '0',
        userGovern: '0',
        userPDI: '0',
        userLabour: '118',
        userMarketAdj: '0',
        userCommodity: '0',
        destinationCharge: 0,
        userFreight: '0',
        userAdmin: '0',
        userEmail: user?.email,
      },
    });
  }
  return json({ request, user, deFees, });
}

export const meta = () => {
  return [
    { title: "Welcome - Dealer Fees - Dealer Sales Assistant" },
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

export default function WelcomeDealerFeesSection() {
  const { user, deFees } = useLoaderData();
  // const [open, setOpen] = React.useState(false);
  //  console.log(deFees, data, finance, 'inside welcome dealer fees section')
  const timerRef = React.useRef(0);
  const errors = useActionData() as Record<string, string | null>;

  const Dealerfees = [
    { name: "userAdmin", value: deFees.userAdmin, placeholder: "Admin" },
    { name: "userFreight", value: deFees.userFreight, placeholder: "Freight" },
    { name: "userCommodity", value: deFees.userCommodity, placeholder: "Commodity" },
    { name: "userPDI", value: deFees.userPDI, placeholder: "PDI" },
    { name: "userAirTax", value: deFees.userAirTax, placeholder: "Air Tax" },
    { name: "userTireTax", value: deFees.userTireTax, placeholder: "Tire Tax" },
    { name: "userGovern", value: deFees.userGovern, placeholder: "Government Fees" },
    { name: "userFinance", value: deFees.userFinance, placeholder: "Finance Fees" },
    { name: "destinationCharge", value: deFees.destinationCharge, placeholder: "Destination Charge" },
    { name: "userGasOnDel", value: deFees.userGasOnDel, placeholder: "Gas On Delivery" },
    { name: "userMarketAdj", value: deFees.userMarketAdj, placeholder: "Market Adjustment" },
    { name: "userDemo", value: deFees.userDemo, placeholder: "Demonstratration Fee" },
    { name: "userOMVIC", value: deFees.userOMVIC, placeholder: "OMVIC or Other" },
  ];

  const FinanceOptions = [
    { name: "userExtWarr", value: deFees.userExtWarr, placeholder: 'Extended Warranty' },
    { name: "userLoanProt", value: deFees.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: deFees.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", deFees: deFees.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: deFees.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: deFees.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: deFees.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: deFees.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: deFees.userOther, placeholder: 'Other data Package' },
  ];
  //      <video loop autoPlay width='750' height='750' src='https://youtu.be/u1MLfrFzCBo' className='mx-auto z-49' frameBorder="0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid grid-cols-1 mx-auto ">
      <div className=" mt-5">
        <h2 className="text-2xl font-thin">
          Getting Started
        </h2>
        <Separator className="mb-4" />
        <p className="text-sm text-foreground mt-3 mb-3">
          To get started you will need to take care of a few things before using the CRM. First you will need to input your dealer's fees and other values, in your settings section, for the quoting system to populate accurate quotes.
        </p>
      </div>
      <a href='/dealer/user/dashboard/settings' target="_blank">
        <Button className='bg-primary border border-border text-foreground'>
          User Settings
        </Button>
      </a>
      <p className='my-3'>
        Afterwards your free to start using the crm you can access everything from the menu on the top right of the screen. Although we suggest going over the documentation to get the most out of the CRM. It's not needed if you have used other CRM's before, but there are features found in our CRM that you have not used before that could be useful in your everyday tasks.
      </p>
      <a href='/dealer/user/_docs/docs' target="_blank">
        <Button className='bg-primary border border-border text-foreground'>
          Documentation
        </Button>
      </a>
    </div>

  )
}


export const asdsaloader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  let deFees = await prisma.dealer.findUnique({
    where: { userEmail: email },
  });
  console.log('loader', deFees, email, user)
  return json({ request, user, deFees });
}

/**    deFees = await prisma.dealerFeesAdmin.findUnique({
      where: {
        id: 1
      }
    })
    const Dealerfees = [
      { name: "userAdmin", value: deFees.userAdmin, placeholder: "Admin" },
      { name: "userFreight", value: deFees.userFreight, placeholder: "Freight" },
      { name: "userCommodity", value: deFees.userCommodity, placeholder: "Commodity" },
      { name: "userPDI", value: deFees.userPDI, placeholder: "PDI" },
      { name: "userAirTax", value: deFees.userAirTax, placeholder: "Air Tax" },
      { name: "userTireTax", value: deFees.userTireTax, placeholder: "Tire Tax" },
      { name: "userGovern", value: deFees.userGovern, placeholder: "Government Fees" },
      { name: "userFinance", value: deFees.userFinance, placeholder: "Finance Fees" },
      { name: "destinationCharge", value: deFees.destinationCharge, placeholder: "Destination Charge" },
      { name: "userGasOnDel", value: deFees.userGasOnDel, placeholder: "Gas On Delivery" },
      { name: "userMarketAdj", value: deFees.userMarketAdj, placeholder: "Market Adjustment" },
      { name: "userDemo", value: deFees.userDemo, placeholder: "Demonstratration Fee" },
      { name: "userOMVIC", value: deFees.userOMVIC, placeholder: "OMVIC or Other" },
    ];

    const FinanceOptions = [
      { name: "userExtWarr", value: deFees.userExtWarr, placeholder: 'Extended Warranty' },
      { name: "userLoanProt", value: deFees.userLoanProt, placeholder: 'Loan Protection' },
      { name: "userGap", value: deFees.userGap, placeholder: 'Gap Protection' },
      { name: "userTireandRim", deFees: deFees.userTireandRim, placeholder: 'Tire and Rim' },
      { name: "vinE", value: deFees.vinE, placeholder: 'Vin Etching' },
      { name: "rustProofing", value: deFees.rustProofing, placeholder: 'Under Coating' },
      { name: "userServicespkg", value: deFees.userServicespkg, placeholder: 'Service Package' },
      { name: "lifeDisability", value: deFees.lifeDisability, placeholder: 'Life and Disability' },
      { name: "userOther", value: deFees.userOther, placeholder: 'Other data Package' },
    ];
    return json({ request, user, deFees, Dealerfees, FinanceOptions });
     */
