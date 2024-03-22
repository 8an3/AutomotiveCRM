import { Form, useActionData, useLoaderData, useParams, useNavigation } from '@remix-run/react'
import { Input, Label, Button, Separator } from '../components/ui/index'
import { ActionArgs, type DataFunctionArgs, json, type MetaFunction, type LoaderFunction, redirect } from '@remix-run/node'
import { ButtonLoading, } from "../components";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { ImageSelect } from './overviewUtils/imageselect'
import { quoteAction, quoteLoader } from '../components/actions/quote$brandIdAL'
import React, { useRef, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { findQuoteById } from '~/utils/finance/get.server';
import { model } from '~/models';
import { getSession } from '~/sessions/auth-session.server';
import Sidebar from "~/components/shared/sidebar";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { useRootLoaderData } from '~/hooks/use-root-loader-data';

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  let user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const sliderWidth = session.get('sliderWidth')
  let modelList;
  // MY 24
  if (params.brandId === 'Harley-DavidsonMY24') {
    modelList = await prisma.harley24.findMany()
  }
  if (params.brandId === 'Can-Am-SXS-MY24') {
    modelList = await prisma.my24canam.findMany()
  }
  if (params.brandId === 'Ski-Doo-MY24') {
    modelList = await prisma.my24canam.findMany()
  }
  // MY 23
  if (params.brandId === 'Kawasaki') {
    modelList = await prisma.kawasaki.findMany()
  }
  if (params.brandId === 'Manitou') {
    modelList = await prisma.manitou.findMany()
  }
  if (params.brandId === 'Sea-Doo') {
    modelList = await prisma.seadoo.findMany()
  }
  if (params.brandId === 'Switch') {
    modelList = await prisma.switch.findMany()
  }
  if (params.brandId === 'Can-Am') {
    modelList = await prisma.canam.findMany()
  }
  if (params.brandId === 'Can-Am-SXS') {
    modelList = await prisma.canamsxs.findMany()
  }
  if (params.brandId === 'Switch') {
    modelList = await prisma.switch.findMany()
  }
  if (params.brandId === 'KTM') {
    modelList = await prisma.harley24.findMany()
  }
  if (params.brandId === 'Ski-Doo') {
    modelList = await prisma.skidoo.findMany()
  }
  if (params.brandId === 'Suzuki') {
    modelList = await prisma.suzuki.findMany()
  }
  if (params.brandId === 'Triumph') {
    modelList = await prisma.triumph.findMany()
  }
  if (params.brandId === 'BMW-Motorrad') {
    modelList = await prisma.bmwmoto.findMany()
  }
  if (params.brandId === 'Indian') {
    modelList = await prisma.harley24.findMany()
  }
  if (params.brandId === 'Yamaha') {
    modelList = await prisma.harley24.findMany()
  }
  if (params.brandId === 'Suzuki') {
    modelList = await prisma.suzuki.findMany()
  }
  if (params.brandId === 'Spyder') {
    modelList = await prisma.spyder.findMany()
  }
  if (params.brandId === 'Harley-Davidson') {
    modelList = await prisma.harley.findMany()
  }

  const userId = user?.id
  user = await prisma.user.findUnique({ where: { email: email } });

  const urlSegments = new URL(request.url).pathname.split('/');
  const financeId = urlSegments[urlSegments.length - 1];
  if (financeId.length > 32) {
    const finance = await findQuoteById(financeId);
    return json({ ok: true, finance, sliderWidth, financeId, userId, modelList, user })
  }

  else {
    return json({ ok: true, sliderWidth, userId, modelList, user })
  }
}

export let action = quoteAction

export default function Quote() {
  let { brandId } = useParams()
  const { userId, modelList, user } = useLoaderData()

  const userEmail = user?.email

  const errors = useActionData() as Record<string, string | null>;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  //console.log(userEmail, user, 'userquote')
  function BusyIndicator() {
    const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

    React.useEffect(() => {
      if (isSubmitting) {
        toast.success('Quote has been created')
      }
    }, [isSubmitting]);
  }

  useEffect(() => {
    window.localStorage.setItem("user", user);
  }, []);

  return (
    <>
      <div className="mx-auto my-auto mt-[55px] ">
        <ImageSelect />
        <Form method='post' >
          <fieldset disabled={isSubmitting}>
            <div className="mt-3">
              <h3 className="text-2xl font-thin">CLIENT INFORMATION</h3></div><Separator />
            <div className="grid grid-cols-2 gap-2 mt-1 " >
              <div className="grid gap-1 mr-2 font-thin">
                <Label className="flex font-thin mt-1 " htmlFor="area">First Name (required)</Label>
                <Input className="  mt-1 " placeholder="Name" type="text" name="firstName" />
                {errors?.firstName ? (
                  <em className="text-[#ff0202]">{errors.firstName}</em>
                ) : null}
              </div>
              <div className="grid gap-1 font-thin">
                <Label className="flex font-thin justify-end   mt-1 " htmlFor="area">Last Name (required)</Label>
                <Input className="  mt-1 text-right " placeholder="Name" type="text" name="lastName" />
                {errors?.lastName ? (
                  <em className="text-[#ff0202] text-right">{errors.lastName}</em>
                ) : null}
              </div>
              <div className="grid gap-1 mr-2 font-thin">
                <Label className="flex font-thin items-end mt-1 " htmlFor="area">Phone</Label>
                <Input className=" mt-1 " placeholder="Phone" name="phone" type="number" />
                {errors?.phone ? (
                  <em className="text-[#ff0202] text-right">{errors.phone}</em>
                ) : null}
              </div>
              <div className="grid gap-1 font-thin">
                <Label className="flex font-thin mt-1 justify-end " htmlFor="area">Email (required)</Label>
                <Input className="grid text-right" placeholder="Email" type="email" name="email" />
                {errors?.email ? (
                  <em className="text-[#ff0202] text-right">{errors.email}</em>
                ) : null}
              </div>
              <div className="grid gap-1 mr-2 font-thin">
                <Label className="flex font-thin  items-end mt-1 " htmlFor="area">Address</Label>
                <Input className=" mt-1 " placeholder="Address" name="address" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-thin">MODEL INFORMATION</h3>
            </div>
            <Separator />
            <div className="grid gap-1 font-thin">
              <Label className="mt-3 flex font-thin " htmlFor="area">
                Model (required)
              </Label>
              <select name='model'
                className={`border-black text-black w-full placeholder:text-blue-300  mx-auto  h-9 cursor-pointer rounded-md border bg-white px-3 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none  focus:border-[#60b9fd]`}
              >
                <option value='' >Search By Model</option>
                {modelList.map((model, index) => (
                  <option key={index} value={model.model}>
                    {model.model}
                  </option>
                ))}
              </select>
              {errors?.model ? (
                <em className="text-[#ff0202]">{errors.model}</em>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1 " >
              <div className="grid gap-1 mr-2 font-thin">
                <Label className="flex font-thin mt-1 " htmlFor="area">Year</Label>
                <Input className="grid" placeholder="Year" name="year" type="number" defaultValue='' />
              </div>
              <div className="grid gap-1  font-thin">
                <Label className="flex font-thin justify-end items-end mt-1 " htmlFor="area">Stock Number</Label>
                <Input className="text-right " placeholder="Stock Number" name="stockNum" defaultValue='' />
              </div>

            </div>
            <div className="grid gap-2 mt-1">
              <Label className="font-thin " htmlFor="area">Options</Label>
              <Input placeholder="Options" name="options" className="mt-1 w-full" />
            </div>

            <Input type="hidden" name="iRate" defaultValue={10.99} />
            <Input type="hidden" name="tradeValue" defaultValue={0} />
            <Input type="hidden" name="lien" defaultValue={0} />
            <Input type="hidden" name="discount" defaultValue={0} />
            <Input type="hidden" name="followUpDay" defaultValue={3} />
            <Input type="hidden" name="deposit" defaultValue={0} />
            <Input type="hidden" name="months" defaultValue={60} />
            <Input type="hidden" name="accessories" defaultValue={0} />

            <Input type="hidden" name="userId" defaultValue={userId} />
            <Input type="hidden" name="brand" defaultValue={brandId} />
            <Input type="hidden" name="userEmail" defaultValue={user.email} />

            <div className='flex justify-end' >
              <ButtonLoading
                size="lg"
                type="submit"
                className="w-auto cursor-pointer ml-auto mt-5"
                name="intent"
                value="submit"
                isSubmitting={isSubmitting}
                loadingText="Creating finance deal..."
              >
                Next
              </ButtonLoading>
            </div>
            {isSubmitting ? <BusyIndicator /> : null}

          </fieldset>

        </Form>
      </div>
    </>
  )
}

export const meta: MetaFunction = () => {
  return [
    { title: "Quote - Dealer Sales Assistant" },
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
