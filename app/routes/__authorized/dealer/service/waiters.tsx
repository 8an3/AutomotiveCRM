import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { type LinksFunction, type LoaderFunction, type ActionFunction, json, redirect, } from '@remix-run/node'
import { useLoaderData, Link, useNavigate, useSubmit, useFetcher, useSearchParams, Form } from '@remix-run/react'
import { prisma } from "~/libs";

export default function Waiters() {
  const { user, waiters, inWorks, completed } = useLoaderData();
  let fetcher = useFetcher();
  const navigate = useNavigate()
  const options2 = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return (
    <div className='grid grid-cols-3 text-foreground mt-[5px]'>
      <Card className='m-3 ml-5'>
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <CardTitle className='flex-col'>
            <p>
              Waiters
            </p>
            <p className='text-muted-foreground mt-2'>Select the next one on the list.</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 t h-auto max-h-[850px] overflow-y-auto">
          <ul className="grid gap-3 mt-3 ">
            {waiters && waiters.map((result, index) => {
              return (
                <li key={index} className="p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-[6px]" onClick={() => {
                  const formData = new FormData();
                  formData.append("workOrderId", result.workOrderId);
                  formData.append("userEmail", user.email);
                  formData.append("userName", user.username);
                  formData.append("intent", 'claimWaiter');
                  fetcher.submit(formData, { method: "post", });
                }}>
                  <div className="font-medium flex-col">
                    <p className=' text-left'>{result.Clientfile.name}</p>
                    <div className='flex justify-between items-center'>
                      <p className='text-left'>Unit: {result.unit}</p>
                      <p className='text-muted-foreground text-right'>VIN: {result.vin}</p>
                    </div>

                    <div className='flex justify-between items-center'>
                      <p className='text-muted-foreground  text-left'>Mileage: {result.mileage}</p>
                      <p className='text-muted-foreground text-right'>Tag: {result.tag}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-muted-foreground  text-left'>Location: {result.location}</p>
                      <p className='text-muted-foreground text-right'>Writer: {result.writer}</p>
                    </div>
                    <p className='text-muted-foreground text-left'>Order Created @: {new Date(result.createdAt).toLocaleDateString('en-US', options2)}</p>

                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
      <Card className='m-3 '>
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <CardTitle className='flex-col'>
            <p>
              In Works
            </p>
            <p className='text-muted-foreground mt-2'>Currently being worked on.</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 t h-auto max-h-[850px] overflow-y-auto">
          <ul className="grid gap-3 mt-3 ">
            {inWorks && inWorks.map((result, index) => {
              return (
                <li key={index} className="p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-[6px]" onClick={() => {
                  navigate(`/dealer/service/technician/workOrder/${result.workOrderId}`)
                }}>
                  <div className="font-medium flex-col">
                    <div className='flex justify-between items-center'>
                      <p className='text-left'>{result.Clientfile.name}</p>
                      <p className='text-right'>Tech: {result.tech}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-left'>Unit: {result.unit}</p>
                      <p className='text-muted-foreground text-right'>VIN: {result.vin}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-muted-foreground  text-left'>Mileage: {result.mileage}</p>
                      <p className='text-muted-foreground text-right'>Tag: {result.tag}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-muted-foreground  text-left'>Location: {result.location}</p>
                      <p className='text-muted-foreground text-right'>Writer: {result.writer}</p>
                    </div>
                    <p className='text-muted-foreground text-left'>Order Created @: {new Date(result.createdAt).toLocaleDateString('en-US', options2)}</p>

                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
      <Card className='m-3 '>
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <CardTitle className='flex-col'>
            <p>
              Completed
            </p>
            <p className='text-muted-foreground mt-2'></p>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 t h-auto max-h-[850px] overflow-y-auto">
          <ul className="grid gap-3 mt-3 ">
            {completed && completed.map((result, index) => {
              return (
                <li key={index} className="p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-[6px]" onClick={() => {
                  navigate(`/dealer/service/technician/workOrder/${result.workOrderId}`)
                }}>
                  <div className="font-medium flex-col">
                    <div className='flex justify-between items-center'>
                      <p className='text-left'>{result.Clientfile.name}</p>
                      <p className='text-right'>Tech: {result.tech}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-left'>Unit: {result.unit}</p>
                      <p className='text-muted-foreground text-right'>VIN: {result.vin}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-muted-foreground  text-left'>Mileage: {result.mileage}</p>
                      <p className='text-muted-foreground text-right'>Tag: {result.tag}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-muted-foreground  text-left'>Location: {result.location}</p>
                      <p className='text-muted-foreground text-right'>Writer: {result.writer}</p>
                    </div>
                    <p className='text-muted-foreground text-left'>Order Created @: {new Date(result.createdAt).toLocaleDateString('en-US', options2)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  const intent = formPayload.intent;
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const user = await GetUser(email)

  if (intent === "claimWaiter") {
    await prisma.workOrder.update({
      where: { workOrderId: Number(formPayload.workOrderId) },
      data: {
        tech: formPayload.userName,
        techEmail: formPayload.userEmail,
        status: 'In Works'
      }
    });
    return redirect(`/dealer/service/technician/workOrder/${formPayload.workOrderId}`)
  }
}

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }

  let waiters = await prisma.workOrder.findMany({
    where: { waiter: true },
    select: {
      workOrderId: true,
      unit: true,
      mileage: true,
      vin: true,
      tag: true,
      motor: true,
      color: true,
      budget: true,
      waiter: true,
      totalLabour: true,
      totalParts: true,
      subTotal: true,
      total: true,
      writer: true,
      userEmail: true,
      tech: true,
      techEmail: true,
      notes: true,
      customerSig: true,
      status: true,
      location: true,
      quoted: true,
      paid: true,
      remaining: true,
      FinanceUnitId: true,
      ServiceUnitId: true,
      financeId: true,
      clientfileId: true,
      createdAt: true,
      updatedAt: true,
      Clientfile: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          financeId: true,
          userId: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          postal: true,
          province: true,
          dl: true,
          typeOfContact: true,
          timeToContact: true,
          conversationId: true,
          billingAddress: true,
        }
      }
    }
  })
  const inWorks = waiters.filter(apt => apt.status === 'In Works');
  const completed = waiters.filter(apt => apt.status === 'Work Completed');
  waiters = waiters.filter(apt => apt.status !== 'In Works' && apt.status !== 'Work Completed');
  console.log(inWorks, 'waiters')
  return json({ user, waiters, inWorks, completed })
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/wrench.svg' },
]
