import {
  json,
  ActionFunction,
  LoaderFunction,
  redirect,
  JsonFunction,
} from "@remix-run/node";

import { model } from "~/models";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
//import { authenticator } from "~/services";
import {
  findDashboardDataById,
  findQuoteById,
  getDataBmwMoto,
  getDataByModel,
  getDataByModelManitou,
  getDataHarley,
  getDataKawasaki,
  getDataTriumph,
  getLatestBMWOptions,
  getLatestBMWOptions2,
  getLatestOptionsManitou,
  getRecords,
} from "~/utils/finance/get.server";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getAllFinanceNotes } from "~/utils/financeNote/get.server";
import { getSingleFinanceAppts } from "~/utils/financeAppts/get.server";
import { updateDashData, updateDashboard } from "~/utils/dashboard/update.server";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import UpdateStatus from "~/components/dashboard/calls/actions/UpdateStatus";

import DeleteCustomer from "~/components/dashboard/calls/actions/DeleteCustomer";
import EmailClient from "~/components/dashboard/calls/emailClient";
import CallLongFU from "~/components/dashboard/calls/actions/CallLongFU";
import TextQuickFU from "~/components/dashboard/calls/actions/textQuickFU";
import { getTemplatesByEmail, templateServer } from "~/utils/emailTemplates/template.server";
import { updateFinanceNote } from "~/utils/client/updateFinanceNote.server";
import { prisma } from "~/libs";
import { getLastAppointmentForFinance } from "~/utils/client/getLastApt.server";

import { CreateCommunications } from "~/utils/communications/communications.server";
import { CompleteLastAppt } from '~/components/actions/dashboardCalls'
//import { UploadFileAction } from "~/routes/dealer.api.fileUpload";
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'
import { getSession } from "~/sessions/auth-session.server";
import { EmailFunction } from "~/routes/dummyroute";
import { GetUser } from "~/utils/loader.server";



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

export const action: ActionFunction = async ({
  req,
  request,
  params,
}) => {
  const formDataObj = await request.formData();
  console.log(formDataObj, 'formDataObj')
  const formPayload = {};
  for (let key of formDataObj.keys()) {
    formPayload[key] = formDataObj.get(key);
  }
  let formData = financeFormSchema.parse(formPayload);
  const userSession = await getSession(request.headers.get("Cookie"));

  if (!userSession) { return json({ status: 302, redirect: '/login' }); };

  const email = userSession.get("email")

  const user = await GetUser(email)
  if (!user) { return json({ status: 302, redirect: '/login' }) };
  console.log(user, 'email')
  const userId = user?.id;
  const intent = formPayload.intent;
  const template = formPayload.template;
  console.log(formData, 'formData dashboardcalls')
  const today = new Date();
  const date = new Date().toISOString()
  const financeId = formData?.financeId;
  console.log('financeId:', financeId, 'financeId');  // Add this line
  let pickUpDate;
  if (pickUpDate === null || pickUpDate === undefined) {
    pickUpDate = "To Be Det.";
  }
  //const dashboardId = formData?.dashboard
  const id = formData?.id;
  // console.log(financeId, 'financeId', id, 'id', clientfileId, 'clientfileId',)

  //. create email template
  if (intent === 'uploadFile') {
    console.log('uploadFile')
    const uploadAction = await UploadFileAction({ request })
    return uploadAction
  }
  // calls
  if (intent === "EmailClient") {
    console.log(user.email, 'formData.email')
    const comdata = {
      financeId: formData.financeId,
      userEmail: user?.email,
      content: formData.customContent,
      title: formData.subject,
      direction: formData.direction,
      result: formData.customerState,
      subject: formData.subject,
      type: 'Email',
      userName: user?.name,
      date: new Date().toISOString(),
    }
    // const completeApt = await CompleteLastAppt(userId, financeId)
    const sendEmail = await EmailFunction(request, params, user, financeId, formPayload)
    const setComs = await prisma.communicationsOverview.create({ data: comdata, });
    const saveComms = await ComsCount(financeId, 'Email')

    return json({ saveComms, sendEmail, formData, setComs, })//, redirect(`/dummyroute`)
  }
  if (template === "createEmailTemplate") {
    console.log('hit email template crewator')
    const data = {
      name: 'Template from email client',
      body: formData.customContent,
      date: date,
      title: 'Template from email client',
      category: 'New template',
      userEmail: formData.userEmail,
      review: formData.review,
      attachments: formData.attachments,
      label: 'Template from email client',
      dept: 'Sales',
      type: 'Email',
      subject: formData.subject,
      cc: formData.cc,
      bcc: formData.bcc,
    };
    const template = await templateServer(id, data, intent,);
    console.log('create template')

    return json({ template });
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
    const completeApt = await getLastAppointmentForFinance(financeId);

    const doTGwoDays = await TwoDays(textfollowUpDay)
    const setComs = await CreateCommunications(comdata)
    console.log('textQuickFU', setComs)
    return json({ doTGwoDays, completeApt, setComs });
  }
  if (intent === 'textQuickFU') {
    const followUpDay3 = formData.followUpDay


    const completeApt = await getLastAppointmentForFinance(financeId);

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
    console.log('textQuickFU', setComs)
    return json({ doTGwoDays, completeApt, setComs });
  }
  return null;
};
