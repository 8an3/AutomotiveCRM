import { LinksFunction, ActionFunction } from "@remix-run/node";
import { Input, TextArea, Button } from "~/components/ui";
import { json } from "@remix-run/node";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { prisma } from "~/libs";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import customer from '~/styles/customer.css'
import { toast } from "sonner";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: customer },
];
export default function DealerCompleted() {
  const { dealer, finance, salesRep } = useLoaderData()
  const [searchParams] = useSearchParams();
  const financeId = searchParams.get("financeId");
  const phone = finance.phone || ''
  const name = finance.firstName + ' ' + finance.lastName || ''
  const city = finance.city || ''
  const email = finance.email || ''
  const address = finance.address || ''
  const province = finance.province || ''
  const postalCode = finance.postalCode || ''
  return (
    <div className="bg-white my-auto mx-auto font-sans px-2 text-black h-[100vh] max-h-screen overflow-y-scroll">
      <Form method='post' >
        <div className="border mt-[25px] border-solid border-[#eaeaea] rounded-md my-[40px] mx-auto p-[20px] max-w-[465px]">
          <h1 className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            To start your finance application, please fill out the following questions:
          </h1>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Personal Information</p>
          <hr className='text-center w-[90%] mb-[16px] mx-auto border-t-[#e6e6e6]' />
          <div className="relative mt-[25px]">
            <Input
              type="text"
              defaultValue={name}
              name='fullName'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  "> Full Name</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='dob'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  "> Date of Birth</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='sin'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">  Social Insurance Number</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              defaultValue={phone}
              name='phone'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Phone Number</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              defaultValue={email}
              name='email'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Email Address</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Current Address</p>
          <div className="relative mt-5">
            <Input
              type="text"
              name='streetAddress'
              defaultValue={address}

              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Street Address</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='city'
              defaultValue={city}

              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">City</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='province'
              defaultValue={province}
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Province</label>
          </div>

          <div className="relative mt-5">
            <Input
              type="text"
              name='postalCode'
              defaultValue={postalCode}
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Postal Code</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='addressDuration'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Duration at Current Address</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Employment Information</p>
          <hr className='text-center w-[90%] mb-[16px] mx-auto border-t-[#e6e6e6]' />
          <div className="relative mt-5">
            <Input
              type="text"
              name='employer'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Current Employer</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='job'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Job Title</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employmentStatus'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Employment Status</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Employment Information</p>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerAddress'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Employer Address</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerCity'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Employer City</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerProvince'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Employer Province</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerPostal'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Employer Postal Code</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerPhone'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Employer Phone Number</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employmentDuration'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Duration of Employment</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='monthlyGrossIncome'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Monthly Gross Income</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Banking Information</p>
          <hr className='text-center w-[90%] mb-[16px] mx-auto border-t-[#e6e6e6]' />
          <div className="relative mt-5">
            <Input
              type="text"
              name='bankName'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Bank Name</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='branchAddress'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Branch Address</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Current Monthly Housing Expenses</p>

          <div className="relative mt-5">
            <Input
              type="text"
              name='mortgagePayment'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Rent/Mortgage Payment</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='utilities'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Utilities</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='propertyTaxes'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Property Taxes</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Outstanding Loans and Credit Card Debts</p>

          <div className="relative mt-5">
            <Input
              type="text"
              name='loanType'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Type of Loan/Debt</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='loanMonthlyPayment'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Monthly Payment</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='remainingBalance'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Remaining Balance</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Additional Information You Would Like To Add</p>
          <hr className='text-center w-[90%] mb-[16px] mx-auto border-t-[#e6e6e6]' />
          <div className="relative mt-5">
            <TextArea
              name='notes'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className="   text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-black  ">Notes</label>
          </div>
          <input type='hidden' name='financeId' value={financeId} />
          <input type='hidden' name='userEmail' value={salesRep.email} />
          <input type='hidden' name='name' value={finance.name} />
          <input type='hidden' name='model' value={finance.model} />
          <input type='hidden' name='brand' value={finance.brand} />
          <input type='hidden' name='year' value={finance.year} />
          <input type='hidden' name='email' value={finance.email} />
          <Button
            type='submit'
            size='sm'
            className='bg-[#1c69d4] text-white mt-5' variant="outline"
            onClick={() => {
              toast('Thank-you for filling out the application, someone from our finance deptarment will be in contact with you shortly.')
            }}
          >
            Confirm
          </Button>
        </div>
      </Form>
      <hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full mt-auto" />
      <p className="text-[#666666] text-[12px] leading-[24px]">
        © {dealer.dealerName} <br />
        {dealer.dealerPhone} <br />
        {dealer.dealerEmailAdmin} <br />
        {dealer.dealerAddress}, {dealer.dealerCity}, {dealer.dealerProv}, {dealer.dealerPostal}, Canada
      </p>
    </div>
  );
}
export async function loader({ request, params }) {
  const url = new URL(request.url);
  const financeId = url.searchParams.get("financeId");
  const dealer = await prisma.dealer.findUnique({ where: { id: 1 } })
  const finance = await prisma.finance.findUnique({ where: { id: financeId } })
  const salesRep = await prisma.user.findUnique({ where: { email: finance?.userEmail } })
  console.log(dealer, finance, salesRep, ' dealer, finance, salesRep')
  return json({ dealer, finance, salesRep })
}

export async function action({ request, }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  let formData = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent
  const clientfile = await prisma.clientfile.findUnique({ where: { email: formData.email } })
  const notifications = await prisma.notificationsUser.create({
    data: {
      userEmail: String(formData.userEmail),
      title: 'New Finance App!',
      content: `${formData.name} completed an app on ${formData.year} ${formData.brand} ${formData.model}`,
      type: "updates",
      financeId: String(formData.financeId),
      clientfileId: String(clientfile.id),
    }
  })

  const financeApp = await prisma.financeApplication.create({
    data: {
      financeId: formData.financeId,
      clientfileId: clientfile.id,
      fullName: formData.fullName,
      dob: formData.dob,
      sin: formData.sin,
      phone: formData.phone,
      email: formData.email,
      streetAddress: formData.streetAddress,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      addressDuration: formData.addressDuration,
      employer: formData.employer,
      job: formData.job,
      employmentStatus: formData.employmentStatus,
      employerAddress: formData.employerAddress,
      employerCity: formData.employerCity,
      employerProvince: formData.employerProvince,
      employerPostal: formData.employerPostal,
      employerPhone: formData.employerPhone,
      employmentDuration: formData.employmentDuration,
      monthlyGrossIncome: formData.monthlyGrossIncome,
      bankName: formData.bankName,
      branchAddress: formData.branchAddress,
      mortgagePayment: formData.mortgagePayment,
      utilities: formData.utilities,
      propertyTaxes: formData.propertyTaxes,
      loanType: formData.loanType,
      loanMonthlyPayment: formData.loanMonthlyPayment,
      remainingBalance: formData.remainingBalance,
      userEmail: formData.userEmail,
      finMgrEmail: formData.finMgrEmail,
      notes: formData.notes,
    }
  })
  console.log(notifications, clientfile, financeApp, 'financeapp')

  return json({ notifications, clientfile, financeApp })
}

