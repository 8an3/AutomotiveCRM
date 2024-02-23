import { prisma } from "~/libs";

export async function updateDashForApt(
  clientfileId,
  dashData,
  financeId,
  dashboardId
) {
  try {
    console.log(
      clientfileId,

      dashData,
      financeId,
      dashboardId,
      "clientfileId, clientData, financeData, dashData, financeId, dashboardId"
    );
    // If finance record exists and is associated with clientfileId, perform the update operation
    const clientFile = await prisma.clientfile.update({
      where: { id: clientfileId },
      data: {
        finance: {
          update: {
            where: { id: financeId },
            data: {
              dashboard: {
                update: {
                  where: { id: dashData },
                  data: dashboardId,
                },
              },
            },
          },
        },
      },
    });
    console.log("Updated ClientFile, Finance and Dashboard successfully");
    return clientFile;
  } catch (error) {
    console.error("Error updating ClientFile, Finance and Dashboard:", error);
    throw error;
  }
}
