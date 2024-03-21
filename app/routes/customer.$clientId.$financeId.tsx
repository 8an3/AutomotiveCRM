/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { unstable_createFileUploadHandler, unstable_parseMultipartFormData, } from "@remix-run/node";
import React, { createContext, useEffect, useRef, useState } from "react";
import { ClientResultFunction, ClientStateFunction, } from "~/components/lists/clientResultList";
import { RemixNavLink, Input, Separator, Button, TextArea, Label, Tabs, TabsList, TabsTrigger, TabsContent, } from "~/components";
import { type DataFunctionArgs, type ActionFunction, json, } from '@remix-run/node'
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getDataKawasaki, getFinanceWithDashboard, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou, getFinance, getClientFileByEmail, getClientFileById } from "~/utils/finance/get.server";
import { getAllFinanceNotes } from '~/utils/financeNote/get.server';
import { DropdownMenu as DownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/other/dropdown-menu";
import { getAllFinanceApts, getAllFinanceApts2 } from "~/utils/financeAppts/get.server";
import { getDocsbyUserId } from "~/utils/docTemplates/get.server";
import { Badge } from "~/other/badge";
import { getAppointmentsForFinance } from "~/utils/client/getClientAptsForFile.server";
import { Topsection } from "~/components/dashboardCustId/topSection";
import { ClientTab } from "~/components/dashboardCustId/clientTab";
import { PartsTab } from "~/components/dashboardCustId/partsTab";
import { SalesTab } from "~/components/dashboardCustId/salesTab";
import { SalesComms } from "~/components/dashboardCustId/salesComs";
import financeFormSchema from "./overviewUtils/financeFormSchema";
import { updateClientFileRecord, updateFinanceWithDashboard } from "~/utils/finance/update.server";
import { updateClientFile } from "~/utils/client/client.server";
import SaveFinanceNote from "~/components/dashboard/calls/actions/createFinanceNote";
import DeleteCustomer from "~/components/dashboard/calls/actions/DeleteCustomer";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import { updateFinanceNote } from "~/utils/financeNote/update.server";
import UpdateAppt from "~/components/dashboard/calls/actions/updateAppt";
import { getMergedFinance, getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import { getComsOverview } from "~/utils/communications/communications.server";
import { prisma } from "~/libs";
import { commitSession as commitIds, getSession as getIds } from '~/utils/misc.user.server';
import { getSession } from "~/sessions/auth-session.server";
import { SetClient66, requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";
import { client_66 } from '~/utils/misc.user.server';
import { UpdateLeadBasic, UpdateClientFromActivix, UpdateLeadEchangeVeh, UpdateLeadPhone, UpdateLeadWantedVeh, UpdateLeademail, CreateNote, UpdateNoteCreateTask, CompleteTask, UpdateTask, ListAllTasks, UpdateNote } from "./api.activix";

async function GetMergedWithActivix(financeId) {
  try {
    const financeData = await prisma.finance.findMany({
      where: {
        id: financeId,
      },
    });
    console.log('financeData:', financeData); // Debugging line

    const dashData = await prisma.dashboard.findMany({
      where: {
        financeId: financeId,
      },
    });
    console.log('dashData:', dashData); // Debugging line
    const activixData = await prisma.activixLead.findUnique({ where: { activixId: financeData.activixId } })
    /// Merge financeData and dashData
    const mergedData = financeData.map((financeRecord) => {
      console.log('financeRecord.id:', financeRecord.id); // Debugging line
      const correspondingDashRecord = dashData.find(dashRecord => dashRecord.financeId === financeRecord.id);
      console.log('correspondingDashRecord:', correspondingDashRecord); // Debugging line
      return {
        ...activixData,
        ...correspondingDashRecord,
        ...financeRecord,
      };
    });


    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}

export const action: ActionFunction = async ({ req, request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      activixActivated: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  if (!user) { redirect('/login') }
  let formData = financeFormSchema.parse(formPayload)
  const intent = formData.intent

  const idSession = await getIds(request.headers.get("Cookie"));
  const userId = idSession.get('userId')
  const clientfileId = idSession.get('clientfileId')
  const financeId = idSession.get('financeId')
  const dashboardId = idSession.get('dashboardId')

  // console.log('headeras', userId, clientfileId, financeId, dashboardId)

  if (intent === 'createOrder') {
    let partNumbers = formData["partNumbers[]"];

    //(formData)
    try {
      // Create the PartsOrder first
      let partsOrder = await prisma.partsOrder.create({
        data: {
          userId: userId,
          clientfileId: clientfileId,
        },
      });

      // Then create a PartsOrderDetail for each part number
      for (let partNumber of partNumbers) {
        await prisma.partsOrderDetail.create({
          data: {
            orderNumber: partsOrder.orderNumber,
            partNumber,
          },
        });
      }

      return partsOrder
    } catch (error) {
      console.error(error);
      // Handle the error appropriately here
    } finally {
      // this code runs whether an error occurred or not
    }
  }
  if (intent === 'uploadFile') {
    // makwe new record save file name and finance to get it later or display it in a list forr people to downlaod
    /** const handler = unstable_createFileUploadHandler({
       directory: `${process.cwd()}/public/uploads`,
       file: ({ filename }) => filename,
       maxFileSize: 50_000_000
     });

     const formData = await unstable_parseMultipartFormData(request, handler);
     const file = formData.get("file") as File;
     const uploadedDocs = await prisma.uploadDocs.create({
       data: {
         userId: userId,
         category: formData.category,
         financeId: financeId,
         fileName: file.name,
       }
     })
     return {

       url: `/uploads/${file.name}`,
       size: file.size,
       name: file.name
     }; */
  }
  if (intent === 'deleteCustomer') {
    await DeleteCustomer({ formData, formPayload })
    return DeleteCustomer
  }
  // appointment
  if (intent === 'updateFinanceAppt') {
    const apptId = formData.apptId
    const updateApt = await UpdateAppt(formData, apptId)
    if (user?.activixActivated === 'yes') {
      await UpdateTask(formData)
    }
    return json({ updateApt });
  }
  if (intent === 'addAppt') {
    const createApt = createClientApts(formData)
    const LastContacted = LastContacted(formData)
    if (user.activixActivated === 'yes') {
      await CreateTask(formData)
    }

    return (createApt)
  }
  if (intent === 'deleteApt') {
    const newFormData = { ...formData };
    delete newFormData.intent;
    const deleteNote = await deleteFinanceAppts(newFormData)

    return json({ deleteNote });
  }
  if (intent === 'completeApt') {
    // console.log('hit completeapt')
    let customerState = formData.customerState
    if (customerState === 'Pending') { customerState = 'Attempted' }
    const completed = 'yes'
    const apptStatus = 'completed'
    const apptId = formData.messageId
    formData = { ...formData, completed, apptStatus, customerState }
    const updateApt = await UpdateAppt(formData, apptId)
    if (user.activixActivated === 'yes') {
      await UpdateTask(formData)
    }
    if (user?.activixActivated === 'yes') {
      await UpdateNote(formData)
    }
    return json({ updateApt });
  }
  // notes

  if (intent === 'updateFinanceNote') {
    const noteId = formData.id
    const noteData = {
      author: formData.author,
      customerId: formData.customerId,
      customContent: formData.customContent,
      urgentFinanceNote: formData.urgentFinanceNote,
      financeId: formData.financeId,
      dept: formData.dept,

    }

    const updateNote = await updateFinanceNote(noteId, noteData)
    if (user?.activixActivated === 'yes') {
      await UpdateNote(formData)
    }
    return json({ updateNote });
  }
  if (intent === 'saveFinanceNote') {
    await SaveFinanceNote({ formData, })
    const notiFinance = await prisma.finance.findUnique({ where: { id: formData.financeId }, });
    let notification;
    if (formData.userEmail !== notiFinance.userEmail) {
      notification = await prisma.notificationsUser.create({
        data: {
          title: `Note left on ${notiFinance?.name} by ${user?.username}`,
          //  content: formData.content,
          read: 'false',
          type: 'Note',
          content: formData.customContent,
          userId: user?.id,
          financeId: formData.financeId,
          clientfileId: formData.clientfileId,
        },
      });
    }
    let saved
    if (formData.ccUser) {
      saved = await prisma.notificationsUser.create({
        data: {
          title: `New note on ${formData.name}'s file.`,
          content: `Note left by ${formData.author}`,
          read: 'no',
          userId: formData.ccUser,
          financeId: financeId,
          clientfileId: clientfileId,
        }
      })
    }
    if (user?.activixActivated === 'yes') {
      await CreateNote(formData)
    }
    return json({ SaveFinanceNote, notification, saved })
  }
  if (intent === 'deleteFinanceNote') {
    const id = formData.id
    const deleteNote = await deleteFinanceNote(id)
    return json({ deleteNote });
  }
  // wanted unit
  if (intent === 'updateFinance') {

    let brand = formPayload.brand
    let customerState = formData.customerState
    if (formData.customerState === 'Pending') {
      customerState = 'Pending'
    }
    if (formData.customerState === 'Attempted') {
      customerState = 'Attempted'
    }
    if (formData.customerState === 'Reached') {
      customerState = 'Reached'
    }
    if (formData.customerState === 'Lost') {
      customerState = 'Lost'
    }
    if (formData.sold === 'on') {
      customerState = 'sold'
    }
    if (formData.depositMade === 'on') {
      customerState = 'depositMade'
    }
    if (formData.turnOver === 'on') {
      customerState = 'turnOver'
    }
    if (formData.financeApp === 'on') {
      customerState = 'financeApp'
    }
    if (formData.approved === 'on') {
      customerState = 'approved'
    }
    if (formData.signed === 'on') {
      customerState = 'signed'
    }
    if (formData.pickUpSet === 'on') {
      customerState = 'pickUpSet'
    }
    if (formData.delivered === 'on') {
      customerState = 'delivered'
    }
    if (formData.refund === 'on') {
      customerState = 'refund'
    }
    if (formData.funded === 'on') {
      customerState = 'funded'
    }
    let pickUpDate = ''
    let lastContact = new Date().toISOString()
    const typeOfContact = formData.typeOfContact
    const timeToContact = formData.timeToContact
    const financeId = formData.financeId
    const userEmail = formData.userEmail
    brand = formData.brand
    // console.log('1111', formData.financeId, '2222')

    delete formData.financeId
    delete formData.timeToContact
    delete formData.typeOfContact
    delete formData.userEmail
    delete formData.brand
    delete formData.intent
    delete formData.state


    const finance = {

      userEmail: user?.email,
      pickUpDate,
      lastContact
    }
    const financeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal: formData.postal,
      province: formData.province,
      dl: formData.dl,
      customerState: customerState,

    }
    const clientData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal: formData.postal,
      province: formData.province,
      dl: formData.dl,
    }
    delete clientData.financeId
    delete financeData.financeId
    // console.log(financeData, 'financeData', finance, 'finance', clientData, 'clientData', financeId)
    //   console.log(formData, 'formData from dashboardAL')
    switch (brand) {
      case "Manitou":
        const updatingManitouFinance = await updateFinanceWithDashboard(financeId, financeData, finance);
        return json({ updatingManitouFinance });
      case "Switch":
        const updatingSwitchFinance = await updateFinanceWithDashboard(financeId, financeData, finance);
        return json({ updatingSwitchFinance });
      case "BMW-Motorrad":
        const updatingBMWMotoFinance = await updateFinanceWithDashboard(financeId, financeData, finance);
        return json({ updatingBMWMotoFinance });
      default:
        // console.log(financeData, 'financeData', finance, 'finance', clientData, 'clientData')

        const updateClient = await updateFinanceWithDashboard(financeId, financeData, finance)
        if (user?.activixActivated === 'yes') {
          await UpdateLeadBasic(formData, user)
          await UpdateLeademail(formData)
          await UpdateLeadPhone(formData)
          await UpdateLeadWantedVeh(formData)
          await UpdateLeadEchangeVeh(formData)
        }
        return json({ updateClient })
    }
  }
  // update wanted unit
  if (intent === 'updateWantedUnit') {
    const financeData = {
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      trim: formData.trim,
      stockNum: formData.stockNum,
      modelCode: formData.modelCode,
      color: formData.color,
      vin: formData.vin,
    }
    const finance = []
    const updateClient = await updateFinanceWithDashboard(financeId, financeData, finance)

    if (user.activixActivated === 'yes') {
      await UpdateLeadWantedVeh(formData)
    }
    return json({ updateClient, })
  }
  if (intent === 'dealProgress') {

    const currentDate = new Date().toISOString();

    const updateData = {};

    if (!formData.reached) updateData.reached = currentDate;
    if (!formData.attempted) updateData.attempted = currentDate;
    if (!formData.visited) updateData.visited = currentDate;
    if (!formData.sold) updateData.sold = currentDate;
    if (!formData.depositMade) updateData.depositMade = currentDate;
    if (!formData.turnOver) updateData.turnOver = currentDate;
    if (!formData.applicationDone) updateData.applicationDone = currentDate;
    if (!formData.approved) updateData.approved = currentDate;
    if (!formData.signed) updateData.signed = currentDate;
    if (!formData.licensingSent) updateData.licensingSent = currentDate;
    if (!formData.liceningDone) updateData.liceningDone = currentDate;
    if (!formData.pickUpSet) updateData.pickUpSet = currentDate;
    if (!formData.delivered) updateData.delivered = currentDate;
    if (!formData.refund) updateData.refund = currentDate;
    if (!formData.funded) updateData.funded = currentDate;
    if (!formData.cancelled) updateData.cancelled = currentDate;
    if (!formData.lost) updateData.lost = currentDate;
    if (!formData.financeApp) updateData.financeApp = currentDate;
    if (!formData.testDrive) updateData.testDrive = currentDate;
    if (!formData.seenTrade) updateData.seenTrade = currentDate;
    if (!formData.metService) updateData.metService = currentDate;
    if (!formData.metManager) updateData.metManager = currentDate;
    if (!formData.metParts) updateData.metParts = currentDate;
    if (!formData.demoed) updateData.demoed = currentDate;

    const updateDealProgress = await prisma.dashboard.update({
      where: { financeId: formData.financeId },
      data: {
        ...updateData,
        pending: formData.pending,
        bookedApt: formData.bookedApt,
        aptShowed: formData.aptShowed,
        aptNoShowed: formData.aptNoShowed,
        referral: formData.referral,
      },
    });

    if (user.activixActivated === 'yes') {
      await UpdateLeadBasic(formData)
    }
    return json({ updateDealProgress })
  }
  // trade
  if (intent === 'updateTrade') {
    const financeData = {
      tradeMake: formData.tradeMake,
      tradeDesc: formData.tradeDesc,
      tradeYear: formData.tradeYear,
      tradeTrim: formData.tradeTrim,
      tradeColor: formData.tradeColor,
      tradeMileage: formData.tradeMileage,
      tradeVin: formData.tradeVin,
    }
    const finance = []
    const updateClient = await updateFinanceWithDashboard(financeId, financeData, finance)
    if (user?.activixActivated === 'yes') {
      await UpdateLeadWantedVeh(financeData)
    }
    return json({ updateClient, })
  }
  // client info
  if (intent === 'updateClientInfoFinance') {
    //console.log(formData.dashboardId, formData.clientId, formData.financeId, formData.clientfileId, formData.id, 'updateClientInfoFinance')
    const updateClient = await prisma.clientfile.update({
      where: { id: formData.clientId },
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postal: formData.postal,
        dl: formData.dl,
      }
    })
    if (user?.activixActivated === 'yes') {
      await UpdateLeadBasic(formData)
      await UpdateLeademail(formData)
      await UpdateLeadPhone(formData)
    }

    return json({ updateClient })
  }
  else return null
}

export async function loader({ params, request }: DataFunctionArgs) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      activixActivated: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  if (!user) { redirect('/login') }

  const userId = user?.id
  const deFees = await getDealerFeesbyEmail(user.email)
  let clientfileId = undefined
  let { clientId, financeId } = params;
  if (clientfileId === undefined) { clientfileId = clientId }
  let sliderWidth = 50

  const aptFinance3 = await getAppointmentsForFinance(financeId)
  let finance
  if (user?.activixActivated === 'yes') {
    await UpdateClientFromActivix(finance)
    finance = await GetMergedWithActivix(financeId)
  } else {
    finance = await getMergedFinanceOnFinance(financeId)
  }
  const dashboardIdCookie = await prisma.finance.findUnique({ where: { id: financeId } })
  const SetClient66Cookie = await SetClient66(userId, clientId, financeId, dashboardIdCookie.dashboardId, request)

  const brand = finance?.brand
  const financeNotes = await getAllFinanceNotes(financeId)
  const docTemplates = await getDocsbyUserId(userId)
  const clientFile = await getClientFileById(clientfileId)
  const Coms = await getComsOverview(financeId)
  const dealerFees = await prisma.dealerFees.findUnique({ where: { userEmail: user?.email } })
  const dealerInfo = await prisma.dealerInfo.findFirst()

  let merged = {


    tradeMileage: finance[0].tradeMileage,
    userName: user?.username,
    year: finance[0].year === null ? ' ' : finance[0].year,
    tradeYear: finance[0].tradeYear === null ? ' ' : finance[0].tradeYear,
    vin: finance[0].vin === null ? ' ' : finance[0].vin,
    tradeVin: finance[0].tradeVin === null ? ' ' : finance[0].tradeVin,
    stockNum: finance[0].stockNum === null ? ' ' : finance[0].stockNum,
    namextwar: finance[0].userExtWarr === null ? ' ' : 'Extended Warranty',
    asdasd: finance[0].userOther === null ? ' ' : 'Other',
    nameloan: finance[0].userLoanProt === null ? ' ' : 'Loan Protection',
    namegap: finance[0].userGap === null ? ' ' : 'Gap Insurance',
    nameTireandRim: finance[0].userTireandRim === null ? ' ' : 'Warranty',
    namevinE: finance[0].vinE === null ? ' ' : 'Vin Etching',
    namerust: finance[0].rustProofing === null ? ' asdasdsa' : 'Rust Proofing',
    namelife: finance[0].lifeDisability === null ? ' ' : 'Life and Disability Ins.',
    nameservice: finance[0].userServicespkg === null ? ' ' : 'Service Package',
    namedelivery: finance[0].deliveryCharge === null ? ' ' : 'Delivery Charge',
    userGovern: Number(dealerFees?.userGovern) < 0 ? ' ' : dealerFees?.userGovern,
    nameGovern: Number(dealerFees?.userGovern) < 0 ? ' ' : 'Government Fees',
    userAirTax: Number(dealerFees?.userAirTax) < 0 ? ' ' : dealerFees?.userAirTax,
    nameAirTax: Number(dealerFees?.userAirTax) < 0 ? ' ' : 'Air Tax',
    userTireTax: Number(dealerFees?.userTireTax) < 0 ? ' ' : dealerFees?.userTireTax,
    nameTireTax: Number(dealerFees?.userTireTax) < 0 ? ' ' : 'Tire Tax',
    userFinance: Number(dealerFees?.userFinance) < 0 ? ' ' : dealerFees?.userFinance,
    nameFinance: Number(dealerFees?.userFinance) < 0 ? ' ' : 'Finance Fee',
    destinationCharge: Number(dealerFees?.destinationCharge) < 0 ? ' ' : dealerFees?.destinationCharge,
    namedestinationCharge: Number(dealerFees?.destinationCharge) < 0 ? ' ' : 'Destination Charge',
    userMarketAdj: Number(dealerFees?.userMarketAdj) < 0 ? ' ' : dealerFees?.userMarketAdj,
    nameMarketAdj: Number(dealerFees?.userMarketAdj) < 0 ? ' ' : 'Market Adjustment',
    userOMVIC: Number(dealerFees?.userOMVIC) < 0 ? ' ' : dealerFees?.userOMVIC,
    nameOMVIC: Number(dealerFees?.userOMVIC) < 0 ? ' ' : 'OMVIC / Gov Fee',
    userDemo: Number(dealerFees?.userDemo) < 0 ? ' ' : dealerFees?.userDemo,
    nameDemo: Number(dealerFees?.userDemo) < 0 ? ' ' : 'Demonstration Fee',
    discountPer: Number(finance[0].discountPer) < 0 ? ' ' : finance[0].discountPer,
    namediscountPer: Number(finance[0].discountPer) < 0 ? ' ' : 'Discount %',
    discount: Number(finance[0].discount) < 0 ? ' ' : finance[0].discount,
    namediscount: Number(finance[0].discount) < 0 ? ' ' : 'Discount',
    namefreight: Number(finance[0].freight) < 0 ? ' ' : 'Freight',
    nameadmin: Number(finance[0].admin) < 0 ? ' ' : 'Admin',
    namepdi: Number(finance[0].pdi) < 0 ? ' ' : 'PDI',
    namcomm: Number(finance[0].commodity) < 0 ? ' ' : 'Commodity',
    nameaccessories: Number(finance[0].accessories) < 0 ? ' ' : 'Other Accessories',
    namelabour: Number(finance[0].labour) < 0 ? ' ' : 'Labour',
    netDifference: (Number(finance[0].total) - Number(finance[0].tradeValue)),
    hstSubTotal: (Number(finance[0].total) + Number(finance[0].onTax)),
    withLicensing: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing)),
    withLien: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing) + Number(finance[0].lien)),
    payableAfterDel: (Number(finance[0].total) + Number(finance[0].onTax) + Number(finance[0].licensing) + Number(finance[0].lien) - Number(finance[0].deposit)),

    dealerName: dealerInfo?.dealerName,
    dealerAddress: dealerInfo?.dealerAddress,
    dealerProv: `${dealerInfo?.dealerCity}, ${dealerInfo?.dealerProv}, ${dealerInfo?.dealerPostal}`,
    dealerPhone: dealerInfo?.dealerPhone,
    userLoanProt: finance[0].userLoanProt,
    userTireandRim: finance[0].userTireandRim,
    userGap: finance[0].userGap,
    userExtWarr: finance[0].userExtWarr,
    userServicespkg: finance[0].userServicespkg,
    vinE: finance[0].vinE,
    lifeDisability: finance[0].lifeDisability,
    rustProofing: finance[0].rustProofing,
    userLicensing: dealerFees?.userLicensing,
    //  userFinance: dealerFees?.userFinance,
    //  userDemo: dealerFees?.userDemo,
    userGasOnDel: dealerFees?.userGasOnDel,
    //   userOMVIC: dealerFees?.userOMVIC,
    userOther: finance[0].userOther,
    userTax: dealerFees?.userTax,
    //  userAirTax: dealerFees?.userAirTax,
    //  userTireTax: dealerFees?.userTireTax,
    //  userGovern: dealerFees?.userGovern,
    userPDI: dealerFees?.userPDI,
    userLabour: dealerFees?.userLabour,
    //  userMarketAdj: dealerFees?.userMarketAdj,
    userCommodity: dealerFees?.userCommodity,
    // destinationCharge: dealerFees?.destinationCharge,
    userFreight: dealerFees?.userFreight,
    userAdmin: dealerFees?.userAdmin,
    iRate: finance[0].iRate,
    months: finance[0].months,
    //  discount: finance[0].discount,
    total: finance[0].total,
    onTax: finance[0].onTax,
    on60: finance[0].on60,
    biweekly: finance[0].biweekly,
    weekly: finance[0].weekly,
    weeklyOth: finance[0].weeklyOth,
    biweekOth: finance[0].biweekOth,
    oth60: finance[0].oth60,
    weeklyqc: finance[0].weeklyqc,
    biweeklyqc: finance[0].biweeklyqc,
    qc60: finance[0].qc60,
    deposit: finance[0].deposit,
    biweeklNatWOptions: finance[0].biweeklNatWOptions,
    weeklylNatWOptions: finance[0].weeklylNatWOptions,
    nat60WOptions: finance[0].nat60WOptions,
    weeklyOthWOptions: finance[0].weeklyOthWOptions,
    biweekOthWOptions: finance[0].biweekOthWOptions,
    oth60WOptions: finance[0].oth60WOptions,
    biweeklNat: finance[0].biweeklNat,
    weeklylNat: finance[0].weeklylNat,
    nat60: finance[0].nat60,
    qcTax: finance[0].qcTax,
    otherTax: finance[0].otherTax,
    totalWithOptions: finance[0].totalWithOptions,
    otherTaxWithOptions: finance[0].otherTaxWithOptions,
    desiredPayments: finance[0].desiredPayments,
    freight: finance[0].freight,
    admin: finance[0].admin,
    commodity: finance[0].commodity,
    pdi: finance[0].pdi,
    //   discountPer: finance[0].discountPer,
    deliveryCharge: finance[0].deliveryCharge,
    paintPrem: finance[0].paintPrem,
    msrp: finance[0].msrp,
    licensing: finance[0].licensing,
    options: finance[0].options,
    accessories: finance[0].accessories,
    labour: finance[0].labour,
    //year: finance[0].year,
    brand: finance[0].brand,
    model: finance[0].model,
    //  stockNum: finance[0].stockNum,
    model1: finance[0].model1,
    color: finance[0].color,
    modelCode: finance[0].modelCode,
    tradeValue: finance[0].tradeValue,
    tradeDesc: finance[0].tradeDesc,
    tradeColor: finance[0].tradeColor,
    //  tradeYear: finance[0].tradeYear,
    tradeMake: finance[0].tradeMake,
    //  tradeVin: finance[0].tradeVin,
    tradeTrim: finance[0].tradeTrim,
    //  tradeMileage: finance[0].tradeMileage,
    trim: finance[0].trim,
    //vin: finance[0].vin,
    lien: finance[0].lien,

    date: new Date().toLocaleDateString(),
    dl: finance[0].dl,
    email: finance[0].email,
    firstName: finance[0].firstName,
    lastName: finance[0].lastName,
    phone: finance[0].phone,
    name: finance[0].name,
    address: finance[0].address,
    city: finance[0].city,
    postal: finance[0].postal,
    province: finance[0].province,
    referral: finance[0].referral,
    visited: finance[0].visited,
    bookedApt: finance[0].bookedApt,
    aptShowed: finance[0].aptShowed,
    aptNoShowed: finance[0].aptNoShowed,
    testDrive: finance[0].testDrive,
    metService: finance[0].metService,
    metManager: finance[0].metManager,
    metParts: finance[0].metParts,
    sold: finance[0].sold,
    depositMade: finance[0].depositMade,
    refund: finance[0].refund,
    turnOver: finance[0].turnOver,
    financeApp: finance[0].financeApp,
    approved: finance[0].approved,
    signed: finance[0].signed,
    pickUpSet: finance[0].pickUpSet,
    demoed: finance[0].demoed,
    delivered: finance[0].delivered,
    status: finance[0].status,
    customerState: finance[0].customerState,
    result: finance[0].result,
    notes: finance[0].notes,
    metSalesperson: finance[0].metSalesperson,
    metFinance: finance[0].metFinance,
    financeApplication: finance[0].financeApplication,
    pickUpTime: finance[0].pickUpTime,
    depositTakenDate: finance[0].depositTakenDate,
    docsSigned: finance[0].docsSigned,
    tradeRepairs: finance[0].tradeRepairs,
    seenTrade: finance[0].seenTrade,
    lastNote: finance[0].lastNote,
    dLCopy: finance[0].dLCopy,
    insCopy: finance[0].insCopy,
    testDrForm: finance[0].testDrForm,
    voidChq: finance[0].voidChq,
    loanOther: finance[0].loanOther,
    signBill: finance[0].signBill,
    ucda: finance[0].ucda,
    tradeInsp: finance[0].tradeInsp,
    customerWS: finance[0].customerWS,
    otherDocs: finance[0].otherDocs,
    urgentFinanceNote: finance[0].urgentFinanceNote,
    funded: finance[0].funded,




  }

  if (user?.activixActivated === 'yes') {
    await UpdateLeadBasic(merged)
    await UpdateLeademail(merged)
    await UpdateLeadPhone(merged)
    await UpdateLeadWantedVeh(merged)
  }
  for (let key in merged) {
    merged[key] = String(merged[key]);
  }
  const getTemplates = await prisma.emailTemplates.findMany({
    where: {
      userEmail: email,
    },
  });
  const UploadedDocs = await prisma.uploadDocs.findMany({
    where: {
      financeId: finance?.id
    }
  });
  const userList = await prisma.user.findMany()
  const parts = await prisma.part.findMany()
  const clientUnit = await prisma.inventoryMotorcycle.findFirst({
    where: {
      stockNumber: merged.stockNum
    }
  })
  if (brand === 'Manitou') {
    const modelData = await getDataByModelManitou(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, clientfileId, modelData, finance, deFees, manOptions, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit })
  }
  if (brand === 'Switch') {
    const modelData = await getDataByModel(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, manOptions, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit, clientfileId })
  }
  if (brand === 'Kawasaki') {
    const modelData = await getDataKawasaki(finance);
    return json({ ok: true, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit, clientfileId })
  }
  if (brand === 'BMW-Motorrad') {
    const bmwMoto = await getLatestBMWOptions(financeId)
    const bmwMoto2 = await getLatestBMWOptions2(financeId)
    const modelData = await getDataBmwMoto(finance);
    return json({ ok: true, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientfileId, clientUnit })
  }
  if (brand === 'Triumph') {
    const modelData = await getDataTriumph(finance);
    return json({ ok: true, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit, clientfileId })
  }
  if (brand === 'Harley-Davidson') {
    const modelData = await getDataHarley(finance);
    const apptFinance2 = await getAllFinanceApts2(financeId)
    const aptFinance3 = await getAllFinanceApts(financeId)
    return json({ ok: true, getTemplates, SetClient66Cookie, Coms, merged, modelData, docs: docTemplates, clientFile, apptFinance2, aptFinance3, finance, deFees, sliderWidth, user, financeNotes, UploadedDocs, userList, parts, clientUnit, clientfileId })
  }
  if (brand === 'Indian' || brand === 'Can-Am' || brand === 'Sea-Doo' || brand === 'Ski-Doo' || brand === 'Suzuki' || brand === 'Spyder' || brand === 'Can-Am-SXS') {
    const modelData = await getDataByModel(finance)
    return json({ ok: true, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, financeId, UploadedDocs, userList, parts, clientUnit })

  }
  return json({ ok: true, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, finance, deFees, sliderWidth, user, financeNotes, financeId, UploadedDocs, userList, parts, clientUnit, clientfileId })
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const FinanceIdContext = React.createContext();

export default function CustomerProfile({ request, }) {
  const [selectedTab, setSelectedTab] = useState("Client");

  const fetcher = useFetcher();
  const { finance, user, clientFile, sliderWidth, aptFinance3, Coms, getTemplates, merged, clientUnit } = useLoaderData();
  //  console.log(merged, 'merged')
  const [financeIdState, setFinanceIdState] = useState();
  useEffect(() => {
    if (finance.id) {
      setFinanceIdState(finance.id)
    }
  }, [finance.id]);

  // console.log(finance, finance[0].id, 'finance', finance[0].id)
  let data = { ...finance, ...finance, ...user }
  const [outletSize, setOutletSize] = useState(sliderWidth);
  // toast
  const [open, setOpen] = React.useState(false);
  // calendar
  ///cahnge  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const pickUpDate = new Date('1969-06-15');

  const [value, onChange] = useState(pickUpDate);
  const timerRef = React.useRef(0);
  // card toggles

  const [tradeToggled, setTradeToggled] = useState(true);
  const [financeInfo, setFinanceInfo] = useState(true);
  const [PickUpCalendar, setPickUpCalendar] = useState('off');

  useEffect(() => {
    if (finance[0].tradeDesc === null || finance[0].tradeDesc === undefined || finance[0].tradeDesc === '') {
      setTradeToggled(false);
    }
    if (finance[0].approved !== 'on' || finance[0].turnOver !== 'on' || finance[0].financeApp !== 'on') {
      setFinanceInfo(false);
    }
  }, []);

  const submit = useSubmit();

  let isAdding =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "saveFinanceNote";

  let formRef = useRef();

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  // const id = finance[0].id ? finance[0].id.toString() : "";

  const [formData, setFormData] = useState({
    referral: finance[0].referral || "off",
    visited: finance[0].visited || "off",
    bookedApt: finance[0].bookedApt || "off",
    aptShowed: finance[0].aptShowed || "off",
    aptNoShowed: finance[0].aptNoShowed || "off",
    testDrive: finance[0].testDrive || "off",
    metService: finance[0].metService || "off",
    metManager: finance[0].metManager || "off",
    metParts: finance[0].metParts || "off",
    sold: finance[0].sold || "off",
    depositMade: finance[0].depositMade || "off",
    refund: finance[0].refund || "off",
    turnOver: finance[0].turnOver || "off",
    financeApp: finance[0].financeApp || "off",
    approved: finance[0].approved || "off",
    signed: finance[0].signed || "off",
    pickUpSet: finance[0].pickUpSet || "off",
    demoed: finance[0].demoed || "off",
    seenTrade: finance[0].seenTrade || "off",
    delivered: finance[0].delivered || "off",
    setPickUpDate: finance[0].setPickUpDate || "off",
  });


  const handleInputChange = (name, checked) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: checked ? "on" : "off",
        intent: 'updateFinance',
        author: user.name,
        id: finance[0].id,
      };

      // Submit the form with the updated data
      submit(updatedData);

      return updatedData;
    });
  };
  const generateHiddenInputs = () => {
    return ClientResultFunction({ formData }).map((item) => (
      <input
        key={item.name}
        type="hidden"
        defaultValue={item.value === "on" ? "on" : "off"}
        name={item.name}
      />
    ));
  };

  const generateHiddenInputsForState = () => {
    return ClientStateFunction().map((item) => {
      // Check if the value of the first input is 'on'
      const isFirstInputOn =
        ClientResultFunction({ formData }).find(
          (result) => result.name === item.name
        )?.value === "on";

      return (
        <>
          {isFirstInputOn && (
            <input
              key={`${item.name}-second`}
              type="hidden"
              defaultValue={item.value}
              name="customerState"
            />
          )}
        </>
      );
    });
  };

  let date = new Date(finance[0].pickUpDate); // "Wed Nov 29 2023 00:00:00 GMT-0500 (Eastern Standard Time)";
  let weekday = date.toLocaleString('default', { weekday: 'short' });
  let month = date.toLocaleString('default', { month: 'short' });
  let day = date.getDate();
  let year = date.getFullYear();
  let result = weekday + ' ' + month + ' ' + day + ' ' + year
  // console.log(finance, 'finance')
  let dateLastContact = new Date(finance[0].lastContact);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const formattedDate = data.nextAppointment && data.nextAppointment !== '1969-12-31 19:00' ? formatDate(data.nextAppointment) : 'TBD';


  let NewListForStatus = [

    { name: 'lastContact', value: finance[0].lastContact === '1969-12-31 19:00' || finance[0].lastContact === null ? 'TBD' : formatDate(finance[0].lastContact), label: 'Last Contacted', },
    { name: 'nextAppointment', value: formattedDate, label: 'Next Appt', },
    {
      name: 'deliveryDate',
      value: finance[0].customerState !== 'depositMade' ?
        (<Badge onClick={() => setPickUpCalendar('yes')} className="bg-green-600">Set Pick-Up Date</Badge>) :
        finance[0].customerState !== 'pickUpSet' ?
          (<Badge onClick={() => setPickUpCalendar(PickUpCalendar === 'yes' ? 'no' : 'yes')} className="cursor-pointer transform transform:translate-x-1 bg-green-600">{result}</Badge>) :
          finance[0].customerState !== 'delivered' ?
            (<Badge className="bg-green-600">Delivered</Badge>) :
            (<Badge onClick={() => setPickUpCalendar(PickUpCalendar === 'yes' ? 'no' : 'yes')} className="cursor-pointer   transform transform:translate-x-1 bg-green-600">{result ? result : "P/U not set"}</Badge>),

      label: 'Pick Up Date',
    }

  ]

  const [editItemId, setEditItemId] = useState(null);

  const handleEditClick = (itemId) => {
    setEditItemId(itemId);
  };

  let isDeleting =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "deleteFinanceNote";

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function isPast(date) {
    const today = new Date();
    return date < today;
  }


  //console.log(finance, 'finance')

  // console.log(clientFile, 'clientFile')
  return (
    <>
      <FinanceIdContext.Provider value={financeIdState}>

        <div className=" bg-black mt-[50px]">

          <Topsection
            getTemplates={getTemplates}
            user={user}
            NewListForStatus={NewListForStatus}
            PickUpCalendar={PickUpCalendar}
            formData={formData}
            onChange={onChange}
            value={value}
            handleInputChange={handleInputChange}
            generateHiddenInputs={generateHiddenInputs}
            generateHiddenInputsForState={generateHiddenInputsForState}
            timerRef={timerRef}
            open={open}
            setOpen={setOpen}
            fetcher={fetcher}
          />
        </div>
        <Tabs defaultValue="Client" >
          <TabsList className="mt-4 ml-2 grid w-[600px] grid-cols-5">
            <TabsTrigger value="Client" onClick={() => {
              setSelectedTab("null")
              setSelectedTab("Client")
            }}>Client</TabsTrigger>
            <TabsTrigger value="Sales" onClick={() => {
              setSelectedTab("null")
              setSelectedTab("Sales")
            }}>Sales</TabsTrigger>
            <TabsTrigger value="Parts" onClick={() => {
              setSelectedTab("null")
              setSelectedTab("Parts")
            }}>Parts</TabsTrigger>
            <TabsTrigger disabled value="Service" onClick={() => {
              setSelectedTab("null")
              setSelectedTab("Service")
            }}>Service</TabsTrigger>
            <TabsTrigger disabled value="Accessories" onClick={() => {
              setSelectedTab("null")
              setSelectedTab("Accessories")
            }}>Accessories</TabsTrigger>
          </TabsList>
          <TabsContent className="w-[98%] ml-2" value="Client">
            <ClientTab
              timerRef={timerRef}
              open={open}
              setOpen={setOpen}
              user={user}
            />
          </TabsContent>
          {selectedTab === "Sales" && (
            <TabsContent className="w-[98%]  ml-2 grid xl:grid-cols-2 grid-cols-1 " value="Sales">
              <SalesTab
                timerRef={timerRef}
                open={open}
                setOpen={setOpen}
                NewListForStatus={NewListForStatus}
                outletSize={outletSize}
                merged={merged}
                clientUnit={clientUnit}
              />
              <SalesComms
                Coms={Coms}
                user={user}
                handleEditClick={handleEditClick}
                aptFinance3={aptFinance3}
                isToday={isToday}
                isPast={isPast}
                editItemId={editItemId}
                setEditItemId={setEditItemId}
                handleChange={handleChange}
                isDeleting={isDeleting}
                submit={submit}
              />
            </TabsContent>
          )}
          {selectedTab === "Parts" && (
            <TabsContent className="w-[98%] ml-2" value="Parts">
              <PartsTab
                timerRef={timerRef}
                open={open}
                setOpen={setOpen}
                user={user}
              />
            </TabsContent>
          )}
        </Tabs>
      </FinanceIdContext.Provider>

    </>
  );
}

/**
  let FinanceDealInfo = [
    { name: "sold", value: finance[0].sold, placeholder: "Sold" },
    { name: "depositMade", value: finance[0].depositMade, placeholder: "Deposit" },
    { name: "sold1", value: finance[0].userLoanProt, placeholder: "Discussed Finance Products?" },
    { name: "appliedtoNB", value: finance[0].userLoanProt, placeholder: "Applied to NB", },
    { name: "appliedtoTD", value: finance[0].userLoanProt, placeholder: "Applied to TD", },
    { name: "appliedtoScotia", value: finance[0].userLoanProt, placeholder: "Applied to Scotia", },
    { name: "approved", value: finance[0].approved, placeholder: "Approved" },
    { name: "secondChance", value: finance[0].approved, placeholder: "Second Chance" },
    { name: "signed", value: finance[0].signed, placeholder: "Contract Signed" },
    { name: "financeDocsSigned", value: finance[0].userLoanProt, placeholder: "Finance Docs Signed" },
    { name: "sentDocs", value: finance[0].userLoanProt, placeholder: "Sent Docs" },
    { name: "funded", value: finance[0].userLoanProt, placeholder: "Funded" },
    { name: "registeredUserLoanProt", value: finance[0].userLoanProt, placeholder: 'Registered Loan Protection' },
    { name: "registeredUserGap", value: finance[0].userGap, placeholder: 'Registered Gap Protection' },
    { name: "registeredUserTireandRim", value: finance[0].userTireandRim, placeholder: 'Registered Tire and Rim' },
    { name: "registeredVinE", value: finance[0].vinE, placeholder: 'Registered Vin Etching' },
    { name: "registeredRustProofing", value: finance[0].rustProofing, placeholder: 'Registered Under Coating' },
    { name: "registeredUserServicespkg", value: finance[0].userServicespkg, placeholder: 'Registered Service Package' },
    { name: "registeredLifeDisability", value: finance[0].lifeDisability, placeholder: 'Registered Life and Disability' },
    { name: "registeredUserOther", value: finance[0].userLoanProt, placeholder: 'Registered Other data Package' },
    { name: "registereduserExtWarr", value: finance[0].userExtWarr, placeholder: 'Registered Extended Warranty' },
  ];

  const FinanceDealInputs = [
    { name: "lastContactFinance", value: finance[0].userLoanProt, placeholder: "Last Contact", },
    { name: "bank", value: finance[0].userLoanProt, placeholder: "Bank" },
    { name: "loanNumber", value: finance[0].userLoanProt, placeholder: "Loan Number", },
    { name: "dealNumber", value: finance[0].userLoanProt, placeholder: "Deal Number", },
    { name: "serviceNumber", value: finance[0].userLoanProt, placeholder: "Service Number", },
    { name: "amountToCollect", value: finance[0].userLoanProt, placeholder: "To Collect Day of P/U", },
  ];



  let Coms = [
    {
      id: '1',
      author: 'skler',
      createdAt: 'jan 3rd 2023',
      userName: 'skyler',
      financeId: 'clolg6koh0000uo4smoxjv0gt',
      userId: 'clolfwtvo00r3uo2kh340gi6w',
      messageTitle: 'freedom h-d',
      messageContent: 'good morning',
      attachments: '',
      comDirection: 'Inbound',
      comType: 'Phone Call',
    },
    {
      id: '2',
      createdAt: 'jan 3rd 2023',
      userName: 'skyler',
      financeId: 'clolg6koh0000uo4smoxjv0gt',
      userId: 'clolfwtvo00r3uo2kh340gi6w',
      messageTitle: 'freedom h-d',
      messageContent: 'good morning',
      attachments: '',
      comDirection: 'Inbound',
      comType: 'Phone Call',
    },

  ]
*/
