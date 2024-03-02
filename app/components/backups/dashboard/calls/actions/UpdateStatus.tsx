import { updateDashData } from "~/utils/dashboard/update.server";
import { json } from "@remix-run/node";
import { updateFinanceWithDashboard } from "~/utils/finance/update.server";
import { DataForm } from '~/components/dashboard/calls/actions/dbData';
import { useRootLoaderData } from "~/hooks";


export default async function UpdateStatus(formData) {

  const financeId = formData.financeId;

  const statusData = {
    status: formData.status,
    financeId: formData.financeId,
  }

  try {
    //  console.log(statusData, 'dashdata');
    const updateDash = await updateDashData(financeId, statusData);

    return json({ updateDash });
  } catch (error) {
    console.error('Error updating dash data:', error);
    // Return an error response or handle the error as appropriate
  }
  /*
  switch (brand) {
    case "Manitou":
      const updatingManitouFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
      return json({ updatingManitouFinance, DashData });
    case "Switch":
      const updatingSwitchFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
      return json({ updatingSwitchFinance, DashData });
    case "BMW-Motorrad":
      const updatingBMWMotoFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
      return json({ updatingBMWMotoFinance, DashData });
    default:
      const financeUpdated = await updateFinanceWithDashboard(financeId, financeData, dashData);;
      console.log('on submit', formData)
      return json({ financeUpdated, DashData })
  }*/
}
