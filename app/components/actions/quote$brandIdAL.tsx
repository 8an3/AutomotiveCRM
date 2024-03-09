import financeFormSchema from '~/routes/overviewUtils/financeFormSchema';
import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, json, redirect, type ActionArgs, LoaderFunction } from '@remix-run/node'
import { createFinance, createFinanceManitou, createBMWOptions, createBMWOptions2, createClientFileRecord, financeWithDashboard, } from "~/utils/finance/create.server";
import { financeIdLoader, overviewLoader } from "./overviewActions";
import { DataForm } from '../dashboard/calls/actions/dbData';
import { findQuoteById, } from "~/utils/finance/get.server";
import { QuoteServer } from '~/utils/quote/quote.server';
import { prisma } from '~/libs/prisma.server';
import { commitSession as commitPref, getSession as getPref } from "~/utils/pref.server";
import { getSession } from '~/sessions/auth-session.server';
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";
import { CreateCommunications, CompleteTask, CreateLead, CreateTask, } from '../activix/functions';

export function invariant(
  condition: any,
  message: string | (() => string),
): asserts condition {
  if (!condition) {
    throw new Error(typeof message === 'function' ? message() : message)
  }
}

export async function quoteAction({ params, request }: ActionArgs) {
  const urlSegments = new URL(request.url).pathname.split('/');
  const financeId = urlSegments[urlSegments.length - 1]
  //const { financeId } = params;
  let formPayload = Object.fromEntries(await request.formData());
  const name = formPayload.firstName + ' ' + formPayload.lastName
  const status = 'Active'
  formPayload = { ...formPayload, name, status }
  const formData = financeFormSchema.parse(formPayload)
  // console.log(formData, 'checking formdata quote action')
  const firstName = formPayload.firstName
  const lastName = formPayload.lastName
  const email = formPayload.email;
  const model = formPayload.model;


  const errors = {
    firstName: firstName ? null : "First Name is required",
    lastName: lastName ? null : "lastName is required",
    email: email ? null : "email is required",
    model: model ? null : "model is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof firstName === "string", "First Name must be a string");
  invariant(typeof lastName === "string", "Last Name must be a string");
  invariant(typeof email === "string", "Email must be a string");
  invariant(typeof model === "string", "Model must be a string");

  // console.log(formData, 'checking formPayload quote oader')
  // console.log(financeId, 'checking financeId quote loader')
  const session2 = await getSession(request.headers.get("Cookie"));
  const userEmail = session2.get("email")
  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  let createActivixLead;
  if (user.activixActivated === 'yes') {
    createActivixLead = await CreateLead(formData)
    console.log(createActivixLead)
  }

  if (financeId.length > 20) {
    console.log('more than 20')
    try {
      const brand = formData.brand

      const session = await getSession(request.headers.get("Cookie"))
      const widthInput = formData.sliderWidth
      const sliderWidth = widthInput
      session.set("sliderWidth", sliderWidth)
      await commitPref(session)

      const DashData = await updateDashData(formData)
      const financeUpdated = await updateClientFinanceAndDashData(formData);

      if (brand === 'Switch') {
        const manitouOptionsCreated = await createFinanceManitou(formData)
        return json({ financeUpdated, manitouOptionsCreated }), redirect(`/options/${brand}`)
      }
      if (brand === 'Manitou') {
        const manitouOptionsCreated = await createFinanceManitou(formData)
        return json({ financeUpdated, manitouOptionsCreated }), redirect(`/options/${brand}`)
      }
      if (brand === 'BMW-Motorrad') {
        const financeId = financeUpdated.id
        const updatingFinance = await createBMWOptions({ financeId })
        const updatingFinance2 = await createBMWOptions2({ financeId })
        return json({ updatingFinance, updatingFinance2 }), redirect(`/options/${brand}`)
      }
      else {
        console.log('updated quote')
        return json({ financeUpdated, DashData }), redirect(`/overview/${brand}`)
      }

    } catch (error) {
      console.error(`quote not submitted ${error}`)
      return (`quote not submitted ${error}`)
    }
  } else {
    console.log('less than 20')
    const brand = formData.brand
    delete formData.userId
    delete formData.followUpDay
    let { financeId, clientData, dashData, financeData } = DataForm(formData);
    clientData = {
      ...clientData,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: formData.firstName + ' ' + formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      dl: formData.dl,
      userEmail: formData.userEmail,
    }
    const userId = formData.userId
    if (formData.brand === 'Used') {
      const email = formData.email
      const createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData)
      //   console.log('Created createQuoteServer:', createQuoteServer)
      return json({ createQuoteServer, createActivixLead }), redirect(`/overview/Used`)
    }
    if (formData.brand === 'Switch') {
      const email = formData.email
      const createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData)

      const manitouOptionsCreated = await createFinanceManitou(formData)
      return json({ manitouOptionsCreated, createQuoteServer, createActivixLead }), redirect(`/options/${brand}`)
    }
    if (formData.brand === 'Manitou') {
      const email = formData.email
      const createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData)
      const manitouOptionsCreated = await createFinanceManitou(formData)
      return json({ manitouOptionsCreated, createQuoteServer, createActivixLead }), redirect(`/options/${brand}`)
    }
    if (formData.brand === 'BMW-Motorrad') {
      const financeId = finance.id
      const email = formData.email
      const createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData)
      const updatingFinance = await createBMWOptions(financeId)
      const updatingFinance2 = await createBMWOptions2(financeId)
      return json({ updatingFinance, updatingFinance2, createQuoteServer, createActivixLead }), redirect(`/options/${brand}`)
    }
    else {
      const email = formData.email
      const createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData)
      // console.log('Created createQuoteServer:', createQuoteServer)
      return json({ createQuoteServer, createActivixLead }), redirect(`/overview/${brand}`)
    }
  }
}
export function quotebrandIdActionLoader({ params, request }: DataFunctionArgs) {
  const { financeId } = params;
  if (financeId) {
    return financeIdLoader({ financeId, request });
  } else {
    return overviewLoader({ request });
  }
}
export async function quoteLoader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const session = await getPref(request.headers.get("Cookie"));
  const sliderWidth = session.get('sliderWidth')

  const userId = user?.id

  const urlSegments = new URL(request.url).pathname.split('/');
  const financeId = urlSegments[urlSegments.length - 1];
  if (financeId.length > 2) {
    const finance = await findQuoteById(financeId);
    return json({ ok: true, finance, sliderWidth, financeId, userId })
  }
  else {
    return json({ ok: true, sliderWidth, userId })
  }
}


