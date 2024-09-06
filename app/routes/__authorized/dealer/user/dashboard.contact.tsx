import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Button, ButtonLoading, Checkbox } from "~/components/ui/index";
import {
  json,
  type ActionFunction,
  type DataFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";

import {
  TextArea,
  Select,
  Input,
  SelectContent,
  Label,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "~/components/";
import { model } from "~/models";
import financeFormSchema from "~/overviewUtils/financeFormSchema";

import { prisma } from "~/libs";
import { getSession as sessionGet, getUserByEmail } from "~/utils/user/get";
import { toast } from "sonner";
import CheckingDealerPlan from "~/routes/__customerLandingPages/welcome/contactUsEmail";

export async function loader({ request, params, placeholder }) {
  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: " Contact Us | Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData());
  console.log(formPayload, "before dealerlead is created");
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

      generatedFrom: "Contact us via dealer pricing",
      infoBeforePurchase: formPayload.infoBeforePurchase
        ? formPayload.infoBeforePurchase
        : false,
      justlooking: formPayload.justlooking ? formPayload.justlooking : false,
      demoBeforePurchase: formPayload.demoBeforePurchase
        ? formPayload.demoBeforePurchase
        : false,
      seekingAppointment: formPayload.seekingAppointment
        ? formPayload.seekingAppointment
        : false,

      timeToPurchase:
        Boolean(formPayload.asap) === true
          ? "ASAP"
          : Boolean(formPayload.justlooking) === true
          ? "Just looking"
          : Boolean(formPayload.infoBeforePurchase) === true
          ? "Haven't made a descion yet, if I make one, but I require more information."
          : Boolean(formPayload.seekingAppointment) === true
          ? " Looking to set up an appointment with someone to discuss everything."
          : "Did not make a decision",

      triedDemo: formPayload.triedDemo,
    },
  });

  const customer = {
    firstName: formPayload.firstName,
    lastName: formPayload.lastName,
    email: formPayload.email,
    message: formPayload.message,
    reason: formPayload.reason,
    purchaseTime: formPayload.purchaseTime,
  };
  console.log(customer);
  const sendEmail = await CheckingDealerPlan(customer);
  return json({ sendEmail });
};

export default function Component() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="relative  mx-auto flex-col items-start gap-8 pl-3 pr-3 text-foreground md:flex md:w-[500px]">
      <Form method="post" className="mb-5 grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border border-border bg-background  p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Contact</legend>
          <div className="grid gap-3">
            <Label htmlFor="role">First Name</Label>
            <Input
              name="firstName"
              placeholder="John"
              className="border-border bg-background  text-foreground "
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Last Name</Label>
            <Input
              name="lastName"
              placeholder="Wick"
              className="border-border bg-background  text-foreground "
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Email</Label>
            <Input
              name="email"
              placeholder="johnwick@thecontinental.com"
              className="border-border bg-background  text-foreground "
            />
          </div>
          <p className="text-left text-foreground">
            To serve you better, select the reason for reaching out to
            us today. If there isn't an option that suits your needs, leave a quick message in the
            box describing what your looking for / need.
          </p>
          <div className="flex items-center space-x-2">
            <Select name="reason">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What can we do to serve you?" />
              </SelectTrigger>
              <SelectContent className='border-border'>
                <SelectGroup>
                  <SelectLabel>What can we do to serve you?</SelectLabel>
                  <SelectItem value="Requesting a demo of the platform before purchase">
                    Requesting a demo of the platform before purchase.
                  </SelectItem>
                  <SelectItem value="Just looking...">
                    Just looking...
                  </SelectItem>
                  <SelectItem value="Haven't made a descion yet, if I make one, but I require more information.">
                    Haven't made a descion yet, if I make one, but I require
                    more information.
                  </SelectItem>
                  <SelectItem value="Looking to set up an appointment with someone to discuss my needs.">
                    Looking to set up an appointment with someone to discuss my
                    needs.
                  </SelectItem>
                  <SelectItem value="Have a question about custom components / using one of your components on my platform.">
                    Have a question about custom components / using one of your
                    components on my platform.
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Select name="purchaseTime">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Purchase timeframe, if any" />
              </SelectTrigger>
              <SelectContent className='border-border'>
                <SelectGroup>
                  <SelectItem value="ASAP">ASAP</SelectItem>
                  <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                  <SelectItem value="2-4 months">2-4 months</SelectItem>
                  <SelectItem value="5 + months">5 + months</SelectItem>
                  <SelectItem value="Not interested">Not interested</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="content">Message</Label>
            <TextArea
              name="message"
              placeholder="Type your message here..."
              className="min-h-[9.5rem] border-border bg-background  text-foreground"
            />
          </div>

          <ButtonLoading
            onClick={() =>
              toast.success("Thank you for your inquiry!", {
                description: "Someone will respond as soon as possible.",
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
  );
}
