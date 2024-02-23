import { prisma } from "~/libs";

export async function updateStatus(financeIdUpdated, dashData) {
  // Update the finance record
  const dashboard = await prisma.dashboard.update({
    where: {
      financeId: financeIdUpdateds, // Assuming the financeId is also the id of the dashboard
    },
    data: { ...dashData }
  });

  console.log(financeId,dashData,  "Finance and Dashboard records updated successfullys status");

  return { dashboard };
}
