import { Form, useLoaderData } from '@remix-run/react'
import { Button, Input, TextArea, Textarea } from '~/components/ui/index'
import ContactForm from '~/components/shared/contactForm';
import ScriptForm from '~/components/shared/scriptsForm';
import { json, type ActionFunction, type DataFunctionArgs, type MetaFunction } from '@remix-run/node'

import { model } from '~/models'
import financeFormSchema from '~/overviewUtils/financeFormSchema';

import { prisma } from "~/libs";
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'




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

export default function ProfileForm() {
  const { user } = useLoaderData()
  //console.log('contact us', user)
  const name = user.name
  const email = user.email
  return (

    <>
      <div className="border-none p-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-thin">
              CONTACT
            </h2>
            <p className="text-sm text-surface-500 dark:text-black">
              If a feature could help you sell more, but we dont have it? Let us
              know, we can implement it.
            </p>
          </div>
        </div>
        <hr className="solid" />
        <Form method="post" action='/emails/send/contact'>
          <div className="grid inputSet mt-[50px]  contactUsInputSection">
            <Form method="post" action="/emails/send/custom">
              <Input name="userFname" placeholder='John' />
              <Input name="userFname" placeholder='Doe' />
              <Input name="useremail" placeholder='johndoe@gmail.com' />

              <TextArea
                placeholder="Type your message here."
                name="customContent"
                className="h-[200px]"
              />

              <Button className="w-full mt-3 cursor-pointer " type="submit" name="intent" value="contactForm">
                Email
              </Button>
            </Form>
          </div>


        </Form>
      </div>
    </>
  )
}
