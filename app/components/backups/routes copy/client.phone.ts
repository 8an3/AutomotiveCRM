import { json } from "@remix-run/node";
//import { authenticator } from "~/services";

import financeFormSchema from "./overviewUtils/financeFormSchema";
import updateFinance23 from "../components/dashboard/calls/actions/updateFinance";
import {
  CompleteLastAppt,
  TwoDays,
  FollowUpApt,
} from "../components/actions/dashboardCalls";

import { createfinanceApt } from "~/utils/financeAppts/create.server";
import { getLastAppointmentForFinance } from "~/utils/client/getLastApt.server";
import { prisma } from "~/libs/prisma.server";
import { prisma } from "~/libs";
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'



// ----- for the sms on the dashboard

export async function action({ params, request }) {
  const payload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(payload);
  const userSession = await sessionGet(request.headers.get("Cookie"));

  if (!userSession) { return json({ status: 302, redirect: '/login' }); };

  const email = userSession.get("email")
  const user = await getUserByEmail(email)
  if (!user) { return json({ status: 302, redirect: '/login' }) };
  console.log(user, 'email')
  const intent = formData.intent;
  const financeId = formData?.financeId;
  const userId = user?.id;
  const id = formData?.id;

  const message = formData.note;
  const baseUrL = "https://9l1z4r.api.infobip.com";
  const sender = "InfoSMS"; // formData.phone;
  const recipient = "1" + formData.phone;
  console.log(message, "message", recipient);
  const auth =
    "App df1047336028413cf8b479c53d1fd99b-47c5fc33-9371-4840-8576-9b79ddd4f880";
  const data = {
    "endpoint": {
      "type": "PHONE",
      "phoneNumber": "16138980992"
    },
    "from": sender,
    "applicationId": "61c060db2675060027d8c7a6", // need app id

  };

  const sendSMS = await fetch(`${baseUrL}/calls/1/calls`, {
    method: "POST",

    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
      Accept: "application/json",

    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  //console.log(sendSMS);

  /// just appointment shit beyond this
  /// just appointment shit beyond this
  if (intent === "textQuickFU") {
    console.log(formData, 'textQuickFU wwwwwww')

    const lastContact = new Date().toISOString();
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }

    const followUpDay2 = parseInt(formData.followUpDay2);
    console.log("followUpDay:", followUpDay2); // Add this line

    function addDays(days) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + days);
      return currentDate;
    }

    let newDate = addDays(followUpDay2);
    newDate = new Date(newDate).toISOString();
    // console.log("financeId:", financeId); // Add this line

    let clientAptsData = {
      title: formData.title,
      start: newDate,
      contactMethod: formData.contactMethod,
      completed: formData.completed,
      apptStatus: formData.apptStatus,
      apptType: formData.apptType,
      unit: formData.unit,
      brand: formData.brand,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      financeId: formData.financeId,
      userName: user?.name,
      title: "Contacted by Instant Function",
      direction: "Outgoing",
      resultOfcall: "Attempted",
      userId,
    };

    const nextAppointment = newDate;
    const followUpDay = newDate;
    const formData3 = {
      ...formData,
      nextAppointment,
      followUpDay,
      lastContact,
      customerState,
    };

    const updating = await updateFinance23(financeId, formData3, formData);

    const createFollowup = await createfinanceApt(financeId, clientAptsData);

    const complete = await CompleteLastAppt(userId, id);

    const completeApt = await getLastAppointmentForFinance(financeId);
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
    //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
    return json({ sendSMS, complete, updating, completeApt, createFollowup, setComs });
  }
  if (intent === "completeApt") {
    console.log("completeApt");
    const complete = await CompleteLastAppt(userId, financeId);
    const addFU = formData.addFU;
    const addDetailedFU = formData.addDetailedFU;
    if (addFU === "on") {
      const twoDays = await TwoDays(followUpDay3, formData, financeId, user);
      return json({ complete, twoDays });
    }
    if (addDetailedFU === "yes") {
      const followup = await FollowUpApt();
      return json({ sendSMS, complete, followup });
    }
  }
  return json({ sendSMS });
}

/**
export default function smsClient() {
  return (
    <div>
      <h1>Send SMS</h1>
      <Form method='post'>
        <input hidden name='action' value='getSMS' />
        <button>GET SMS</button>

      </Form>
    </div>
  );
}
 */
