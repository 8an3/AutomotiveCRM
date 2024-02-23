import { json } from "@remix-run/node";
import { prisma } from "~/libs";

export async function getLatestFinanceAndDashDataForClientfile(email) {
  try {
    // Fetch the latest Clientfile for a specific userId
    const finance = await prisma.finance.findFirst({
      where: {
        email: email,
      },
    });
    const dashboard = await prisma.dashboard.findFirst({
      where: {
        financeId: finance?.id,
      },
    });

    console.log("Fetched latest Clientfile successfully");
    return json({ finance, dashboard });
  } catch (error) {
    console.error("Error fetching latest Clientfile:", error);
    throw error;
  }
}

export async function getMergedFinanceOnFinance(email) {
  try {
    const finance = await prisma.finance.findFirst({
      where: {
        userEmail: email,
      },
    });
    //  console.log('financeData:', financeData); // Debugging line

    const dashData = await prisma.dashboard.findUnique({
      where: {
        financeId: finance?.id,
      },
    });
    //  console.log('dashData:', dashData); // Debugging line
    // Merge financeData and dashData
    const mergedData = {
      ...dashData,
      ...finance,
    };
    console.log(finance, dashData, "from emAIL");

    console.log("mergedData:", mergedData);
    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}

export async function getMergedFinanceOnFinanceUniqueFInanceId(financeId) {
  try {
    const finance = await prisma.finance.findUnique({
      where: {
        id: financeId,
      },
    });
    //  console.log('financeData:', financeData); // Debugging line

    const dashData = await prisma.dashboard.findUnique({
      where: {
        financeId: finance?.id,
      },
    });
    //  console.log('dashData:', dashData); // Debugging line
    // Merge financeData and dashData
    const mergedData = {
      ...dashData,
      ...finance,
    };
    console.log(finance, dashData, "from emAIL");

    console.log("mergedData:", mergedData);
    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
