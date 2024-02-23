import { json, type ActionFunction, LoaderFunction, redirect, } from "@remix-run/node";
import financeFormSchema from "~/routes/overviewUtils/financeFormSchema";
////import { authenticator } from "~/services";
import { findDashboardDataById, findQuoteById, getDataBmwMoto, getDataByModel, getDataByModelManitou, getDataHarley, getDataKawasaki, getDataTriumph, getLatestBMWOptions, getLatestBMWOptions2, getLatestOptionsManitou, getRecords, } from "~/utils/finance/get.server";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getAllFinanceNotes } from "~/utils/financeNote/get.server";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import UpdateStatus from "../dashboard/calls/actions/UpdateStatus";
import DeleteCustomer from "../dashboard/calls/actions/DeleteCustomer";
import { updateFinanceNote } from "~/utils/client/updateFinanceNote.server";
import { prisma } from "~/libs";
import { deleteFinanceAppts } from "~/utils/financeAppts/delete.server";
import UpdateAppt from "../dashboard/calls/actions/updateAppt";
import { createFinanceCheckClientDFirst } from "~/utils/finance/create.server";
import createFinanceNotes from "../dashboard/calls/actions/createFinanceNote";
import updateFinanceNotes from "../dashboard/calls/actions/updateFinanceNote";
import CreateAppt from "../dashboard/calls/actions/createAppt";
import updateFinance23 from "../dashboard/calls/actions/updateFinance";
import { createfinanceApt } from "~/utils/financeAppts/create.server";
import { getMergedFinance } from "~/utils/dashloader/dashloader.server";
import { EmailFunction } from "~/routes/dummyroute";
import { SetCookie, commitSession as commitPref, getSession as getPref } from "~/utils/pref.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";
import { getSession, getSession as getToken66, commitSession as commitToken66 } from '~/sessions/auth-session.server';
import { updateFinance, updateFinanceWithDashboard } from "~/utils/finance/update.server"

export async function dashboardLoader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await model.user.query.getForSession({ email: email });
  if (!user) { redirect('/login') }
  const deFees = await getDealerFeesbyEmail(user.email);
  const session = await getPref(request.headers.get("Cookie"));
  const sliderWidth = session.get("sliderWidth");
  const financeCookie = session.get("financeId");
  const userEmail = user?.email
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: userEmail, }, });
  const currentURL = new URL(request.url).pathname;
  let financeId;
  let finance;
  let dashData;
  finance = await getMergedFinance(userEmail);
  const brand = finance?.brand;
  const urlSegmentsDashboard = new URL(request.url).pathname.split("/");
  const dashBoardCustURL = urlSegmentsDashboard.slice(0, 3).join("/");
  const customerId = finance?.id;
  const financeNotes = await getAllFinanceNotes(customerId);
  const searchData = await prisma.clientfile.findMany({ orderBy: { createdAt: 'desc', }, });
  const webLeadData = await prisma.finance.findMany({ orderBy: { createdAt: 'desc', }, where: { userEmail: null } });
  const dashData2 = await prisma.dashboard.findMany({ where: { customerState: 'turnOver' }, });
  const financeData2 = await prisma.finance.findMany({ where: { id: dashData2.financeId }, });
  const financeNewLead = await Promise.all(financeData2.map(async (financeRecord) => {
    const correspondingDashRecord = dashData2.find(dashRecord => dashRecord.financeId === financeRecord.id);
    const comsCounter = await prisma.communications.findUnique({
      where: {
        financeId: financeRecord.id
      },
    });
    return {
      ...comsCounter,
      ...correspondingDashRecord,
      ...financeRecord,
    };
  }));
  const conversations = await prisma.communicationsOverview.findMany({})
  const getWishList = await prisma.wishList.findMany({ orderBy: { createdAt: 'desc', }, where: { userId: user?.id } });
  const notifications = await prisma.notificationsUser.findMany({ where: { userId: user.id, } })

  const fetchLatestNotes = async (financeRecords) => {
    const promises = financeRecords.map(async (financeRecord) => {
      try {
        const latestNote = await prisma.financeNote.findFirst({
          where: { customerId: financeRecord.financeId },
          orderBy: { createdAt: 'desc' },
        });
        return latestNote;
      } catch (error) {
        console.error('Error fetching note:', error);
        return null;
      }
    });

    return Promise.all(promises);
  };
  const latestNotes = await fetchLatestNotes(finance);
  console.log(latestNotes);




  if (brand === "Manitou") {
    const modelData = await getDataByModelManitou(finance);
    const manOptions = await getLatestOptionsManitou(user.email);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      manOptions,
      sliderWidth,
      user,
      financeNotes,
      dashBoardCustURL,
      getWishList,
      conversations,
      financeNewLead,
      latestNotes,
      notifications,
    });
  }
  if (brand === "Switch") {
    const modelData = await getDataByModel(finance);
    const manOptions = await getLatestOptionsManitou(email);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      manOptions,
      sliderWidth,
      user,
      financeNotes,
      getWishList,
      latestNotes,
      conversations,
      financeNewLead,
      notifications,
      dashBoardCustURL,
    });
  }

  if (brand === "Kawasaki") {
    const modelData = await getDataKawasaki(finance);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      sliderWidth,
      user,
      financeNotes,
      financeNewLead,
      latestNotes,
      conversations,
      getWishList,
      notifications,
      dashBoardCustURL,
    });
  }

  if (brand === "BMW-Motorrad") {
    const financeId = finance?.id;
    const bmwMoto = await getLatestBMWOptions(financeId);
    const bmwMoto2 = await getLatestBMWOptions2(financeId);
    const modelData = await getDataBmwMoto(finance);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      bmwMoto,
      latestNotes,
      bmwMoto2,
      sliderWidth,
      user,
      financeNotes,
      financeNewLead,
      conversations,
      getWishList,
      notifications,
      dashBoardCustURL,
    });
  }

  if (brand === "Triumph") {
    const modelData = await getDataTriumph(finance);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      sliderWidth,
      user,
      latestNotes,
      financeNotes,
      financeNewLead,
      getWishList,
      conversations,
      notifications,
      dashBoardCustURL,
    });
  }

  if (brand === "Harley-Davidson") {
    const modelData = await getDataHarley(finance);
    // console.log(dashData)
    // console.log(getTemplates, 'getTemplates')

    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      sliderWidth,
      user,
      financeNotes,
      latestNotes,
      dashBoardCustURL,
      getWishList,
      conversations,
      financeNewLead,
      notifications,
      getTemplates,
    });
  } else {
    let modelData;
    if (finance !== null) {
      let modelData;
      modelData = await getDataByModel(finance);
      return json({
        ok: true,
        modelData,
        finance,
        deFees,
        sliderWidth,
        user,
        financeNotes,
        dashBoardCustURL,
        getTemplates,
        latestNotes,
        searchData,
        conversations,
        financeNewLead,
        getWishList,
        notifications,
        webLeadData,

      });
    }
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      sliderWidth,
      user,
      financeNotes,
      dashBoardCustURL,
      latestNotes,
      getTemplates,
      conversations,
      searchData,
      financeNewLead,
      getWishList,
      notifications,
      webLeadData,
    });
  }
}
export async function CompleteLastAppt(userId, financeId) {
  console.log('CompleteLastAppt')
  const lastApt = await prisma.clientApts.findFirst({
    where: { financeId: financeId },
    orderBy: {
      createdAt: 'desc',
    },
  })


  if (lastApt) {
    let apptId = lastApt?.id;
    const data = {
      completed: 'yes',
      userId: userId,
    }
    const finance = await prisma.clientApts.update({
      data: {
        ...data,
      },
      where: {
        id: apptId,
      },
    });
    return finance
  }
}
export async function TwoDays(followUpDay3, formData, financeId, user) {
  const lastContact = new Date().toISOString();
  let customerState = formData.customerState;
  if (customerState === "Pending") {
    customerState = "Attempted";
  }


  const followUpDay2 = parseInt(followUpDay3);
  console.log('followUpDay:', followUpDay2);  // Add this line

  function addDays(days) {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate;
  }

  let newDate = addDays(followUpDay2);
  newDate = new Date(newDate).toISOString();
  console.log('financeId:', financeId);  // Add this line

  let clientAptsData = {
    title: formData.title,
    start: newDate,

    //end: formData.end,
    contactMethod: formData.contactMethod,
    completed: formData.completed,
    apptStatus: formData.apptStatus,
    apptType: formData.apptType,
    note: formData.note,
    unit: formData.unit,
    brand: formData.brand,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    financeId: formData.financeId,
    //description,
    userName: user?.name,
    messageTitle: 'Contacted by Instant Function',

    direction: 'Outgoing',
    resultOfcall: 'Attempted',
    userId,
  };
  const formPayload = formData
  const dashboardId = formData.dashboardId
  const nextAppointment = newDate
  const followUpDay = newDate
  const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, dashboardId }
  const updating = await updateFinance23(financeId, formData, formPayload);
  const createFollowup = await createfinanceApt(user, clientAptsData, formData)
  const completeApt = await CompleteLastAppt(userId, financeId)
  //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
  return json({ updating, completeApt, createFollowup });
}
export async function FollowUpApt(formData, user, userId) {
  const lastContact = new Date().toISOString();
  let customerState = formData.customerState;
  if (customerState === "Pending") {
    customerState = "Attempted";
  }

  let newDate = new Date(formData.followUpDay1).toISOString();

  let clientAptsData = {
    title: formData.title,
    start: newDate,

    //end: formData.end,
    contactMethod: formData.contactMethod,
    completed: formData.completed,
    apptStatus: formData.apptStatus,
    apptType: formData.apptType,
    note: formData.note,
    unit: formData.unit,
    brand: formData.brand,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    financeId: formData.financeId,
    //description,
    userName: user?.name,
    messageTitle: 'Contacted by Instant Function',

    direction: 'Outgoing',
    resultOfcall: 'Attempted',
    userId,
  };

  const nextAppointment = newDate
  const followUpDay = newDate
  const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, dashboardId }
  const updating = await updateFinance23(financeId, formData3, formPayload);


  const createFollowup = await createfinanceApt(financeId, clientAptsData)


  const completeApt = await CompleteLastAppt(userId, financeId)
  //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
  return json({ updating, completeApt, createFollowup });
}
export async function ComsCount(financeId, commType) {
  const record = await prisma.communications.findUnique({
    where: { financeId: financeId },
  });
  if (record) {
    await prisma.communications.update({
      where: { financeId: financeId },
      data: { [commType]: record[commType] + 1 },
    });
  } else {
    await prisma.communications.create({
      data: { financeId: financeId, [commType]: 1 },
    });
  }
  return json({ ok: true });
}
export async function ConvertDynamic(finance) {
  function replaceTemplateValues(template, values) {
    let result = template;
    for (const key in values) {
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), values[key]);
    }
    return result;
  }

  const values = {
    clientFname: finance.firstName,
    clientLname: finance.lastName,
    clientEmail: finance.email,
    clientFullName: finance.firstName + ' ' + finance.lastName,
    clientPhone: finance.phone,
    clientAddress: finance.address,
    clientCity: finance.city,
    clientState: finance.state,
    clientPostalCode: finance.postalCode,
    year: finance.year,
    make: finance.make,
    model: finance.model,
    vin: finance.vin,
    stockNumber: finance.stockNumber,
    price: finance.price,
    tradeYear: finance.tradeYear,
    tradeMake: finance.tradeMake,
    tradeModel: finance.tradeModel,
    tradeVin: finance.tradeVin,
    tradeColor: finance.tradeColor,
    tradeValue: finance.tradeValue,
    tradeMileage: finance.tradeMileage,
  }
  const template = `Hello ${clientFname}, your ${model} has been shipped.`;

  const emailBody = replaceTemplateValues(template, values);
  return emailBody
}
export const dashboardAction: ActionFunction = async ({ req, request, params, }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  const userId = user?.id;
  const intent = formPayload.intent;

  if (intent === 'addWishList') {
    const addtoWishList = await prisma.wishList.create({
      data: {
        userId: formData.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        model: formData.model,
        model2: formData.model2,
        notes: formData.notes,
      }
    })
    return addtoWishList
  }
  if (intent === "createEmailTemplate") {
    const template = await prisma.emailTemplates.create({
      data: {
        name: 'Copied from dashboard',
        body: formData.body,
        title: formData.title,
        subject: formData.subject,
        category: 'To update',
        userEmail: user.email,
        dept: 'sales',
        type: 'Text / Email',
      },
    });
    return template;
  }
  if (intent === 'editWishList') {
    const addtoWishList = await prisma.wishList.update({
      where: {
        id: formData.rowId,
      },
      data: {
        userId: formData.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        model: formData.model,
        model2: formData.model2,
        notes: formData.notes,
      }
    })
    return addtoWishList
  }
  if (intent === 'deleteWishList') {
    const deleteWishList = await prisma.wishList.delete({
      where: {
        id: formData.rowId,
      },
    })
    return deleteWishList
  }
  if (intent === 'claimTurnover') {

    const update = await prisma.lockFinanceTerminals.update({
      where: {
        id: 1,
      },
      data: {
        locked: false, // or the value you need
        //financeId: formData.financeId,
      },
    });
    return update
  }
  if (intent === 'financeTurnover') {
    const locked = Boolean(true)//Boolean(formPayload.locked);

    const claim = await prisma.lockFinanceTerminals.update({
      where: { id: 1 },
      data: { locked: locked, financeId: formData.financeId }
    })
    const finance = await prisma.finance.update({
      where: { id: formData.financeId },
      data: { financeManager: formData.financeManager }
    })
    return json({ claim, finance })
  }
  if (intent === 'reading') {
    const isRead = await prisma.notificationsUser.update({
      where: {
        id: notification.id
      },
      data: {
        read: true
      }
    })
    return isRead
  }
  const template = formPayload.template;
  const session = await getPref(request.headers.get("Cookie"));
  const today = new Date();
  let followUpDay = today;
  const clientfileId = formData.clientfileId;
  const date = new Date().toISOString()
  const financeId = formData?.financeId;
  const dashboard = await prisma.dashboard.findUnique({ where: { financeId: financeId, }, });
  const dashboardId = dashboard?.id;
  console.log(financeId, 'finance id from dashboard calls')
  session.set("financeId", financeId);
  session.set("clientfileId", clientfileId);
  const cookie = await commitPref(session)
  await SetCookie(userId, clientfileId, financeId, dashboardId, request)
  let pickUpDate;
  if (pickUpDate === null || pickUpDate === undefined) {
    pickUpDate = "To Be Det.";
  }
  const id = formData?.id;


  if (intent === 'newLead') {

    const firstName = formData.firstName
    const lastName = formData.lastName
    const email = formData.email;
    const model = formData.model;
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
    function invariant(
      condition: any,
      message: string | (() => string),
    ): asserts condition {
      if (!condition) {
        throw new Error(typeof message === 'function' ? message() : message)
      }
    }
    invariant(typeof firstName === "string", "First Name must be a string");
    invariant(typeof lastName === "string", "Last Name must be a string");
    invariant(typeof email === "string", "Email must be a string");
    invariant(typeof model === "string", "Model must be a string");



    // console.log(formData, 'newlead')
    console.log(financeId, 'finaceCheckId')
    const financeData = {

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
    }
    const dashData = {
      userEmail: formData.userEmail,
      referral: formData.referral,
      visited: formData.visited,
      bookedApt: formData.bookedApt,
      aptShowed: formData.aptShowed,
      aptNoShowed: formData.aptNoShowed,
      testDrive: formData.testDrive,
      metService: formData.metService,
      metManager: formData.metManager,
      metParts: formData.metParts,
      sold: formData.sold,
      depositMade: formData.depositMade,
      refund: formData.refund,
      turnOver: formData.turnOver,
      financeApp: formData.financeApp,
      approved: formData.approved,
      signed: formData.signed,
      pickUpSet: formData.pickUpSet,
      demoed: formData.demoed,
      delivered: formData.delivered,
      status: 'Active',
      customerState: 'Attempted',
      result: formData.result,
      timesContacted: formData.timesContacted,
      nextAppointment: formData.nextAppointment,
      completeCall: formData.completeCall,
      followUpDay: formData.followUpDay,
      state: formData.state,
      deliveredDate: formData.deliveredDate,
      notes: formData.notes,
      visits: formData.visits,
      progress: formData.progress,
      metSalesperson: formData.metSalesperson,
      metFinance: formData.metFinance,
      financeApplication: formData.financeApplication,
      pickUpDate: pickUpDate,
      pickUpTime: formData.pickUpTime,
      depositTakenDate: formData.depositTakenDate,
      docsSigned: formData.docsSigned,
      tradeRepairs: formData.tradeRepairs,
      seenTrade: formData.seenTrade,
      lastNote: formData.lastNote,
      dLCopy: formData.dLCopy,
      insCopy: formData.insCopy,
      testDrForm: formData.testDrForm,
      voidChq: formData.voidChq,
      loanOther: formData.loanOther,
      signBill: formData.signBill,
      ucda: formData.ucda,
      tradeInsp: formData.tradeInsp,
      customerWS: formData.customerWS,
      otherDocs: formData.otherDocs,
      urgentFinanceNote: formData.urgentFinanceNote,
      funded: formData.funded,
      countsInPerson: formData.countsInPerson,
      countsPhone: formData.countsPhone,
      countsSMS: formData.countsSMS,
      countsOther: formData.countsOther,
      countsEmail: formData.countsEmail,
    }
    const brand = formData.brand
    switch (brand) {
      case "Manitou":
        const updatingManitouFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
        return json({ updatingManitouFinance });
      case "Switch":
        const updatingSwitchFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
        return json({ updatingSwitchFinance });
      case "BMW-Motorrad":
        const updatingBMWMotoFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
        return json({ updatingBMWMotoFinance });
      default:
        const update = await updateFinanceWithDashboard(financeId, financeData, dashData);

        return json({ update })
    }
    return json({ updating })
  }
  // calls
  if (intent === "EmailClient") {
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.customContent,
      title: formData.subject,
      direction: formData.direction,
      result: formData.customerState,
      subject: formData.subject,
      type: 'Email',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const completeApt = await CompleteLastAppt(userId, financeId)
    const sendEmail = await EmailFunction(request, params, user, financeId, formPayload)
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    const saveComms = await ComsCount(financeId, 'Email')

    return json({ saveComms, sendEmail, completeApt, formData, setComs, })//, redirect(`/dummyroute`)
  }
  if (intent === 'PhoneCall') {
    const textfollowUpDay = formData.followUpDay2
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const completeApt = await CompleteLastAppt(userId, financeId)
    const followUpDay3 = textfollowUpDay
    const doTGwoDays = await TwoDays(followUpDay3, formData, financeId, user)

    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    const saveComms = await ComsCount(financeId, 'Phone')

    return json({ doTGwoDays, completeApt, setComs, saveComms });
  }
  if (intent === 'textQuickFU') {
    console.log('hit textquick fu')
    const followUpDay3 = formData.followUpDay
    const completeApt = await CompleteLastAppt(userId, financeId)
    const doTGwoDays = await TwoDays(followUpDay3, formData, financeId, user)
    // const setComs = await CreateCommunications(comdata)
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    const saveComms = await ComsCount(financeId, 'SMS')
    return json({ doTGwoDays, completeApt, setComs, saveComms });
  }
  if (intent === "2DaysFromNow") {
    const lastContact = new Date().toISOString();
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }
    const followUpDay2 = parseInt(formData.followUpDay1);
    console.log('followUpDay:', followUpDay2);  // Add this line

    function addDays(days) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + days);
      return currentDate;
    }

    const complete = await CompleteLastAppt(userId, financeId)

    const completeApt = await CompleteLastAppt(userId, financeId)

    let newDate = addDays(followUpDay2);
    newDate = new Date(newDate).toISOString();
    //  console.log('financeId:', financeId);  // Add this line

    let clientAptsData = {
      title: formData.title,
      start: newDate,

      //end: formData.end,
      userId: user?.id,
      contactMethod: formData.contactMethod,
      completed: 'no',
      apptStatus: formData.apptStatus,
      apptType: formData.apptType,
      note: formData.note,
      unit: formData.unit,
      brand: formData.brand,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      //  financeId: formData.financeId,
      //description,
      userName: user?.name,
      messageTitle: 'Contacted by Instant Function',

      // direction: 'Outgoing',
      resultOfcall: 'Attempted',

    };

    const nextAppointment = newDate
    const followUpDay = newDate
    const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, dashboardId }
    const updating = await updateFinance23(financeId, formData3, formPayload);
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });


    const createFollowup = await prisma.clientApts.create({
      data: {
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        brand: formData.brand,
        unit: formData.unit,
        note: formData.note,
        apptType: formData.apptType,
        apptStatus: formData.apptStatus,
        completed: 'no',
        contactMethod: formData.contactMethod,
        end: formData.end,
        title: formData.title,
        start: newDate,
        userId: user?.id,
        description: formData.description,
        resourceId: Number(formData.resourceId),
        userName: user?.name,
        financeId: formData.financeId,
      }
    })


    //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
    return json({ complete, updating, completeApt, createFollowup, setComs });
  }
  if (intent === "completeApt") {
    console.log('completeApt')
    const complete = CompleteLastAppt(userId, financeId)
    const addFU = formData.addFU
    const addDetailedFU = formData.addDetailedFU

    if (addFU === 'on') {
      const followUpDay3 = formData.followUpDay
      const twoDays = await TwoDays(followUpDay3, formData, financeId, user)
      return json({ complete, twoDays })
    }
    if (addDetailedFU === 'yes') {
      const followup = await FollowUpApt(formData, user, userId)
      return json({ complete, followup })
    }

  }
  if (intent === "scheduleFUp") {
    const lastContact = new Date().toISOString();
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }
    let dateModal = new Date(formData.dateModal);
    const timeOfDayModal = formData.timeOfDayModal;
    const [hours, minutes] = timeOfDayModal.split(':').map(Number);
    dateModal.setHours(hours, minutes);
    const year = dateModal.getFullYear();
    const month = String(dateModal.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed in JavaScript
    const day = String(dateModal.getDate()).padStart(2, '0');
    const hour = String(dateModal.getHours()).padStart(2, '0');
    const minute = String(dateModal.getMinutes()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day}T${hour}:${minute}:00.000`;
    console.log(dateTimeString, 'datemodal');

    let clientAptsData = {
      title: formData.title,
      start: dateTimeString,
      //end: formData.end,
      contactMethod: formData.contactMethod,
      completed: formData.completed,
      apptStatus: formData.apptStatus,
      apptType: formData.apptType,
      note: formData.note,
      unit: formData.unit,
      brand: formData.brand,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      resourceId: formData.resourceId,
      //  financeId: formData.financeId,
      //description,
      userName: user?.name,
      //  direction: 'Outgoing',
      resultOfcall: 'Attempted',
      userId,
    };
    const completeApt = await CompleteLastAppt(userId, financeId)

    const nextAppointment = dateTimeString
    const followUpDay = dateTimeString
    const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, dashboardId }
    const updating = await updateFinance23(financeId, formData3, formPayload);

    const createFollowup = await prisma.clientApts.create({
      data: {
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        brand: formData.brand,
        unit: formData.unit,
        note: formData.note,
        apptType: formData.apptType,
        apptStatus: formData.apptStatus,
        completed: 'no',
        contactMethod: formData.contactMethod,
        end: formData.end,
        title: formData.title,
        start: dateTimeString,
        userId: user?.id,
        description: formData.description,
        resourceId: Number(formData.resourceId),
        userName: user?.name,
        financeId: formData.financeId,
      }
    })
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      type: 'Text',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });

    //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
    return json({ updating, completeApt, createFollowup, setComs });
  }
  if (intent === "updateFinance") {
    console.log(formData, ' update finance data')
    const updating = await updateFinance23(financeId, formData, formPayload);
    console.log(financeId, "updating");
    return updating;
  }
  // create
  if (intent === "createQuote") {
    console.log("creating quote");
    const brand = formData.brand;
    const financeId = formData.id;
    return redirect(`/quote/${brand}/${financeId}`);
  }
  // update
  if (intent === "updateStatus") {
    delete formData.brand;
    //console.log(formData)
    await UpdateStatus(formData);
    return UpdateStatus;
  }
  // navigation
  if (intent === "clientProfile") {
    console.log(clientfileId, financeId, 'dashboard calls')
    return redirect(`/customer/${clientfileId}/${financeId}`, {
      headers: { "Set-Cookie": cookie }
    });
  }
  if (intent === "returnToQuote") {
    const brand = formData.brand;
    const id = formData.id;
    //   console.log(id, 'id', `/overview/${brand}/${id}`)
    return redirect(`/overview/customer/${financeId}`);
  }
  // appts
  if (intent === "addAppt") {
    CreateAppt(formData);
    const completeCall = CompleteLastAppt(userId, financeId);
    return CreateAppt;
  }
  if (intent === "deleteApt") {
    const newFormData = { ...formData };
    delete newFormData.intent;
    const deleteNote = await deleteFinanceAppts(newFormData);
    return json({ deleteNote });
  }
  if (intent === "updateFinanceAppt") {
    const apptId = formData.id;
    const updateApt = await UpdateAppt(formData, apptId);
    return json({ updateApt });
  }
  // customer
  if (intent === "AddCustomer") {
    await createFinanceCheckClientDFirst(
      finance,
      email,
      clientData,
      financeId,
      userId
    );
    return createFinanceCheckClientDFirst;
  }
  if (intent === "deleteCustomer") {
    await DeleteCustomer({ formData, formPayload });
    return DeleteCustomer;
  }
  // notes
  if (intent === "saveFinanceNote") {
    await updateFinanceNotes({ formData });
    return updateFinanceNotes;
  }
  if (intent === "createFinanceNote") {
    await createFinanceNotes({ formData });
    return createFinanceNotes;
  }
  if (intent === "updateFinanceNote") {
    const updateNote = await updateFinanceNote(financeId, formData);
    return json({ updateNote });
  }
  if (intent === "deleteFinanceNote") {
    const deleteNote = await deleteFinanceNote(id);
    return json({ deleteNote });
  }
  return null;
};
