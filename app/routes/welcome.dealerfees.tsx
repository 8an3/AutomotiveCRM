import { useLoaderData, Form, useActionData } from '@remix-run/react'
import { type MetaFunction, json, redirect, type ActionFunction, type LoaderFunction, } from '@remix-run/node'
import { Input, Label, Separator, Button, } from '~/components/ui/index'
import { prisma } from "~/libs";
import financeFormSchema from './overviewUtils/financeFormSchema'
import { createDealerfees, getDealerFeesbyEmail, updateDealerFees, updateUser } from '~/utils/user.server'
import * as Toast from '@radix-ui/react-toast';
import React from 'react';
import { deleteDailyPDF } from '~/utils/dailyPDF/delete.server'
import { saveDailyWorkPlan } from '~/utils/dailyPDF/create.server'
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'

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

  const user = await model.user.query.getForSession({ email: email });
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
  if (!DealerInfo) {
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

    // Check if a record already exists for the user's email
    const existingDealerFees = await prisma.dealerFees.findUnique({
      where: { userEmail: userEmail },
    });
    if (existingDealerFees) {
      /* If a record exists, update it
      await prisma.dealerFees.update({
        where: { userEmail: userEmail },
        data: {
          dealer: formData.dealer,
          dealerAddress: formData.dealerAddress,
          dealerProv: formData.dealerProv,
          dealerPhone: formData.dealerPhone,
          omvicNumber: formData.omvicNumber,
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
          email: userEmail,
          destinationCharge: formData.destinationCharge,
          userFreight: formData.userFreight,
          userAdmin: formData.userAdmin,
          userEmail: formData.userEmail,
        },
      });*/
      return redirect("/welcome/quote");

    }
    if (!existingDealerFees) {
      console.log('no dealer fees something is wrong')
      await prisma.dealerFees.update({
        where: { userEmail: email },

        data: {
          dealer: formData.dealer,
          dealerAddress: formData.dealerAddress,
          dealerProv: formData.dealerProv,
          dealerPhone: formData.dealerPhone,
          omvicNumber: formData.omvicNumber,
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
    }
    return redirect("/welcome/quote");
  }
  if (DealerInfo) {
    const deFees = await prisma.dealerFeesAdmin.findUnique({
      where: { id: 1 },
    });
    const DealerFees = await prisma.dealerFees.create({


      data: {
        dealer: 'Dealer Name',
        dealerAddress: '1234 street ave',
        dealerProv: 'Toronto, ON, K1K1K1',
        dealerPhone: '416-416-4164',
        omvicNumber: formData.omvicNumber,
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

        userEmail: email,

      }
    });
    return (DealerFees) && redirect("/welcome/quote")
  }
}

export const loader = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  if (!user) { return json({ status: 302, redirect: '/login' }); };

  let deFees
  // if (!deFees) { deFees = await prisma.dealerFees.findUnique({ where: { userEmail: user?.email } }); }
  const urlSegmentsDashboard = new URL(request.url).pathname.split('/');
  const url = urlSegmentsDashboard.slice(0, 3).join('/');
  console.log(url)
  const DealerInfo = await prisma.dealerInfo.findUnique({
    where: {
      id: 1
    }
  })
  if (DealerInfo) {
    deFees = await prisma.dealerFeesAdmin.findUnique({
      where: { id: 1 },
    });
    const Dealerfees = [
      { name: "userAdmin", value: '0', placeholder: "Admin" },
      { name: "userFreight", value: '0', placeholder: "Freight" },
      { name: "userCommodity", value: '0', placeholder: "Commodity" },
      { name: "userPDI", value: '0', placeholder: "PDI" },
      { name: "userAirTax", value: '0', placeholder: "Air Tax" },
      { name: "userTireTax", value: '0', placeholder: "Tire Tax" },
      { name: "userGovern", value: '0', placeholder: "Government Fees" },
      { name: "userFinance", value: '0', placeholder: "Finance Fees" },
      { name: "destinationCharge", value: '0', placeholder: "Destination Charge" },
      { name: "userGasOnDel", value: '0', placeholder: "Gas On Delivery" },
      { name: "userMarketAdj", value: '0', placeholder: "Market Adjustment" },
      { name: "userDemo", value: '0', placeholder: "Demonstratration Fee" },
      { name: "userOMVIC", value: '60', placeholder: "OMVIC or Other" },
    ];
    const FinanceOptions = [
      { name: "userExtWarr", value: '0', placeholder: 'Extended Warranty' },
      { name: "userLoanProt", value: '0', placeholder: 'Loan Protection' },
      { name: "userGap", value: '0', placeholder: 'Gap Protection' },
      { name: "userTireandRim", value: '0', placeholder: 'Tire and Rim' },
      { name: "vinE", value: '0', placeholder: 'Vin Etching' },
      { name: "rustProofing", value: '0', placeholder: 'Under Coating' },
      { name: "userServicespkg", value: '0', placeholder: 'Service Package' },
      { name: "lifeDisability", value: '0', placeholder: 'Life and Disability' },
      { name: "userOther", value: '0', placeholder: 'Other data Package' },
    ];
    console.log(DealerInfo, deFees)
    return json({ request, user, deFees, Dealerfees, FinanceOptions });

  }
  if (!DealerInfo) {
    deFees = await prisma.dealerFees.findUnique({
      where: { userEmail: email },
    });
    if (!deFees) {
      // If no record exists, create a new one
      deFees = await prisma.dealerFees.create({
        data: {
          dealer: 'Dealer Name',
          dealerAddress: '1234 Example St',
          dealerProv: 'Ottawa, ON K1A 0B1',
          dealerPhone: '8198198194',
          omvicNumber: '1234567',
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
          email: 'email@example.com',
          destinationCharge: 0,
          userFreight: '0',
          userAdmin: '0',
          userEmail: user?.email,
        },
      });

      const Dealerfees = [
        { name: "userAdmin", value: '0', placeholder: "Admin" },
        { name: "userFreight", value: '0', placeholder: "Freight" },
        { name: "userCommodity", value: '0', placeholder: "Commodity" },
        { name: "userPDI", value: '0', placeholder: "PDI" },
        { name: "userAirTax", value: '0', placeholder: "Air Tax" },
        { name: "userTireTax", value: '0', placeholder: "Tire Tax" },
        { name: "userGovern", value: '0', placeholder: "Government Fees" },
        { name: "userFinance", value: '0', placeholder: "Finance Fees" },
        { name: "destinationCharge", value: '0', placeholder: "Destination Charge" },
        { name: "userGasOnDel", value: '0', placeholder: "Gas On Delivery" },
        { name: "userMarketAdj", value: '0', placeholder: "Market Adjustment" },
        { name: "userDemo", value: '0', placeholder: "Demonstratration Fee" },
        { name: "userOMVIC", value: '60', placeholder: "OMVIC or Other" },
      ];
      const FinanceOptions = [
        { name: "userExtWarr", value: '0', placeholder: 'Extended Warranty' },
        { name: "userLoanProt", value: '0', placeholder: 'Loan Protection' },
        { name: "userGap", value: '0', placeholder: 'Gap Protection' },
        { name: "userTireandRim", value: '0', placeholder: 'Tire and Rim' },
        { name: "vinE", value: '0', placeholder: 'Vin Etching' },
        { name: "rustProofing", value: '0', placeholder: 'Under Coating' },
        { name: "userServicespkg", value: '0', placeholder: 'Service Package' },
        { name: "lifeDisability", value: '0', placeholder: 'Life and Disability' },
        { name: "userOther", value: '0', placeholder: 'Other data Package' },
      ];

      return json({ request, user, deFees, Dealerfees, FinanceOptions });
    }
    else {
      return DealerInfo

    }
    deFees = await prisma.dealerFees.findUnique({
      where: { userEmail: user?.email },
    });
    return null
  }
}

export const meta: MetaFunction = () => {
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
    <Form method="post" className="">
      <div className="grid grid-cols-1 gap-4 mx-auto mt-5">
        <div className=" mt-5">
          <h2 className="text-2xl font-thin">
            QUICK RUNDOWN
          </h2>
          <Separator className="my-4" />
        </div>
        <iframe
          width="750"
          height="750"
          src="https://www.youtube.com/embed/u1MLfrFzCBo"
          title="YouTube video player"
          frameBorder="0"
          className='z-47 my-auto mx-auto'
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
      </div>
      <div className="grid grid-cols-1 gap-4 mx-auto">
        {/* Row 1 */}
        <div className=" p-4">
          <div className=" mt-5">
            <h2 className="text-2xl font-thin">
              DEALER FEES
            </h2>
            <p className="text-sm text-slate1">
              This is where you can change values like freight, admin, taxes and
              such. If you don't have all this information with you, dont worry, you can always come back and update it later.
            </p>
            <Separator className="my-4" />

          </div>

          <div className="grid grid-cols-3 gap-2">
            {Dealerfees.map((fee, index) => (
              <div key={index}>
                <label className=''>{fee.placeholder}</label>
                <Input
                  name={fee.name}
                  defaultValue={fee.value}

                  className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                />
              </div>
            ))}
            <div className="">
              <label>Licensing (Required)</label>
              <Input
                defaultValue={deFees.userLicensing}
                name="userLicensing"
                className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
              />
              {errors?.userLicensing ? (
                <em className="text-[#ff0202]">{errors.userLicensing}</em>
              ) : null}
            </div>

            <div className="">
              <label>Sales tax (Required)</label>
              <Input
                defaultValue={deFees.userTax}
                name="userTax"
                className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
              />
              {errors?.userTax ? (
                <em className="text-[#ff0202]">{errors.userTax}</em>
              ) : null}
            </div>
            <div className="">
              <label>Service Labour (Required)</label>
              <Input
                defaultValue={deFees.userLabour}
                name="userLabour"
                className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#ff0202]  mx-1"
              />
              {errors?.userLabour ? (
                <em className="text-[#ff0202]">{errors.userLabour}</em>
              ) : null}
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <h2 className="text-2xl font-thin mt-4">
          OPTIONS
        </h2>
        <Separator className="mb-4" />
        <div className="p-4 grid gap-2">
          <div className="h-[250px] grid grid-cols-3 gap-2 ">
            {FinanceOptions.map((option, index) => (
              <div key={index}>
                <label className='mt-2'>{option.placeholder}</label>
                <Input
                  name={option.name}
                  defaultValue={option.value}
                  className="bg-myColor-900 px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate4 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150
                 focus:outline-none  focus:text-[#02a9ff]  mx-1"
                />
              </div>
            ))}
            <Input type='hidden'
              defaultValue={user.email}
              name="email"
            />
            <Toast.Provider swipeDirection="right">
              <Button className="bg-[#02a9ff] mb-10 w-[75px] ml-2  mr-2 cursor-pointer text-slate1 active:bg-[#0176b2] font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150" type="submit"
                onClick={() => {
                  setOpen(false);
                  window.clearTimeout(timerRef.current);
                  timerRef.current = window.setTimeout(() => {
                    setOpen(true);
                  }, 100);
                }}
              >
                Update
              </Button>
              <Toast.Root
                className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                open={open}
                onOpenChange={setOpen}
              >
                <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                  Dealer Fees Updated.
                </Toast.Title>
                <Toast.Description asChild>
                </Toast.Description>
              </Toast.Root>
              <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
            </Toast.Provider>
          </div>
        </div>
      </div>
    </Form>
  )
}


export const asdsaloader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  let deFees = await prisma.dealerFees.findUnique({
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
