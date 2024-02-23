import { json } from "@remix-run/node";
import { createClientFinanceApt } from "~/utils/client/createClientApt.server";
import { updateDashData } from "~/utils/dashboard/update.server";
import { createFinanceAppt } from "~/utils/financeAppts/create.server";


export default async function CallQuickFU({ formData, today, userId, user, financeId, CompleteLastAppt }) {
  console.log(formData, 'formdata')
  const CompletePreviousAPT = await CompleteLastAppt({ userId, financeId });
  let customerState;
  if (customerState === 'Pending') { customerState = 'Attempted'; }
  const compLastAppt = await CompleteLastAppt({ userId, financeId })
  delete formData.intent;
  delete formData.end;
  delete formData.timeOfDay;
  const apptStatus = 'future'
  const options = { month: 'short', day: '2-digit', year: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', };
  const lastContact = today.toLocaleString('en-US', options);
  let nextAppointment = new Date(today);
  nextAppointment.setDate(nextAppointment.getDate() + Number(formData.followUpDay2));
  nextAppointment = nextAppointment.toLocaleString('en-US', options);
  const updatedData = { ...formData, id: financeId, apptStatus, userId, lastContact, nextAppointment };
  let followUpDay = await updateDashData(updatedData)
  const userName = user?.name
  const title = formData.unit
  const start = nextAppointment
  delete formData.financeId;
  delete formData.userEmail;
  delete formData.descfup;
  delete formData.twodayfup;
  delete formData.followUpDay2;
  delete formData.followUpDay;
  delete formData.addFU;
  delete formData.lastContact;
  delete formData.id
  const data = { ...formData, title, userId, apptStatus, start, customerState, userName }
  const createFinanceApptData = await createClientFinanceApt(data)
  return json({ followUpDay, createFinanceApptData, CompletePreviousAPT, compLastAppt })

}
