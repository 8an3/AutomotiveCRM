import { prisma } from "~/libs";

export async function getMergedFinance(userEmail) {
  try {
    const financeData = await prisma.finance.findMany({
      where: {
        userEmail: {
          equals: userEmail,
        },
      },
    });
    const mergedData = await Promise.all(financeData.map(async (financeRecord) => {
      return {
        ...financeRecord,
      };
    }));
    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
export async function getClientListMerged(financeIds) {
  try {
    const financeData = await prisma.finance.findMany({
      where: {
        id: {
          in: financeIds,
        },
      },
    });



    const mergedData = financeData.map((financeRecord) => {
      //   console.log('financeRecord.id:', financeRecord.id); // Debugging line
      //   console.log('correspondingDashRecord:', correspondingDashRecord); // Debugging line
      return {
        ...financeRecord,
      };
    });


    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
export async function getMergedFinanceOnFinance(financeId) {
  try {
    const financeData = await prisma.finance.findMany({
      where: {
        id: financeId,
      },
    });
    // console.log('financeData:', financeData); // Debugging line


    //console.log('dashData:', dashData); // Debugging line

    /// Merge financeData and dashData
    const mergedData = financeData.map((financeRecord) => {
      // console.log('financeRecord.id:', financeRecord.id); // Debugging line
      // console.log('correspondingDashRecord:', correspondingDashRecord); // Debugging line
      return {
        ...financeRecord,
      };
    });


    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
