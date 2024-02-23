import { prisma } from "~/libs";

export async function getDashboard(userEmail2) {
  try {
    const dashboardEntries = await prisma.dashboard.findMany({
      where: {
        userEmail2: userEmail2,
      },
    });
    return dashboardEntries;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
export async function findDashData(id) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.dashboard.findUnique({
      where: {
        id: id,
      },
    });
    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
