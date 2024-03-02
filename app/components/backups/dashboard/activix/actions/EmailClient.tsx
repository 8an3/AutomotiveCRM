import { json } from "@remix-run/node";
import { createFinanceAppt } from "~/utils/financeAppts/create.server";

export default async function EmailClient({ formData1, today, CompleteLastAppt, updateDashData, user, financeId, userId }) {
  const userEmail = user?.email


  let followUpDay = formData1.followUpDay
  if (parseInt(followUpDay) < 0 || followUpDay === undefined || followUpDay === null) { followUpDay = 3 }
  console.log(formData1, 'formData1')
  const CompletePreviousAPT = await CompleteLastAppt({ userId, financeId });
  let customerState;
  if (customerState === 'Pending') { customerState = 'Attempted'; }
  const compLastAppt = await CompleteLastAppt({ userId, financeId })
  delete formData1.intent;
  delete formData1.end;
  delete formData1.timeOfDay;
  const apptStatus = 'future'
  const options = { month: 'short', day: '2-digit', year: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', };
  const lastContact = today.toLocaleString('en-US', options);
  let nextAppointment = new Date(today);
  nextAppointment.setDate(nextAppointment.getDate() + Number(formData1.followUpDay));
  nextAppointment = nextAppointment.toLocaleString('en-US', options);
  const updatedData = { ...formData1, id: financeId, apptStatus, userId, lastContact, nextAppointment };
  followUpDay = await updateDashData(updatedData)
  const userName = user?.name
  const title = formData1.unit
  const start = nextAppointment
  delete formData1.financeId;
  delete formData1.userEmail;
  delete formData1.descfup;
  delete formData1.twodayfup;
  delete formData1.followUpDay2;
  delete formData1.followUpDay;
  delete formData1.addFU;
  delete formData1.lastContact;
  delete formData1.id
  const data = { ...formData1, title, userId, apptStatus, start, customerState, userName }
  const createFinanceApptData = await createFinanceAppt(data)
  return json({ followUpDay, createFinanceApptData, CompletePreviousAPT, compLastAppt })

}
