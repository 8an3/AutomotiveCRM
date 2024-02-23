import { prisma } from "~/libs";

export async function updateDashData(updatingFinanceId, statusData) {
  // Update the finance record
  const dashboard = await prisma.dashboard.update({
    where: {
      financeId: updatingFinanceId, // Assuming the financeId is also the id of the dashboard
    },
    data: { ...statusData }
  });

  console.log(updatingFinanceId, statusData, "Finance and Dashboard records updated successfullys status");

  return { dashboard };
}


export async function updateDashboard(financeId, dashData) {
  // Update the finance record
  const dashboard = await prisma.dashboard.update({
    where: {
      financeId: financeId, // Assuming the financeId is also the id of the dashboard
    },
    data: { ...dashData }
  });

  console.log(financeId, dashData, "Finance and Dashboard records updated successfullys status");

  return { dashboard };
}
