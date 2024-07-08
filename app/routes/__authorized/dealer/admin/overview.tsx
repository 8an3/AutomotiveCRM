import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useFetcher } from "@remix-run/react";
import { getSession } from '~/sessions/auth-session.server';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { getUserById, updateUser, updateDealerFees, getDealerFeesbyEmail } from '~/utils/user.server'

import { Badge, Card, CardContent, CardHeader, CardTitle, Debug, Input, Label, PageAdminHeader, RemixLink, CardDescription, Separator, Button } from "~/components";
import { requireUserSession } from "~/helpers";
import { useRootLoaderData } from "~/hooks";
import { createCacheHeaders, createSitemap } from "~/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner"
import { saveDailyWorkPlan } from '~/utils/dailyPDF/create.server'
import { getDailyPDF } from '~/utils/dailyPDF/get.server'
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { prisma } from "~/libs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { getMergedFinance } from '~/utils/dashloader/dashloader.server'
import { deleteDailyPDF } from "~/utils/dailyPDF/delete.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";


export const handle = createSitemap();

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) {
    redirect('/login')
  }
  const metrics = await model.admin.query.getMetrics();
  const dealer = await prisma.dealer.findUnique({
    where: { id: 1 }
  })
  const userEmail = user?.email
  const dataPDF = await getDailyPDF(userEmail)
  const statsData = await getMergedFinance(userEmail)
  const comsRecords = await prisma.previousComms.findMany({ where: { userEmail: user.email, }, });
  return json(
    { user, metrics, dealer, dataPDF, statsData, comsRecords },
    { headers: createCacheHeaders(request) }
  );
}

export async function action({ request }: ActionArgs) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const Input = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent

  if (intent === 'updateDealerFeesAdmin') {

    const update = await prisma.dealer.update({
      where: {
        id: 1
      },
      data: {
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
      }
    })
    return update;
  }
  if (intent === 'updateUser') {
    delete Input.intent;

    const saveUser = await updateUser(Input)
    const saveDealer = await updateDealerFees(Input)
    return ({ saveUser, saveDealer })
  }
  if (intent === 'dailyPDF') {
    const userId = formPayload.userId
    const delete2 = await deleteDailyPDF(userId)
    delete Input.intent;
    const savedaily = await saveDailyWorkPlan(Input)
    console.log(savedaily)
    return ({ savedaily, delete2 })

  }
  if (intent === 'updateDealerInfo') {
    const dealer = await prisma.dealer.update({
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
        vercel: formData.vercel,
        github: formData.github,
      },
      where: {
        id: 1
      }
    })
    return dealer
  }
  return null
}


export default function Route() {
  const rootLoaderData = useRootLoaderData();
  const loaderData = useLoaderData<typeof loader>();
  const { user, dealer, dataPDF, statsData, comsRecords, metrics } = useLoaderData()
  let dealerName = dealer.dealerName
  let dealerAddress = dealer.dealerAddress
  let dealerCity = dealer.dealerCity
  let dealerProv = dealer.dealerProv
  let dealerPostal = dealer.dealerPostal
  let dealerPhone = dealer.dealerPhone
  let dealerEmail = dealer.dealerEmail
  let dealerContact = dealer.dealerContact
  let dealerAdminContact = dealer.dealerAdminContact
  let dealerEmailAdmin = dealer.dealerEmailAdmin
  let vercel = dealer.vercel
  let github = dealer.github
  let finance = ''
  let data = ''
  const fetcher = useFetcher()
  const name = user.name
  const phone = user.phone
  // console.log('user', user)

  if (dealer && dealer.dealerPhone) {
    dealerPhone = dealer.dealerPhone || ''
  } else {
    console.error('The object or dealerPhone property is undefined.');
  }
  if (dealer && dealer.dealerAddress) {
    dealerAddress = dealer.dealerAddress || ''
  } else {
    console.error('The object or dealerAddress property is undefined.');
  }
  if (dealer && dealer.dealerProv) {
    dealerProv = dealer.dealerProv || ''
  } else {
    console.error('The object or dealerProv property is undefined.');
  }
  const timerRef = useRef(0);
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const Dealerfees = [
    { name: "userAdmin", value: dealer.userAdmin, placeholder: "Admin" },
    { name: "userFreight", value: dealer.userFreight, placeholder: "Freight" },
    { name: "userCommodity", value: dealer.userCommodity, placeholder: "Commodity" },
    { name: "userPDI", value: dealer.userPDI, placeholder: "PDI" },
    { name: "userAirTax", value: dealer.userAirTax, placeholder: "Air Tax" },
    { name: "userTireTax", value: dealer.userTireTax, placeholder: "Tire Tax" },
    { name: "userGovern", value: dealer.userGovern, placeholder: "Government Fees" },
    { name: "userFinance", value: dealer.userFinance, placeholder: "Finance Fees" },
    { name: "destinationCharge", value: dealer.destinationCharge, placeholder: "Destination Charge" },
    { name: "userGasOnDel", value: dealer.userGasOnDel, placeholder: "Gas On Delivery" },
    { name: "userMarketAdj", value: dealer.userMarketAdj, placeholder: "Market Adjustment" },
    { name: "userDemo", value: dealer.userDemo, placeholder: "Demonstratration Fee" },
    { name: "userOMVIC", value: dealer.userOMVIC, placeholder: "OMVIC or Other" },
    { name: "userLicensing", value: dealer.userLicensing, placeholder: "Licensing" },
    { name: "userTax", value: dealer.userTax, placeholder: "Tax Rate" },
  ];
  const FinanceOptions = [
    { name: "userExtWarr", value: dealer.userExtWarr, placeholder: 'Extended Warranty' },
    { name: "userLoanProt", value: dealer.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: dealer.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", dealer: dealer.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: dealer.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: dealer.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: dealer.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: dealer.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: dealer.userOther, placeholder: 'Other data Package' },
  ];
  //      <video loop autoPlay width='750' height='750' src='https://youtu.be/u1MLfrFzCBo' className='mx-auto z-49' frameBorder="0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
  const errors = useActionData() as Record<string, string | null>;
  return (
    <>
      <Tabs defaultValue="dealerFees" className="w-auto mx-auto " >
        <TabsList className="">
          <TabsTrigger className='rounded-md' value="dealerFees">Dealer Fees</TabsTrigger>
          <TabsTrigger className='rounded-md' value="account">Account Variables</TabsTrigger>
          <TabsTrigger className='rounded-md' value="stats">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="dealerFees" className='rounded-md'>
          <Card className='rounded-lg'>
            <CardContent className="space-y-2 bg-background text-foreground border-border rounded-md">
              <Form method="post" className="">

                <div className="grid grid-cols-1 gap-4 mx-auto">
                  {/* Row 1 */}
                  <div className=" p-4">
                    <div className=" mt-5">
                      <h2 className="text-2xl font-thin">
                        DEALER FEES
                      </h2>
                      <p className="text-sm text-foreground">
                        This is where you can change values like freight, admin, taxes and
                        such. If you don't have all this information with you, dont worry, you can always come back and update it later.
                      </p>
                      <Separator className="my-4" />

                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {Dealerfees.map((fee, index) => (
                        <div className="relative mt-3" key={index}>
                          <Input
                            name={fee.name}
                            defaultValue={fee.value}
                            className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                          />
                          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{fee.placeholder}</label>
                        </div>
                      ))}
                      <div className="relative mt-3"  >
                        <Input
                          defaultValue={dealer.userLicensing}
                          name="userLicensing"
                          className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                        />
                        {errors?.userLicensing ? (
                          <em className="text-[#ff0202]">{errors.userLicensing}</em>
                        ) : null}
                        <label className="required:border-primary text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Licensing</label>
                      </div>
                      <div className="relative mt-3"  >
                        <Input
                          defaultValue={dealer.userTax}
                          name="userTax"
                          className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                        />
                        {errors?.userTax ? (
                          <em className="text-[#ff0202]">{errors.userTax}</em>
                        ) : null}
                        <label className="required:border-primary text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Sales tax </label>
                      </div>
                      <div className="relative mt-3"  >
                        <Input
                          defaultValue={dealer.userLabour}
                          name="userLabour"
                          className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                        />
                        {errors?.userLabour ? (
                          <em className="text-[#ff0202]">{errors.userLabour}</em>
                        ) : null}
                        <label className="required:border-primary text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Service Labour </label>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <h2 className="text-2xl font-thin mt-1">
                    OPTIONS
                    <hr className="mb-4 text-muted-foreground" />

                  </h2>
                  <div className="p-4 grid gap-2">
                    <div className="h-[250px] grid grid-cols-3 gap-2 ">
                      {FinanceOptions.map((option, index) => (
                        <div className="relative mt-3" key={index}>
                          <Input
                            name={option.name}
                            defaultValue={option.value}
                            className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                          />
                          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{option.placeholder}</label>
                        </div>
                      ))}
                      <Input type='hidden'
                        defaultValue={user.email}
                        name="email"
                      />
                      <Input type='hidden'
                        defaultValue='updateDealerFeesAdmin'
                        name="intent"
                      />
                      <Button size='sm' className="bg-primary ml-auto mr-2" type="submit"
                        onClick={() => {
                          setIsButtonPressed(true);
                          toast.message('Dealer Fees Updated', {})
                        }}
                      >
                        Update
                      </Button>

                    </div>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card className='rounded-lg'>
            <CardContent className="space-y-2 bg-background text-foreground border-border rounded-md">
              <Form method="post" className="">
                <div className=" mt-5">
                  <h2 className="text-2xl font-thin">
                    Dealer Info
                  </h2>
                  <p className="text-sm text-foreground">
                    Edit your dealer information, this is used all over the application. If anything changes be sure to come back here and update the information.
                  </p>
                  <Separator className="my-4" />

                </div>
                <div className="grid sm:grid-cols-3 grid-cols-1  gap-2 mt-2">

                  <div className="relative mt-3"  >
                    <Input
                      defaultValue={dealerName}
                      name="dealer"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Name</label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      name="dealerAddress"
                      defaultValue={dealerAddress}
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Address </label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      defaultValue={dealerCity}
                      name="dealerCity"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer City </label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      defaultValue={dealerProv}
                      name="dealerProv"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Prov </label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      defaultValue={dealerPostal}
                      name="dealerPostal"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                    />
                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Postal Code</label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      type="phone"
                      name="dealerPhone"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                      defaultValue={dealerPhone}
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Phone Number</label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      name="dealerContact"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                      defaultValue={dealerContact}
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Contact</label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      name="dealerEmail"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                      defaultValue={dealerEmail}
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Email</label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      name="dealerAdminContact"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                      defaultValue={dealerAdminContact}
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Admin Email</label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      name="dealerEmailAdmin"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                      defaultValue={dealerEmailAdmin}
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dealer Admin Email</label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      name="github"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                      defaultValue={github}
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Github</label>
                  </div>
                  <div className="relative mt-3"  >
                    <Input
                      name="vercel"
                      className="bg-background text-foreground border-border px-5 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all duration-150  focus:outline-none  mx-1"
                      defaultValue={vercel}
                    />
                    <label className="  text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Vercel</label>
                  </div>
                  <Button
                    type='submit'
                    name='intent'
                    value='updateDealerInfo'
                    size='sm'
                    className='ml-3 mr-2 bg-primary'
                  >
                    Save changes
                  </Button>
                </div>
              </Form>

            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats1">
          <div className='max-w-xl mx-auto justify-center text-foreground'>
            <PageAdminHeader size="xs">
              <h1 className='text-foreground'>Admin Dashboard</h1>
              <RemixLink to={`/admin/users/${user.id}`}>
                <div className="space-y-2 text-right">
                  <h2 className='text-foreground'>Welcome, {user.name}!</h2>
                  <Badge className='text-foreground border-white' >{user.role.name}</Badge>
                </div>
              </RemixLink>
            </PageAdminHeader>

            <section className="px-layout space-y-2">
              <h3 className='text-foreground'>Database Metrics/Statistics</h3>
              <div className="grid max-w-3xl gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {metrics.map((metric) => {
                  return (
                    <RemixLink key={metric.name} to={metric.to}>
                      <div className="card hover:card-hover stack rounded p-4 text-center">
                        <p className="text-6xl font-extrabold text-foreground">{metric.count}</p>
                        <span className='text-foreground'>{metric.name}</span>
                      </div>
                    </RemixLink>
                  );
                })}
              </div>
            </section>

            <section className="px-layout">
              <Debug className='text-foreground' name="rootLoaderData">{rootLoaderData}</Debug>
              <Debug className='text-foreground' name="loaderData">{loaderData}</Debug>
            </section>
          </div>
        </TabsContent>
        <TabsContent value="stats" className='rounded-md bg-background text-foreground'>
          <Card className='rounded-md text-foreground'>
            <CardHeader className='bg-myColor-900'>
              <CardTitle className='text-foreground'>
                <h3 className="text-2xl font-thin uppercase text-slate4">
                  Statistics
                </h3>
              </CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 bg-background1 text-foreground">
              <StatsTable statsData={statsData} comsRecords={comsRecords} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Parts">
          <Card>
            <CardContent className="space-y-2 bg-background1 text-foreground rounded-md">
              <Form method="post" className="">
                <div className="grid sm:grid-cols-3 grid-cols-1  gap-2 mt-2">



                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

export function StatsTable({ statsData, comsRecords }) {

  function calculateQuotesForPeriod(statsData, start, end) {
    return statsData.filter(statsData => {
      const recordDate = new Date(statsData.createdAt);
      return recordDate >= start && recordDate <= end;
    }).length;
  }

  function calculateDepositMadeForPeriod(statsData, start, end) {
    return statsData.filter(record => {
      if (record.depositMade === 'on') {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      }
      return false;
    }).length;
  }
  function calulatefinanceAppForPeriod(statsData, start, end) {
    return statsData.filter(record => {
      if (record.financeApp === 'on') {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      }
      return false;
    }).length;
  }
  function calculatedeliveredForPeriod(statsData, start, end) {
    return statsData.filter(record => {
      if (record.delivered === 'on') {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      }
      return false;
    }).length;
  }

  function calculateLeadsForPeriod(comsRecords, start, end, type) {
    return comsRecords.filter(record => {
      const recordDate = new Date(record.createdAt);
      return recordDate >= start && recordDate <= end && record.type === type;
    }).length;
  }


  function calculatedcountsEmailForPeriod(statsData, start, end) {
    return statsData.reduce((sum, record) => {
      const recordDate = new Date(record.createdAt);
      if (recordDate >= start && recordDate <= end && record.Email !== "" && record.Email !== null) {
        return sum + Number(record.Email);
      }
      return sum;
    }, 0);
  }
  function calculatedcountsSMSForPeriod(statsData, start, end) {
    return statsData.reduce((sum, record) => {
      const recordDate = new Date(record.createdAt);
      if (recordDate >= start && recordDate <= end && record.SMS !== "" && record.SMS !== null) {
        return sum + Number(record.SMS);
      }
      return sum;
    }, 0);
  }
  function calculatedcountsPhoneForPeriod(statsData, start, end) {
    return statsData.reduce((sum, record) => {
      const recordDate = new Date(record.createdAt);
      if (recordDate >= start && recordDate <= end && record.Phone !== "" && record.Phone !== null) {
        return sum + Number(record.Phone);
      }
      return sum;
    }, 0);
  }

  const now = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const lastYear = now.getFullYear() - 1;

  const startOfLastYearThisWeek = new Date();
  startOfLastYearThisWeek.setDate(now.getDate() - now.getDay());
  startOfLastYearThisWeek.setFullYear(lastYear);

  const startOfLastYearThisMonth = new Date(lastYear, now.getMonth(), 1);

  const startOfLastYear = new Date(lastYear, 0, 1);

  const count2 = calculateLeadsForPeriod(statsData, startOfMonth, now, 'walkin');
  const stats = [
    {
      period: 'This Week',
      quotes: calculateQuotesForPeriod(statsData, startOfWeek, now),
      deposits: calculateDepositMadeForPeriod(statsData, startOfWeek, now),
      financed: calulatefinanceAppForPeriod(statsData, startOfWeek, now),
      delivered: calculatedeliveredForPeriod(statsData, startOfWeek, now),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'walkin'),
      webLead: calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'weblead'),
      phoneLead: calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'phonelead'),
      total: (calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'walkin') + calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'weblead') + calculateLeadsForPeriod(comsRecords, startOfWeek, now, 'phonelead')),
      totalComs: '',
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfWeek, now),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfWeek, now),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfWeek, now),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfWeek, now) + calculatedcountsSMSForPeriod(statsData, startOfWeek, now) + calculatedcountsPhoneForPeriod(statsData, startOfWeek, now)),
    },
    {
      period: 'This Month',
      quotes: calculateQuotesForPeriod(statsData, startOfMonth, now),
      deposits: calculateDepositMadeForPeriod(statsData, startOfMonth, now),
      financed: calulatefinanceAppForPeriod(statsData, startOfMonth, now),
      delivered: calculatedeliveredForPeriod(statsData, startOfMonth, now),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfMonth, now, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfMonth, now, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfMonth, now, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfMonth, now, 'walkin') + calculateLeadsForPeriod(statsData, startOfMonth, now, 'weblead') + calculateLeadsForPeriod(statsData, startOfMonth, now, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfMonth, now),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfMonth, now),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfMonth, now),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfMonth, now) + calculatedcountsSMSForPeriod(statsData, startOfMonth, now) + calculatedcountsPhoneForPeriod(statsData, startOfMonth, now)),
    },
    {
      period: 'This Year',
      quotes: calculateQuotesForPeriod(statsData, startOfYear, now),
      deposits: calculateDepositMadeForPeriod(statsData, startOfYear, now),
      financed: calulatefinanceAppForPeriod(statsData, startOfYear, now),
      delivered: calculatedeliveredForPeriod(statsData, startOfYear, now),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfYear, now, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfYear, now, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfYear, now, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfYear, now, 'walkin') + calculateLeadsForPeriod(statsData, startOfYear, now, 'weblead') + calculateLeadsForPeriod(statsData, startOfYear, now, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfYear, now),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfYear, now),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfYear, now),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfYear, now) + calculatedcountsSMSForPeriod(statsData, startOfYear, now) + calculatedcountsPhoneForPeriod(statsData, startOfYear, now)),
    },
    {
      period: 'This Week Last Year',
      quotes: calculateQuotesForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      deposits: calculateDepositMadeForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      financed: calulatefinanceAppForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      delivered: calculatedeliveredForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'walkin') + calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'weblead') + calculateLeadsForPeriod(statsData, startOfLastYearThisWeek, lastYear, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfLastYearThisWeek, lastYear),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfLastYearThisWeek, lastYear) + calculatedcountsSMSForPeriod(statsData, startOfLastYearThisWeek, lastYear) + calculatedcountsPhoneForPeriod(statsData, startOfLastYearThisWeek, lastYear)),
    },
    {
      period: 'This Month Last Year',
      quotes: calculateQuotesForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      deposits: calculateDepositMadeForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      financed: calulatefinanceAppForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      delivered: calculatedeliveredForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'walkin') + calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'weblead') + calculateLeadsForPeriod(statsData, startOfLastYearThisMonth, lastYear, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfLastYearThisMonth, lastYear),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfLastYearThisMonth, lastYear) + calculatedcountsSMSForPeriod(statsData, startOfLastYearThisMonth, now) + calculatedcountsPhoneForPeriod(statsData, startOfLastYearThisMonth, lastYear)),
    },
    {
      period: 'Last Year',
      quotes: calculateQuotesForPeriod(statsData, startOfLastYear, lastYear),
      deposits: calculateDepositMadeForPeriod(statsData, startOfLastYear, lastYear),
      financed: calulatefinanceAppForPeriod(statsData, startOfLastYear, lastYear),
      delivered: calculatedeliveredForPeriod(statsData, startOfLastYear, lastYear),
      repeatCustomer: 5,
      walkIn: calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'walkin'),
      webLead: calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'weblead'),
      phoneLead: calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'phonelead'),
      total: (calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'walkin') + calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'weblead') + calculateLeadsForPeriod(statsData, startOfLastYear, lastYear, 'phonelead')),
      emailsSent: calculatedcountsEmailForPeriod(statsData, startOfLastYear, lastYear),
      smsSent: calculatedcountsSMSForPeriod(statsData, startOfLastYear, lastYear),
      phoneCallsMade: calculatedcountsPhoneForPeriod(statsData, startOfLastYear, lastYear),
      timesContacted: (calculatedcountsEmailForPeriod(statsData, startOfLastYear, lastYear) + calculatedcountsSMSForPeriod(statsData, startOfLastYear, lastYear) + calculatedcountsPhoneForPeriod(statsData, startOfLastYear, lastYear)),
    },
    // More objects for other time periods...
  ];
  return (
    <Table>
      <TableCaption>List of Stats</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='text-foreground'>Period</TableHead>
          <TableHead className='text-foreground'>Quotes</TableHead>
          <TableHead className='text-foreground'>Deposits</TableHead>
          <TableHead className='text-foreground'>Financed</TableHead>
          <TableHead className='text-foreground'>Delivered</TableHead>
          <TableHead className='text-foreground'>Repeat Cust</TableHead>
          <TableHead className='text-foreground'>Walk-in</TableHead>
          <TableHead className='text-foreground'>Web-lead</TableHead>
          <TableHead className='text-foreground'>Phone-lead</TableHead>
          <TableHead className='text-foreground'>Total</TableHead>
          <TableHead className='text-foreground'>emailsSent</TableHead>
          <TableHead className='text-foreground'>smsSent</TableHead>
          <TableHead className='text-foreground'>phoneCallsMade</TableHead>
          <TableHead className='text-foreground'>timesContacted</TableHead>
          <TableHead className='text-foreground'>Appts</TableHead>
          <TableHead className='text-foreground'>Appts Showed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((stat) => (
          <TableRow key={stat.period}>
            <TableCell className='text-foreground'>{stat.period}</TableCell>
            <TableCell className='text-foreground'>{stat.quotes}</TableCell>
            <TableCell className='text-foreground'>{stat.deposits}</TableCell>
            <TableCell className='text-foreground'>{stat.financed}</TableCell>
            <TableCell className='text-foreground'>{stat.delivered}</TableCell>
            <TableCell className='text-foreground'>{stat.repeatCustomer}</TableCell>
            <TableCell className='text-foreground'>{stat.walkIn}</TableCell>
            <TableCell className='text-foreground'>{stat.webLead}</TableCell>
            <TableCell className='text-foreground'>{stat.phoneLead}</TableCell>
            <TableCell className='text-foreground'>{stat.total}</TableCell>
            <TableCell className='text-foreground'>{stat.emailsSent}</TableCell>
            <TableCell className='text-foreground'>{stat.smsSent}</TableCell>
            <TableCell className='text-foreground'>{stat.phoneCallsMade}</TableCell>
            <TableCell className='text-foreground'>{stat.timesContacted}</TableCell>
            <TableCell className='text-foreground'>Appts</TableCell>
            <TableCell className='text-foreground'>Appts Showed</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
