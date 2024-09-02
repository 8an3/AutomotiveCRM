import { Button, Input } from "~/components";
import { ActionFunction, json, redirect } from "@remix-run/node";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { prisma } from "~/libs";
import { Form } from "@remix-run/react";

//export let links: LinksFunction = () => {  return [{ rel: "stylesheet", href: styles }];};

export default function DealerQuestionnaire() {
  return (
    <div className="bg-white my-auto mx-auto font-sans px-2 text-black mt-[40px]">
      <Form method='post' action='/questionnaire/completed'>
        <div className="border border-solid border-[#eaeaea] rounded-md my-[40px] mx-auto p-[20px] max-w-[465px] rounded-md">
          <h1 className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            Dealer Onboarding
          </h1>
          <p className="text-black text-[14px] leading-[24px]">
            For now we just need the basics to get everything set up...
          </p>
          <section>
            <hr className='text-center w-[90%] my-[16px] mx-auto border-t-[#e6e6e6]' />

            <p className='my-[15px] mx-[10px] font-[24px] font-[#262626]'> Dealer Information</p>
            <hr className='text-center w-[90%] my-[16px] mx-auto border-t-[#e6e6e6]' />
            <div className="relative mt-[25px]">
              <Input
                type="text"
                name='dealerName'
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">  Name - Dealer</label>
            </div>
            <div className="relative mt-5">
              <Input
                type="text"
                name='dealerAddress'
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> Address - Dealer</label>
            </div>
            <div className="relative mt-5">
              <Input
                type="text"
                name='dealerCity'
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> City</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='dealerProv'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Province</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='dealerPostal'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Postal Code</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='dealerPhone'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> Phone Number - Dealer</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='ownerName'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">First and last name - Owner</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='ownerEmail'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> Email - Owner</label>
            </div>

            <div className="relative mt-5">
              <Input
                name='ownerPhone'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> Phone - Owner</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='adminName'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">First and last name - Admin (or IT dept manager/lead)</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='adminEmail'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> Email - Admin</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='adminPhone'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  "> Phone - Admin</label>
            </div>
            <div className="relative mt-5">
              <Input
                name='dealerEtransferEmail'
                type="text"
                className="w-full  bg-[#ffffff]   text-black border-[#eaeaea]"
              />
              <label className=" text-[16px] leading-[24px] absolute left-3  rounded-full -top-3 px-2 bg-[#ffffff] peer-placeholder-shown:top-2.5  ">Dealer Etransfer Email (If your dealer uses etransfers to collect payments/deposits)</label>
            </div>
            <hr className='text-center w-[90%] my-[16px] mx-auto border-t-[#e6e6e6]' />
            <div className="flex">
              <p className="text-black text-[14px] leading-[24px]">
                Your new CRM will be up shortly, and will reach out the moment it is ready for you.
              </p>
            </div>

            <p className="text-black text-[14px] leading-[24px]">
              Again, thank you for your business, and I hope this brings you as
              much of an increase in business as it did for us,
              <br />
              DSA Team
              <br />
            </p>
          </section>
          <hr className='text-center w-[90%] my-[16px] mx-auto border-t-[#e6e6e6]' />
          <section className="text-center mt-[32px] mb-[32px]">
            <Button
              type='submit'
              name='intent'
              value='createDealer'

              className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
            >
              Complete
            </Button>
          </section>
        </div>
      </Form>
      <hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
      <p className="text-[#666666] text-[12px] leading-[24px]">
        © Dealer Sales Assistant <br />
        613-898-0992 <br />
        skylerzanth@gmail.com <br />
        15490 Ashburn Rd, Berwick, ON, K0C 1G0, Canada
      </p>
    </div>
  );
}
export async function loader() {
  return null
}




