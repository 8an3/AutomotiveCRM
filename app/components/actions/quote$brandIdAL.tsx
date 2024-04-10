import financeFormSchema from '~/routes/overviewUtils/financeFormSchema';
import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, json, redirect, type ActionArgs, LoaderFunction } from '@remix-run/node'
import { createFinance, createFinanceManitou, createBMWOptions, createBMWOptions2, createClientFileRecord, financeWithDashboard, } from "~/utils/finance/create.server";
import { financeIdLoader, overviewLoader } from "./overviewActions";
import { DataForm } from '../dashboard/calls/actions/dbData';
import { findQuoteById, } from "~/utils/finance/get.server";
import { QuoteServer, QuoteServerActivix } from '~/utils/quote/quote.server';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { commitSession as commitPref, getSession as getPref } from "~/utils/pref.server";
import { getSession } from '~/sessions/auth-session.server';
import { model } from "~/models";
import { CreateCommunications, CompleteTask, QuoteCreateLead, CreateTask, } from '../../routes/api.server'
import { getSession as getOrder, commitSession as commitOrder, } from '~/sessions/user.client.server'
import { UpdateLead, CreateVehicle } from '~/routes/_authorized.api.activix';
import { getSession as sixSession, commitSession as sixCommit, destroySession } from '~/utils/misc.user.server'

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
  const phone = formPayload.phone;
  let financeId
  if (formData.activixId && (formData.financeId.length > 20)) {
    financeId = formData.financeId
  } else {
    financeId = urlSegments[urlSegments.length - 1]
  }
  const phoneRegex = /^\+1\d{3}\d{7}$/; // Regex pattern to match +1 followed by 3-digit area code and 7 more digits

  const errors = {
    firstName: firstName ? null : "First Name is required",
    lastName: lastName ? null : "lastName is required",
    email: email ? null : "email is required",
    model: model ? null : "model is required",
    phone: phoneRegex.test(phone) ? null : "Phone must be in the format +14164164164", // Add phone validation using regex

  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof firstName === "string", "First Name must be a string");
  invariant(typeof lastName === "string", "Last Name must be a string");
  invariant(typeof email === "string", "Email must be a string");
  invariant(typeof model === "string", "Model must be a string");
  invariant(typeof phone === "string", "Phone must be a string");

  // console.log(formData, 'checking formPayload quote oader')
  // console.log(financeId, 'checking financeId quote loader')
  const session2 = await getSession(request.headers.get("Cookie"));
  const userEmail = session2.get("email")
  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  console.log(formData.financeIdFromDash, 'formData.financeIdFromDash')

  const referer = request.headers.get('Referer');
  console.log('Referer:', referer);
  /**if (financeId) {
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
  } else */
  console.log(formData.toStock, 'tostock in aaction')
  if (formData.activixRoute === 'yes') {// if (referer === 'http://localhost:3000/leads/activix' && formData.activixId && (formData.financeId.length > 20)) {
    const formData = financeFormSchema.parse(formPayload)
    const userId = user?.id;
    const clientfileId = formData.clientfileId
    const dashbaordId = formData.dashboardId
    const session66 = await sixSession(request.headers.get("Cookie"));
    session66.set("financeId", financeId);
    session66.set("clientfileId", clientfileId);
    const serializedSession = await sixCommit(session66);

    const lastContact = new Date().toISOString();
    const today = new Date()
    //formData = { ...formData, lastContact, pickUpDate: 'TBD', }
    const updateActivix = await UpdateLead(formData)
    const createVehicle = await CreateVehicle(formData)
    console.log(updateActivix, 'updateActivix')
    console.log(formData, 'formdata from overview')
    const brand = formData.brand

    const finance = await prisma.finance.update({
      where: { id: formData.financeId },
      data: {
        clientfileId: formData.clientfileId,
        dashboardId: formData.dashboardId,
        financeId: formData.financeId,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postal: formData.postal,
        province: formData.province,
        dl: formData.dl,
        typeOfContact: formData.typeOfContact,
        timeToContact: formData.timeToContact,
        iRate: formData.iRate,
        months: formData.months,
        discount: formData.discount,
        total: formData.total,
        onTax: formData.onTax,
        on60: formData.on60,
        biweekly: formData.biweekly,
        weekly: formData.weekly,
        weeklyOth: formData.weeklyOth,
        biweekOth: formData.biweekOth,
        oth60: formData.oth60,
        weeklyqc: formData.weeklyqc,
        biweeklyqc: formData.biweeklyqc,
        qc60: formData.qc60,
        deposit: formData.deposit,
        biweeklNatWOptions: formData.biweeklNatWOptions,
        weeklylNatWOptions: formData.weeklylNatWOptions,
        nat60WOptions: formData.nat60WOptions,
        weeklyOthWOptions: formData.weeklyOthWOptions,
        biweekOthWOptions: formData.biweekOthWOptions,
        oth60WOptions: formData.oth60WOptions,
        biweeklNat: formData.biweeklNat,
        weeklylNat: formData.weeklylNat,
        nat60: formData.nat60,
        qcTax: formData.qcTax,
        otherTax: formData.otherTax,
        totalWithOptions: formData.totalWithOptions,
        otherTaxWithOptions: formData.otherTaxWithOptions,
        desiredPayments: formData.desiredPayments,
        freight: formData.freight,
        admin: formData.admin,
        commodity: formData.commodity,
        pdi: formData.pdi,
        discountPer: formData.discountPer,
        userLoanProt: formData.userLoanProt,
        userTireandRim: formData.userTireandRim,
        userGap: formData.userGap,
        userExtWarr: formData.userExtWarr,
        userServicespkg: formData.userServicespkg,
        deliveryCharge: formData.deliveryCharge,
        vinE: formData.vinE,
        lifeDisability: formData.lifeDisability,
        rustProofing: formData.rustProofing,
        userOther: formData.userOther,
        paintPrem: formData.paintPrem,
        licensing: formData.licensing,
        stockNum: formData.stockNum,
        options: formData.options,
        accessories: formData.accessories,
        labour: formData.labour,
        year: formData.year,
        brand: formData.brand,
        model: formData.model,
        model1: formData.model1,
        color: formData.color,
        modelCode: formData.modelCode,
        msrp: formData.msrp,
        userEmail: formData.userEmail,
        tradeValue: formData.tradeValue,
        tradeDesc: formData.tradeDesc,
        tradeColor: formData.tradeColor,
        tradeYear: formData.tradeYear,
        tradeMake: formData.tradeMake,
        tradeVin: formData.tradeVin,
        tradeTrim: formData.tradeTrim,
        tradeMileage: formData.tradeMileage,
        trim: formData.trim,
        vin: formData.vin,
        lien: formData.lien,
      },
    });
    const dashboard = await prisma.dashboard.update({
      where: { financeId: formData.financeId },
      data: {
        financeId: financeId,
        lastContact: today.toISOString(),
        referral: 'off',
        visited: 'off',
        bookedApt: 'off',
        aptShowed: 'off',
        aptNoShowed: 'off',
        testDrive: 'off',
        metService: 'off',
        metManager: 'off',
        metParts: 'off',
        sold: 'off',
        depositMade: 'off',
        refund: 'off',
        turnOver: 'off',
        financeApp: 'off',
        approved: 'off',
        signed: 'off',
        pickUpSet: 'off',
        demoed: 'off',
        delivered: 'off',
        notes: 'off',
        metSalesperson: 'off',
        metFinance: 'off',
        financeApplication: 'off',
        pickUpTime: 'off',
        depositTakenDate: 'off',
        docsSigned: 'off',
        tradeRepairs: 'off',
        seenTrade: 'off',
        lastNote: 'off',
        dLCopy: 'off',
        insCopy: 'off',
        testDrForm: 'off',
        voidChq: 'off',
        loanOther: 'off',
        signBill: 'off',
        ucda: 'off',
        tradeInsp: 'off',
        customerWS: 'off',
        otherDocs: 'off',
        urgentFinanceNote: 'off',
        funded: 'off',
        status: 'Active',
        result: formData.result,
        customerState: formData.customerState,
        timesContacted: formData.timesContacted,
        visits: formData.visits,
        progress: formData.progress,
      },
    });
    return json({ finance, dashboard, updateActivix }, redirect(`/overview/${brand}`), { headers: { "Set-Cookie": serializedSession, } }
    );

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
      let createQuoteServer
      const userIntegration = await prisma.userIntergration.findUnique({
        where: { userEmail: user?.email }
      })
      const activixActivated = userIntegration.activixActivated
      if (activixActivated === 'yes') {
        createQuoteServer = await QuoteServerActivix(clientData, financeId, email, financeData, dashData)
      } else {
        createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData,)
      }
      return json({ createQuoteServer, }), redirect(`/overview/Used`)
    }
    if (formData.brand === 'Switch') {
      const email = formData.email
      const createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData,)

      const manitouOptionsCreated = await createFinanceManitou(formData)
      return json({ manitouOptionsCreated, createQuoteServer, }), redirect(`/options/${brand}`)
    }
    if (formData.brand === 'Manitou') {
      const email = formData.email
      let createQuoteServer
      const userIntegration = await prisma.userIntergration.findUnique({
        where: { userEmail: user?.email }
      })
      const activixActivated = userIntegration.activixActivated
      if (activixActivated === 'yes') {
        createQuoteServer = await QuoteServerActivix(clientData, financeId, email, financeData, dashData)
      } else {
        createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData,)
      } const manitouOptionsCreated = await createFinanceManitou(formData)
      return json({ manitouOptionsCreated, createQuoteServer, }), redirect(`/options/${brand}`)
    }
    if (formData.brand === 'BMW-Motorrad') {
      const financeId = finance.id
      const email = formData.email
      let createQuoteServer
      const userIntegration = await prisma.userIntergration.findUnique({
        where: { userEmail: user?.email }
      })
      const activixActivated = userIntegration.activixActivated
      if (activixActivated === 'yes') {
        createQuoteServer = await QuoteServerActivix(clientData, financeId, email, financeData, dashData)
      } else {
        createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData,)
      } const updatingFinance = await createBMWOptions(financeId)
      const updatingFinance2 = await createBMWOptions2(financeId)
      return json({ updatingFinance, updatingFinance2, createQuoteServer, }), redirect(`/options/${brand}`)
    }
    else {
      const email = formData.email
      let createQuoteServer
      const userIntegration = await prisma.userIntergration.findUnique({
        where: { userEmail: user?.email }
      })
      if (userIntegration) {
        const activixActivated = userIntegration.activixActivated
        if (activixActivated === null || activixActivated === undefined) {
          createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData,)
        } else if (activixActivated === 'yes') {
          createQuoteServer = await QuoteServerActivix(clientData, financeId, email, financeData, dashData)
        } else {
          createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData,)
        }
        return json({ createQuoteServer, }), redirect(`/overview/${brand}`)
      }
      else {
        createQuoteServer = await QuoteServer(clientData, financeId, email, financeData, dashData,)
        return json({ createQuoteServer, }), redirect(`/overview/${brand}`)

      }

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


  const user = await GetUser(email)  /// console.log(user, account, 'wquiote loadert')
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


