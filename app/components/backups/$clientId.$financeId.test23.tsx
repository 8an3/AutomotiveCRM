/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { ClientResultFunction, ClientStateFunction, } from "~/components/lists/clientResultList";
import { RemixNavLink, Input, Separator, Button, TextArea, Label, Tabs, TabsList, TabsTrigger, TabsContent, PopoverTrigger, PopoverContent, Popover, } from "~/components";
import { type DataFunctionArgs, type ActionFunction, json, type LinksFunction } from '@remix-run/node'
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getDataKawasaki, getFinanceWithDashboard, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou, getFinance, getClientFileByEmail, getClientFileById } from "~/utils/finance/get.server";
import { getAllFinanceNotes } from '~/utils/financeNote/get.server';
import { getAllFinanceApts, getAllFinanceApts2 } from "~/utils/financeAppts/get.server";
import { getDocsbyUserId } from "~/utils/docTemplates/get.server";
import { Badge } from "~/components/ui/badge";
import { getAppointmentsForFinance } from "~/utils/client/getClientAptsForFile.server";
import { Topsection } from "~/components/dashboardCustId/topSection";
import { ClientTab } from "~/components/dashboardCustId/clientTab";
import { PartsTab } from "~/components/dashboardCustId/partsTab";
import { SalesTab } from "~/components/dashboardCustId/salesTab";
import { SalesComms } from "~/components/dashboardCustId/salesComs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { updateClientFileRecord, updateFinanceWithDashboard } from "~/utils/finance/update.server";
import SaveFinanceNote from "~/components/dashboard/calls/actions/createFinanceNote";
import DeleteCustomer from "~/components/dashboard/calls/actions/DeleteCustomer";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import { updateFinanceNote } from "~/utils/financeNote/update.server";
import UpdateAppt from "~/components/dashboard/calls/actions/updateAppt";
import { getMergedFinance, getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import { getComsOverview } from "~/utils/communications/communications.server";
import { prisma } from "~/libs";
import { commitSession as commitIds, getSession as getIds, SetClient66 } from '~/utils/misc.user.server';
import { getSession } from "~/sessions/auth-session.server";
import { UpdateLeadBasic, UpdateLeadApiOnly, UpdateClientFromActivix, UpdateLeadEchangeVeh, UpdateLeadPhone, UpdateLeadWantedVeh, UpdateLeademail, CreateNote, UpdateNoteCreateTask, CompleteTask, UpdateTask, ListAllTasks, UpdateNote } from "~/routes/__authorized/dealer/api/activix";
import axios from "axios";
import { GetUser } from "~/utils/loader.server";
import base from "~/styles/base.css";
import { Cross2Icon, CaretSortIcon, CalendarIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import { Calendar } from '~/components/ui/calendar';
import { format } from "date-fns"
import { cn } from "~/components/ui/utils"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: base },

  { rel: "icon", type: "image/svg", href: '/user.svg' },
];

async function GetMergedWithActivix(financeId) {
  try {
    const financeData = await prisma.finance.findUnique({ where: { id: financeId, }, });
    const dashData = await prisma.dashboard.findUnique({ where: { id: financeData.dashboardId, }, });
    const activixData = await prisma.activixLead.findUnique({ where: { financeId: financeId } })
    const newData = {
      ...activixData,
      ...dashData,
      ...financeData,
    };
    console.log('newData:', newData);
    return newData
    return newData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}

async function PullActivix(financeData) {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  async function CallActi() {
    try {
      const response = await axios.get(`https://api.crm.activix.ca/v2/leads/${financeData.activixId}?include[]=emails&include[]=phones&include[]=vehicles&include[]=events`, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${accessToken}`, }
      });
      return response.data; // Return response data directly
    } catch (error) {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
      throw error; // Throw error to be caught by the caller
    }
  }
  const formData = await CallActi();
  try {
    const activixIdString = formData?.id.toString()
    const findFinance = await prisma.finance.findFirst({ where: { activixId: activixIdString } })
    const financeData = await prisma.finance.update({
      where: { id: findFinance?.id },
      data: {
        firstName: formData.first_name,
        lastName: formData.last_name,
        name: formData.first_name + ' ' + formData.last_name,
        email: formData.emails[0].address,
        phone: formData.phones[0].number,
        address: formData.address_line1,
        city: formData.city,
        postal: formData.postal_code,
        province: formData.province,
        year: formData.vehicles[1].year,
        brand: formData.vehicles[1].make,
        model: formData.vehicles[1].model,
        model1: formData.model1,
        color: formData.vehicles[1].color_exterior,
        modelCode: formData.modelCode,
        msrp: formData.vehicles[1].price,
        tradeValue: formData.vehicles[0].price,
        tradeDesc: formData.vehicles[0].model,
        tradeColor: formData.vehicles[0].color_exterior,
        tradeYear: formData.vehicles[0].year,
        tradeMake: formData.vehicles[0].make,
        tradeVin: formData.vehicles[0].vin,
        tradeTrim: formData.vehicles[0].trim,
        tradeMileage: formData.vehicles[0].odometer,
        trim: formData.vehicles[1].trim,
        vin: formData.vehicles[1].vin,
      }
    })
    const dashboardData = await prisma.dashboard.update({
      where: { id: financeData.dashboardId },
      data: {
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
        status: formData.status,
        customerState: formData.state,
        result: formData.result,
        timesContacted: formData.timesContacted,
        nextAppointment: formData.nextAppointment,
        followUpDay: formData.followUpDay,
        state: formData.state,
        deliveredDate: formData.deliveredDate,
        notes: formData.notes,
        visits: formData.visits,
        progress: formData.progress,
        metSalesperson: formData.metSalesperson,
        metFinance: formData.metFinance,
        financeApplication: formData.financeApplication,
        pickUpDate: formData.pickUpDate,
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
    })
    const data = formData
    const activixData = await prisma.activixLead.update({
      where: { id: financeData.theRealActId, },
      data: {
        account_id: data.account_id.toString(),
        customer_id: data.customer_id.toString(),
        appointment_date: data.appointment_date,
        phone_appointment_date: data.phone_appointment_date,
        available_date: data.available_date,
        be_back_date: data.be_back_date,
        call_date: data.call_date,
        created_at: data.created_at,
        csi_date: data.csi_date,
        delivered_date: data.delivered_date,
        deliverable_date: data.deliverable_date,
        delivery_date: data.delivery_date,
        paperwork_date: data.paperwork_date,
        presented_date: data.presented_date,
        //   promised_date: data.promised_date,
        financed_date: data.financed_date,
        road_test_date: data.road_test_date,
        home_road_test_date: data.home_road_test_date,
        sale_date: data.sale_date,
        updated_at: data.updated_at,
        address_line1: data.address_line1,
        city: data.city,
        civility: data.civility,
        country: data.country,
        credit_approved: data.credit_approved ? data.credit_approved.toString() : null,
        dealer_tour: data.creditdealer_tour_approved ? data.dealer_tour.toString() : null,
        financial_institution: data.financial_institution,
        first_name: data.first_name,
        funded: data.funded ? data.funded.toString() : null,
        inspected: data.inspected ? data.inspected.toString() : null,
        last_name: data.last_name,
        postal_code: data.postal_code,
        province: data.province,
        result: data.result,
        status: data.status,
        type: data.type,
        walk_around: data.walk_around ? data.walk_around.toString() : null,
        comment: data.comment,
        delivered_by: data.delivered_by,
        emails: data.emails[0].address,
        phones: data.phones[0].number,
        financeId: data.financeId,
        userEmail: user?.email,

        /**home_presented_date: data.home_presented_date,
         birth_date: data.birth_date,
         source_id: data.source_id,
         Integer: data.Integer,
         provider_id: data.provider_id,
         unsubscribe_all_date: data.unsubscribe_all_date,
         unsubscribe_call_date: data.unsubscribe_call_date,
         unsubscribe_email_date: data.unsubscribe_email_date,
         unsubscribe_sms_date: data.unsubscribe_sms_date,
         advisor: data.advisor,
         take_over_date: data.take_over_date,
         search_term: data.search_term,
         gender: data.gender,
         form: data.form,
         division: data.division,
         created_method: data.created_method,
         campaign: data.campaign,
         address_line2: data.address_line2,
         business: data.business,
         business_name: data.business_name,
         second_contact: data.second_contact,
         second_contact_civility: data.second_contact_civility,
         segment: data.segment,
         source: data.source,
         qualification: data.qualification,
         rating: data.rating,
         referrer: data.referrer,
         provider: data.provider,
         progress_state: data.progress_state,
         locale: data.locale,
         navigation_history: data.navigation_history,
         keyword: data.keyword,*/

      }
    })

    return { financeData, activixData, dashboardData };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log("This code always runs, regardless of whether there was an error or not.");
  }
  return null
}

export const action: ActionFunction = async ({ req, request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
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
    const userIntegration = await prisma.userIntergration.findUnique({
      where: { userEmail: user?.email }
    })
    const activixActivated = userIntegration.activixActivated
    if (activixActivated === 'yes') {
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
    const userIntegration = await prisma.userIntergration.findUnique({
      where: { userEmail: user?.email }
    })
    const activixActivated = userIntegration.activixActivated
    if (activixActivated === 'yes') {
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
          await UpdateLeadApiOnly(formData, user)
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

    const userIntegration = await prisma.userIntergration.findUnique({
      where: { userEmail: user?.email }
    })
    const activixActivated = userIntegration.activixActivated
    if (activixActivated === 'yes') {
      await UpdateLeadWantedVeh(formData)
    }
    return json({ updateClient, })
  }
  if (intent === 'dealProgress') {

    const currentDate = new Date().toISOString();

    const date = new Date();
    let sold;
    let referral;
    let visited;
    let bookedApt;
    let aptShowed;
    let aptNoShowed;
    let testDrive;
    let metService;
    let metManager;
    let metParts;
    let depositMade;
    let refund;
    let turnOver;
    let financeApp;
    let approved;
    let signed;
    let pickUpSet;
    let demoed;
    let delivered;
    let deliveredDate;
    let docsSigned;
    let funded;
    let seenTrade;
    let financeApplication;
    let metSalesperson;
    let metFinance;
    let signBill;
    let tradeInsp;
    let applicationDone;
    let licensingSent;
    let liceningDone;
    let cancelled;
    let lost;

    if (formData.tradeInsp === 'on') {
      tradeInsp = date
    }
    if (formData.sold === 'on') {
      sold = date;
    }
    if (formData.signBill === 'on') {
      signBill = date;
    }
    if (formData.metFinance === 'on') {
      metFinance = date;
    }
    if (formData.metSalesperson === 'on') {
      metSalesperson = date;
    }
    if (formData.financeApplication === 'on') {
      financeApplication = date;
    }
    if (formData.seenTrade === 'on') {
      seenTrade = date;
    }
    if (formData.funded === 'on') {
      funded = date;
    }
    if (formData.docsSigned === 'on') {
      docsSigned = date;
    }
    if (formData.deliveredDate === 'on') {
      deliveredDate = date;
    }
    if (formData.delivered === 'on') {
      delivered = date;
    }
    if (formData.demoed === 'on') {
      demoed = date;
    }
    if (formData.pickUpSet === 'on') {
      pickUpSet = date;
    }
    if (formData.signed === 'on') {
      signed = date;
    }
    if (formData.approved === 'on') {
      approved = date;
    }
    if (formData.financeApp === 'on') {
      financeApp = date;
    }
    if (formData.turnOver === 'on') {
      turnOver = date;
    }
    if (formData.refund === 'on') {
      refund = date;
    }
    if (formData.depositMade === 'on') {
      depositMade = date;
    }
    if (formData.metParts === 'on') {
      metParts = date;
    }
    if (formData.metManager === 'on') {
      metManager = date;
    }
    if (formData.metService === 'on') {
      metService = date;
    }
    if (formData.testDrive === 'on') {
      testDrive = date;
    }
    if (formData.aptNoShowed === 'on') {
      aptNoShowed = date;
    }
    if (formData.aptShowed === 'on') {
      aptShowed = date;
    }
    if (formData.bookedApt === 'on') {
      bookedApt = date;
    }
    if (formData.visited === 'on') {
      visited = date;
    }
    if (formData.referral === 'on') {
      referral = date;
    }
    if (formData.applicationDone === 'on') {
      applicationDone = date;
    }
    if (formData.licensingSent === 'on') {
      licensingSent = date;
    }
    if (formData.liceningDone === 'on') {
      liceningDone = date;
    }
    if (formData.cancelled === 'on') {
      cancelled = date;
    }
    if (formData.lost === 'on') {
      lost = date;
    }

    // if (!formData.reached) updateData.reached = currentDate;
    // if (!formData.attempted) updateData.attempted = currentDate;

    const updateDealProgress = await prisma.dashboard.update({
      where: { financeId: formData.financeId },
      data: {
        applicationDone: String(applicationDone),
        licensingSent: String(licensingSent),
        liceningDone: String(liceningDone),
        cancelled: String(cancelled),
        lost: String(lost),
        sold: String(sold),
        referral: String(referral),
        visited: String(visited),
        bookedApt: String(bookedApt),
        aptShowed: String(aptShowed),
        aptNoShowed: String(aptNoShowed),
        testDrive: String(testDrive),
        metService: String(metService),
        metManager: String(metManager),
        metParts: String(metParts),
        depositMade: String(depositMade),
        refund: String(refund),
        turnOver: String(turnOver),
        financeApp: String(financeApp),
        approved: String(approved),
        signed: String(signed),
        pickUpSet: String(pickUpSet),
        demoed: String(demoed),
        delivered: String(delivered),
        deliveredDate: String(deliveredDate),
        docsSigned: String(docsSigned),
        funded: String(funded),
        seenTrade: String(seenTrade),
        financeApplication: String(financeApplication),
        metSalesperson: String(metSalesperson),
        metFinance: String(metFinance),
        signBill: String(signBill),
        tradeInsp: String(tradeInsp),

        pending: formData.pending,
        //  bookedApt: formData.bookedApt,
        // aptShowed: formData.aptShowed,
        /// aptNoShowed: formData.aptNoShowed,
        // referral: formData.referral,
      },
    });

    const userIntegration = await prisma.userIntergration.findUnique({
      where: { userEmail: user?.email }
    })
    if (userIntegration) {
      const activixActivated = userIntegration.activixActivated
      if (activixActivated === 'yes') {
        await UpdateLeadBasic(formData)
      }
      return json({ updateDealProgress })
    }

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

  const user = await GetUser(email)
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
    finance = await GetMergedWithActivix(financeId)
    await UpdateClientFromActivix(finance)
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
  const dealerFees = await prisma.dealer.findUnique({ where: { userEmail: user?.email } })
  const dealerInfo = await prisma.dealerInfo.findFirst()

  let merged
  if (user?.activixActivated === 'yes') {
    merged = {


      tradeMileage: finance.tradeMileage,
      userName: user?.username,
      year: finance.year === null ? ' ' : finance.year,
      tradeYear: finance.tradeYear === null ? ' ' : finance.tradeYear,
      vin: finance.vin === null ? ' ' : finance.vin,
      tradeVin: finance.tradeVin === null ? ' ' : finance.tradeVin,
      stockNum: finance.stockNum === null ? ' ' : finance.stockNum,
      namextwar: finance.userExtWarr === null ? ' ' : 'Extended Warranty',
      asdasd: finance.userOther === null ? ' ' : 'Other',
      nameloan: finance.userLoanProt === null ? ' ' : 'Loan Protection',
      namegap: finance.userGap === null ? ' ' : 'Gap Insurance',
      nameTireandRim: finance.userTireandRim === null ? ' ' : 'Warranty',
      namevinE: finance.vinE === null ? ' ' : 'Vin Etching',
      namerust: finance.rustProofing === null ? ' asdasdsa' : 'Rust Proofing',
      namelife: finance.lifeDisability === null ? ' ' : 'Life and Disability Ins.',
      nameservice: finance.userServicespkg === null ? ' ' : 'Service Package',
      namedelivery: finance.deliveryCharge === null ? ' ' : 'Delivery Charge',
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
      discountPer: Number(finance.discountPer) < 0 ? ' ' : finance.discountPer,
      namediscountPer: Number(finance.discountPer) < 0 ? ' ' : 'Discount %',
      discount: Number(finance.discount) < 0 ? ' ' : finance.discount,
      namediscount: Number(finance.discount) < 0 ? ' ' : 'Discount',
      namefreight: Number(finance.freight) < 0 ? ' ' : 'Freight',
      nameadmin: Number(finance.admin) < 0 ? ' ' : 'Admin',
      namepdi: Number(finance.pdi) < 0 ? ' ' : 'PDI',
      namcomm: Number(finance.commodity) < 0 ? ' ' : 'Commodity',
      nameaccessories: Number(finance.accessories) < 0 ? ' ' : 'Other Accessories',
      namelabour: Number(finance.labour) < 0 ? ' ' : 'Labour',
      netDifference: (Number(finance.total) - Number(finance.tradeValue)),
      hstSubTotal: (Number(finance.total) + Number(finance.onTax)),
      withLicensing: (Number(finance.total) + Number(finance.onTax) + Number(finance.licensing)),
      withLien: (Number(finance.total) + Number(finance.onTax) + Number(finance.licensing) + Number(finance.lien)),
      payableAfterDel: (Number(finance.total) + Number(finance.onTax) + Number(finance.licensing) + Number(finance.lien) - Number(finance.deposit)),

      dealerName: dealerInfo?.dealerName,
      dealerAddress: dealerInfo?.dealerAddress,
      dealerProv: `${dealerInfo?.dealerCity}, ${dealerInfo?.dealerProv}, ${dealerInfo?.dealerPostal}`,
      dealerPhone: dealerInfo?.dealerPhone,
      userLoanProt: finance.userLoanProt,
      userTireandRim: finance.userTireandRim,
      userGap: finance.userGap,
      userExtWarr: finance.userExtWarr,
      userServicespkg: finance.userServicespkg,
      vinE: finance.vinE,
      lifeDisability: finance.lifeDisability,
      rustProofing: finance.rustProofing,
      userLicensing: dealerFees?.userLicensing,
      //  userFinance: dealerFees?.userFinance,
      //  userDemo: dealerFees?.userDemo,
      userGasOnDel: dealerFees?.userGasOnDel,
      //   userOMVIC: dealerFees?.userOMVIC,
      userOther: finance.userOther,
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
      iRate: finance.iRate,
      months: finance.months,
      //  discount: finance.discount,
      total: finance.total,
      onTax: finance.onTax,
      on60: finance.on60,
      biweekly: finance.biweekly,
      weekly: finance.weekly,
      weeklyOth: finance.weeklyOth,
      biweekOth: finance.biweekOth,
      oth60: finance.oth60,
      weeklyqc: finance.weeklyqc,
      biweeklyqc: finance.biweeklyqc,
      qc60: finance.qc60,
      deposit: finance.deposit,
      biweeklNatWOptions: finance.biweeklNatWOptions,
      weeklylNatWOptions: finance.weeklylNatWOptions,
      nat60WOptions: finance.nat60WOptions,
      weeklyOthWOptions: finance.weeklyOthWOptions,
      biweekOthWOptions: finance.biweekOthWOptions,
      oth60WOptions: finance.oth60WOptions,
      biweeklNat: finance.biweeklNat,
      weeklylNat: finance.weeklylNat,
      nat60: finance.nat60,
      qcTax: finance.qcTax,
      otherTax: finance.otherTax,
      totalWithOptions: finance.totalWithOptions,
      otherTaxWithOptions: finance.otherTaxWithOptions,
      desiredPayments: finance.desiredPayments,
      freight: finance.freight,
      admin: finance.admin,
      commodity: finance.commodity,
      pdi: finance.pdi,
      //   discountPer: finance.discountPer,
      deliveryCharge: finance.deliveryCharge,
      paintPrem: finance.paintPrem,
      msrp: finance.msrp,
      licensing: finance.licensing,
      options: finance.options,
      accessories: finance.accessories,
      labour: finance.labour,
      //year: finance.year,
      brand: finance.brand,
      model: finance.model,
      //  stockNum: finance.stockNum,
      model1: finance.model1,
      color: finance.color,
      modelCode: finance.modelCode,
      tradeValue: finance.tradeValue,
      tradeDesc: finance.tradeDesc,
      tradeColor: finance.tradeColor,
      //  tradeYear: finance.tradeYear,
      tradeMake: finance.tradeMake,
      //  tradeVin: finance.tradeVin,
      tradeTrim: finance.tradeTrim,
      //  tradeMileage: finance.tradeMileage,
      trim: finance.trim,
      //vin: finance.vin,
      lien: finance.lien,

      date: new Date().toLocaleDateString(),
      dl: finance.dl,
      email: finance.email,
      firstName: finance.firstName,
      lastName: finance.lastName,
      phone: finance.phone,
      name: finance.name,
      address: finance.address,
      city: finance.city,
      postal: finance.postal,
      province: finance.province,
      referral: finance.referral,
      visited: finance.visited,
      bookedApt: finance.bookedApt,
      aptShowed: finance.aptShowed,
      aptNoShowed: finance.aptNoShowed,
      testDrive: finance.testDrive,
      metService: finance.metService,
      metManager: finance.metManager,
      metParts: finance.metParts,
      sold: finance.sold,
      depositMade: finance.depositMade,
      refund: finance.refund,
      turnOver: finance.turnOver,
      financeApp: finance.financeApp,
      approved: finance.approved,
      signed: finance.signed,
      pickUpSet: finance.pickUpSet,
      demoed: finance.demoed,
      delivered: finance.delivered,
      status: finance.status,
      customerState: finance.customerState,
      result: finance.result,
      notes: finance.notes,
      metSalesperson: finance.metSalesperson,
      metFinance: finance.metFinance,
      financeApplication: finance.financeApplication,
      pickUpTime: finance.pickUpTime,
      depositTakenDate: finance.depositTakenDate,
      docsSigned: finance.docsSigned,
      tradeRepairs: finance.tradeRepairs,
      seenTrade: finance.seenTrade,
      lastNote: finance.lastNote,
      dLCopy: finance.dLCopy,
      insCopy: finance.insCopy,
      testDrForm: finance.testDrForm,
      voidChq: finance.voidChq,
      loanOther: finance.loanOther,
      signBill: finance.signBill,
      ucda: finance.ucda,
      tradeInsp: finance.tradeInsp,
      customerWS: finance.customerWS,
      otherDocs: finance.otherDocs,
      urgentFinanceNote: finance.urgentFinanceNote,
      funded: finance.funded,
    }
  } else {
    merged = {
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
  }

  if (user?.activixActivated === 'yeskkk') {
    await UpdateLeadBasic(merged, user)
    await UpdateLeademail(merged)
    await UpdateLeadPhone(merged)
    await UpdateLeadWantedVeh(merged)
  }
  for (let key in merged) {
    merged[key] = String(merged[key]);
  }
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: email } });
  const UploadedDocs = await prisma.uploadDocs.findMany({ where: { financeId: finance?.id } });
  const userList = await prisma.user.findMany()
  const parts = await prisma.part.findMany()
  const clientUnit = await prisma.inventoryMotorcycle.findFirst({ where: { stockNumber: merged.stockNum } })
  if (user?.activixActivated === 'yes') {
    const financeData = finance
    await PullActivix(financeData)
  }
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

  let data = { ...finance, ...finance, ...user }

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

  const [date, setDate] = useState<Date>()


  // console.log(finance, finance[0].id, 'finance', finance[0].id)
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

  let date2 = new Date(finance[0].pickUpDate);
  let weekday = date2.toLocaleString('default', { weekday: 'short' });
  let month = date2.toLocaleString('default', { month: 'short' });
  let day = date2.getDate();
  let year = date2.getFullYear();
  let result = weekday + ' ' + month + ' ' + day + ' ' + year
  // console.log(finance, 'finance')
  let dateLastContact = new Date(finance[0].lastContact);

  let NewListForStatus = [

    { name: 'lastContact', value: finance[0].lastContact === '1969-12-31 19:00' || finance[0].lastContact === null ? 'TBD' : formatDate(finance[0].lastContact), label: 'Last Contacted', },
    { name: 'nextAppointment', value: formattedDate, label: 'Next Appt', },
    {
      name: 'deliveryDate',
      value: finance[0].customerState !== 'depositMade' ?
        (<Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className=' bg-[#09090b]'
            />
            <input type="hidden" defaultValue={date} name="pickUpDate" />

            <select
              defaultValue={finance[0].pickUpTime}
              name='pickUpTime'
              placeholder="Preferred Time To P/U"
              className="w-1/2 mx-auto rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
            >
              <option value="9:00">9:00</option>
              <option value="9:30">9:30</option>
              <option value="10:00">10:00</option>
              <option value="10:30">10:30</option>
              <option value="11:00">11:00</option>
              <option value="11:30">11:30</option>
              <option value="12:00">12:00</option>
              <option value="12:30">12:30</option>
              <option value="1:00">1:00</option>
              <option value="1:30">1:30</option>
              <option value="2:00">2:00</option>
              <option value="2:30">2:30</option>
              <option value="3:00">3:00</option>
              <option value="3:30">3:30</option>
              <option value="4:00">4:00</option>
              <option value="4:30">4:30</option>
              <option value="5:00">5:00</option>
              <option value="5:30">5:30</option>
              <option value="6:00">6:00</option>
            </select>
          </PopoverContent>
        </Popover>) :
        finance[0].customerState !== 'pickUpSet' ?
          (<Badge onClick={() => setPickUpCalendar(PickUpCalendar === 'yes' ? 'no' : 'yes')} className="cursor-pointer transform transform:translate-x-1 bg-green-600">{result}</Badge>) :
          finance[0].customerState !== 'delivered' ?
            (<Badge className="bg-green-600">Delivered</Badge>) :
            (<Badge onClick={() => setPickUpCalendar(PickUpCalendar === 'yes' ? 'no' : 'yes')} className="cursor-pointer transform transform:translate-x-1 bg-green-600">{result}</Badge>
            ),

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

        <div className=" bg-[#09090b] mt-[50px]">

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
