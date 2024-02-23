import { prisma } from "~/libs";

export async function getClientFinanceAndDashData(financeId) {
  try {
    const clientFile = await prisma.clientfile.findUnique({
      where: {
        financeId: financeId,
      },
    });

    const finance = await prisma.finance.findUnique({
      where: {
        id: financeId,
      },
    });

    const dashboard = await prisma.dashboard.findUnique({
      where: {
        financeId: financeId,
      },
    });

    console.log("ClientFile, Finance, and DashData retrieved successfully");
    return { clientFile, finance, dashboard };
  } catch (error) {
    console.error("Error retrieving ClientFile, Finance, and DashData:", error);
    throw error;
  }
}
