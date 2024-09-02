import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { Button, ButtonLoading, Checkbox, } from '~/components/ui/index'
import { json, type ActionFunction, type DataFunctionArgs, type MetaFunction } from '@remix-run/node'


import {
  TextArea, Select, Input,
  SelectContent, Label,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/"
import { model } from '~/models'
import financeFormSchema from '~/overviewUtils/financeFormSchema';

import { prisma } from "~/libs";
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'
import { toast } from 'sonner'
import CheckingDealerPlan from '../__customerLandingPages/welcome/contactUsEmail'




export async function loader({ request, params, placeholder }) {
  return null
}


export const meta: MetaFunction = () => {
  return [
    { title: ' Contact Us | Dealer Sales Assistant' },
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


export const action: ActionFunction = async ({ request, }) => {
  const formPayload = Object.fromEntries(await request.formData())
  console.log(formPayload, 'before dealerlead is created')
  const lead = await prisma.dSALeads.create({
    data: {
      dealerName: formPayload.dealerName,
      dealerAddress: formPayload.dealerAddress,
      dealerCity: formPayload.dealerCity,
      dealerProv: formPayload.dealerProv,
      dealerPostal: formPayload.dealerPostal,
      dealerPhone: formPayload.dealerPhone,
      ownerName: formPayload.ownerName,
      ownerEmail: formPayload.ownerEmail,
      ownerPhone: formPayload.ownerPhone,
      adminName: formPayload.adminName,
      adminEmail: formPayload.adminEmail,
      adminPhone: formPayload.adminPhone,
      dealerEtransferEmail: formPayload.dealerEtransferEmail,
      message: formPayload.message,

      generatedFrom: 'Contact us via dealer pricing',
      infoBeforePurchase: formPayload.infoBeforePurchase ? formPayload.infoBeforePurchase : false,
      justlooking: formPayload.justlooking ? formPayload.justlooking : false,
      demoBeforePurchase: formPayload.demoBeforePurchase ? formPayload.demoBeforePurchase : false,
      seekingAppointment: formPayload.seekingAppointment ? formPayload.seekingAppointment : false,

      timeToPurchase: Boolean(formPayload.asap) === true ? 'ASAP' :
        Boolean(formPayload.justlooking) === true ? 'Just looking' :
          Boolean(formPayload.infoBeforePurchase) === true ? "Haven't made a descion yet, if I make one, but I require more information." :
            Boolean(formPayload.seekingAppointment) === true ? " Looking to set up an appointment with someone to discuss everything." :
              "Did not make a decision"

      ,
      triedDemo: formPayload.triedDemo,
    }
  })


  const customer = {
    firstName: formPayload.firstName,
    lastName: formPayload.lastName,
    email: formPayload.email,
    message: formPayload.message,
  }
  console.log(customer)
  const sendEmail = await CheckingDealerPlan(customer)
  return json({ sendEmail })
}

export default function Component() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div
      className="relative  flex-col items-start gap-8 md:flex pl-3 pr-3 md:w-[500px] text-foreground mx-auto"
    >
      <Form method='post' className="grid w-full items-start gap-6 mb-5">

        <fieldset className="grid gap-6 rounded-lg border p-4 border-border  bg-background">
          <legend className="-ml-1 px-1 text-sm font-medium">Contact</legend>
          <div className="grid gap-3">
            <Label htmlFor="role">First Name</Label>
            <Input name="firstName" placeholder='John' className="bg-background text-foreground  border-border " />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Last Name</Label>
            <Input name="lastName" placeholder='Wick' className="bg-background text-foreground  border-border " />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Email</Label>
            <Input name="email" placeholder='johnwick@thecontinental.com' className="bg-background text-foreground  border-border " />
          </div>
          <p className='text-left text-foreground'>To serve you better, check off any / all that apply, if they do, and leave a quick message in the box describing what your looking for / need.</p>
          <div className="flex items-center space-x-2">
            <Checkbox name="demoBeforePurchase" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Requesting demo before purchase.
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="justlooking" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Just looking...
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="infoBeforePurchase" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Haven't made a descion yet, if I make one, but I require more information.
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="seekingAppointment" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Looking to set up an appointment with someone to discuss everything.
            </label>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="content">Message</Label>
            <TextArea
              name="message"
              placeholder="Type your message here..."
              className="bg-background min-h-[9.5rem] text-foreground  border-border"
            />
          </div>
          <p className='text-left text-foreground'>Exepected purchase timeframe.</p>
          <div className="flex items-center space-x-2">
            <Checkbox name="asap" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ASAP
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="twoToFour" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              2-4 weeks
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="twoPlusMonths" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              2-4 months
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox name="twoPlusMonths" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              5 + months
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="notInterested" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Not interested
            </label>
          </div>
          <ButtonLoading
            onClick={() =>
              toast.success("Thank you for your inquiry!", {
                description: 'Someone will respond as soon as possible.',
              })
            }
            size="lg"
            type="submit"
            isSubmitting={isSubmitting}
            loadingText="Sending email now... "
            className="ml-auto mt-5 w-auto cursor-pointer border-border text-foreground hover:text-primary"
          >
            Submit
          </ButtonLoading>

        </fieldset>
      </Form>
    </div>
  )
}
