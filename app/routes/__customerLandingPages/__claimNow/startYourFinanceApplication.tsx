import { LinksFunction, ActionFunction } from "@remix-run/node";
import { Input, TextArea, Button } from "~/components/ui";
import { json } from "@remix-run/node";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { prisma } from "~/libs";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import React from "react";
import customer from '~/styles/customer.css'
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
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: customer },
];
export default function DealerCompleted() {
  const { dealer, finance } = useLoaderData()
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
          <input type='hidden' name='financeId' defaultValue={finance.id} />
          <div className="relative mt-[25px]">
            <Input
              type="text"
              defaultValue={name}
              name='fullName'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> Full Name</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='dob'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> Date of Birth</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='sin'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">  Social Insurance Number</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              defaultValue={phone}
              name='phone'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Phone Number</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              defaultValue={email}
              name='email'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Email Address</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Current Address</p>
          <div className="relative mt-5">
            <Input
              type="text"
              name='streetAddress'
              defaultValue={address}

              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Street Address</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='city'
              defaultValue={city}

              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">City</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='province'
              defaultValue={province}
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Province</label>
          </div>

          <div className="relative mt-5">
            <Input
              type="text"
              name='postalCode'
              defaultValue={postalCode}
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Postal Code</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='addressDuration'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Duration at Current Address</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Employment Information</p>
          <hr className='text-center w-[90%] mb-[16px] mx-auto border-t-[#e6e6e6]' />
          <div className="relative mt-5">
            <Input
              type="text"
              name='employer'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Current Employer</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='job'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Job Title</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employmentStatus'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Employment Status</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Employment Information</p>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerAddress'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Employer Address</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerCity'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Employer City</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerProvince'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Employer Province</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerPostal'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Employer Postal Code</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employerPhone'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Employer Phone Number</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='employmentDuration'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Duration of Employment</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='monthlyGrossIncome'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Monthly Gross Income</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Banking Information</p>
          <hr className='text-center w-[90%] mb-[16px] mx-auto border-t-[#e6e6e6]' />
          <div className="relative mt-5">
            <Input
              type="text"
              name='bankName'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Bank Name</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='branchAddress'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Branch Address</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Current Monthly Housing Expenses</p>

          <div className="relative mt-5">
            <Input
              type="text"
              name='mortgagePayment'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Rent/Mortgage Payment</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='utilities'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Utilities</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='propertyTaxes'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Property Taxes</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Outstanding Loans and Credit Card Debts</p>

          <div className="relative mt-5">
            <Input
              type="text"
              name='loanType'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Type of Loan/Debt</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='loanMonthlyPayment'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Monthly Payment</label>
          </div>
          <div className="relative mt-5">
            <Input
              type="text"
              name='remainingBalance'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Remaining Balance</label>
          </div>
          <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'>Additional Information You Would Like To Add</p>
          <hr className='text-center w-[90%] mb-[16px] mx-auto border-t-[#e6e6e6]' />
          <div className="relative mt-5">
            <TextArea
              name='notes'
              className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
            />
            <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Notes</label>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size='sm' className='bg-[#1c69d4] text-white mt-5' variant="outline">Submit Application</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-[#ffffff]'>
              <AlertDialogHeader>
                <AlertDialogTitle>Congratulations on taking the first step!</AlertDialogTitle>
                <AlertDialogDescription>
                  Thank-you for completing the finance application someone will be in contact with you shortly
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='text-white'>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <Button
                    type='submit'
                    size='sm'
                    className='bg-[#1c69d4] text-white mt-5' variant="outline">
                    Confirm
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
  return json({ dealer, finance })
}

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  let formData = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent
  if (intent === 'createDealer') {
    const dealer = await prisma.dealer.create({
      data: {
        dealerName: formData.dealerName,
        dealerAddress: formData.dealerAddress,
        dealerCity: formData.dealerCity,
        dealerProv: formData.dealerProv,
        dealerPostal: formData.dealerPostal,
        dealerPhone: formData.dealerPhone,
        dealerEmail: formData.dealerEmail,
        dealerContact: formData.dealerContact,
        dealerAdminContact: formData.dealerAdminContact,
        dealerEmailAdmin: formData.dealerEmailAdmin,
        dealerEtransferEmail: formData.dealerEtransferEmail,
      }
    })
    return json({ dealer })
  }

  return null
}

