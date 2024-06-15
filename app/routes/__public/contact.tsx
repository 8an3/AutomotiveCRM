import { Form, useLoaderData } from '@remix-run/react'
import { Button, } from '~/components/ui/index'
import { json, type ActionFunction, type DataFunctionArgs, type MetaFunction } from '@remix-run/node'

import { Bird, Rabbit, Turtle } from "lucide-react"

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



export default function Component() {
  return (
    <div
      className="relative  flex-col items-start gap-8 md:flex pl-3 pr-3 md:w-[30%] text-foreground mx-auto"
    >
      <Form method='post' action='/send/contactPublic' className="grid w-full items-start gap-6">

        <fieldset className="grid gap-6 rounded-lg border p-4 border-border  bg-background">
          <legend className="-ml-1 px-1 text-sm font-medium">Contact</legend>
          <div className="grid gap-3">
            <Label htmlFor="role">First Name</Label>
            <Input name="userFname" placeholder='John' className="bg-background text-foreground  border-border " />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Last Name</Label>
            <Input name="userFname" placeholder='Wick' className="bg-background text-foreground  border-border " />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Email</Label>
            <Input name="useremail" placeholder='johnwick@thecontinental.com' className="bg-background text-foreground  border-border " />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="content">Content</Label>
            <TextArea
              id="content"
              name="customContent"
              placeholder="Type your message here..."
              className="bg-background min-h-[9.5rem] text-foreground  border-border"
            />
          </div>
          <Button name='intent' value='contactForm' size='sm' className='mx-auto bg-primary text-foreground  mt-3'>
            Submit
          </Button>
        </fieldset>
      </Form>
    </div>
  )
}
