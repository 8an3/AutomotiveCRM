import { createBMWOptions, createBMWOptions2, createFinance, createFinanceManitou } from "~/utils/finance/create.server";
import { json, ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { createDashData } from "~/utils/dashboard/create.server";

export default async function AddCustomer({ formData, }) {
  const newFormData = { ...formData };
  delete newFormData.intent;
  delete newFormData.countsInPerson;
  delete newFormData.countsPhone;
  delete newFormData.countsSMS;
  delete newFormData.countsEmail;
  delete newFormData.countsOther;

  const financeCreated = await createFinance(newFormData)
  const financeId = financeCreated.id

  const DashData = await createDashData({
    id: financeId,
    status: 'Active',
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
    seenTrade: 'off',
  })
  const brand = formData.brand

  if (brand === 'Switch') {
    const manitouOptionsCreated = await createFinanceManitou(newFormData)
    return json({ manitouOptionsCreated })
  }
  if (brand === 'Manitou') {
    const manitouOptionsCreated = await createFinanceManitou(newFormData)
    return json({ manitouOptionsCreated })
  }
  if (brand === 'BMW-Motorrad') {
    const financeId = financeCreated.id
    const creatingBMWOptions = await createBMWOptions({ financeId })
    const creatingBMWOptions2 = await createBMWOptions2({ financeId })
    return json({ creatingBMWOptions, creatingBMWOptions2 })
  }
  else {
    console.log('on submit', financeCreated, newFormData)
    return json({ financeCreated, DashData }), redirect('/dashboard/calls');
  }

}
