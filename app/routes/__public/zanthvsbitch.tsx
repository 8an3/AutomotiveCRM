import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate } from '@remix-run/react';
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components';
import first from '~/courtcase/1.jpg'
import second from '~/courtcase/2.jpg'
import third from '~/courtcase/3.jpg'
import forth from '~/courtcase/4.jpg'
import fith from '~/courtcase/5.jpg'
import sixth from '~/courtcase/6.jpg'
import seventh from '~/courtcase/7.jpg'
import eight from '~/courtcase/8.jpg'



export async function loader({ request, params }: LoaderAction) {
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  return json({ user });
};

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  return json({ user });
};

export default function NewFile() {
  const { user } = useLoaderData()



  return (
    <div>
      <Tabs defaultValue="to-do" className="w-[95%] md:w-[800px] mx-auto my-auto">
        <TabsList className=" ">
          <TabsTrigger value="to-do">To-Do</TabsTrigger>
          <TabsTrigger value="ques for duty counc">Questions For Duty Council</TabsTrigger>
          <TabsTrigger value="response to answer">Responses</TabsTrigger>
          <TabsTrigger value="Reply To Reply To Answer">Reply To Reply To Answer</TabsTrigger>
          <TabsTrigger value="Documents">Documents</TabsTrigger>
          <TabsTrigger value="notice of motion">Notice of Motion</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        <TabsContent value="to-do">

        </TabsContent>
        <TabsContent value="ques for duty counc">

        </TabsContent>
        <TabsContent value="response to answer">
          <Card className='max-h-[800px] h-[800px] overflow-y-scroll'>
            <CardHeader>
              <CardTitle>Responses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">

            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Reply To Reply To Answer">
          <Card className='max-h-[800px] h-[800px] overflow-y-scroll'>
            <CardHeader>
              <CardTitle>Responses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">

            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Documents">
          <Card className='max-h-[800px] h-[800px]'>
            <CardContent className="space-y-2">

              <div className="relative rounded-xl overflow-auto">
                <div className="flex ml-[50%] items-end justify-start pt-10 mb-6">
                  <div className="ml-2 rounded font-mono text-[0.625rem] leading-6 px-1.5 ring-1 ring-inset bg-indigo-50 text-indigo-600 ring-indigo-600 dark:bg-indigo-500 dark:ring-0 dark:text-white dark:highlight-white/10">snap point</div>
                  <div className="absolute top-0 bottom-0 left-1/2 border-l border-indigo-500"></div>
                </div>
                <div className="relative w-full flex gap-6 snap-x overflow-x-auto pb-14">
                  <div className="snap-center shrink-0">
                    <div className="shrink-0 w-4 sm:w-48"></div>
                  </div>
                  <div className="snap-normal snap-center shrink-0 first:pl-8 last:pr-8">
                    <div className='grid grid-cols-1'>
                      <img className="shrink-0 w-[600px] h-[750px] object-cover rounded-lg shadow-xl bg-white" src={first} />
                    </div>
                  </div>
                  <div className="snap-normal snap-center shrink-0 first:pl-8 last:pr-8">
                    <div className='grid grid-cols-1'>
                      <img className="shrink-0 w-[700px] h-[300px] object-cover rounded-lg shadow-xl bg-white" src={second} />
                      <img className="shrink-0 w-[700px] h-[300px]  mt-5 object-cover rounded-lg shadow-xl bg-white" src={third} />
                    </div>
                  </div>
                  <div className="snap-normal snap-center shrink-0 first:pl-8 last:pr-8">
                    <div className='grid grid-cols-1'>
                      <img className="shrink-0 w-[700px] h-[300px] object-cover rounded-lg shadow-xl bg-white" src={forth} />
                      <img className="shrink-0 w-[700px] h-[300px] mt-5 object-cover rounded-lg shadow-xl bg-white" src={fith} />
                    </div>
                  </div>
                  <div className="snap-normal snap-center shrink-0 first:pl-8 last:pr-8">
                    <img className="shrink-0 w-[600px] h-[750px] object-cover rounded-lg shadow-xl bg-white" src={sixth} />
                  </div>
                  <div className="snap-normal snap-center shrink-0 first:pl-8 last:pr-8">
                    <img className="shrink-0 w-[600px] h-[750px] object-cover rounded-lg shadow-xl bg-white" src={seventh} />
                  </div>
                  <div className="snap-normal snap-center shrink-0 first:pl-8 last:pr-8">
                    <img className="shrink-0 w-[600px] h-[750px] object-cover rounded-lg shadow-xl bg-white" src={eight} />
                  </div>
                  <div className="snap-center shrink-0">
                    <div className="shrink-0 w-4 sm:w-48"></div>
                  </div>
                </div>
              </div>





            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notice of motion">

        </TabsContent>
        <TabsContent value="other">

        </TabsContent>

      </Tabs>
    </div>
  )
}
