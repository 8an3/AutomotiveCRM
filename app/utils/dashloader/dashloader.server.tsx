import { prisma } from "~/libs";

export async function getMergedFinance(userEmail) {
  ///console.log(userEmail)
  /// console.log(userEmail, 'email dashboard calls loader')
  try {
    const financeData = await prisma.finance.findMany({
      where: {
        userEmail: {
          equals: userEmail,
        },
      },
    });
    ///  console.log('financeData:', financeData); // Debugging line

    const dashData = await prisma.dashboard.findMany({
      where: {
        userEmail: {
          equals: userEmail,
        },
      },
    });
    ///console.log('dashData:', dashData); // Debugging line


    const mergedData = await Promise.all(financeData.map(async (financeRecord) => {
      // console.log('financeRecord.id:', financeRecord.id); // Debugging line
      const correspondingDashRecord = dashData.find(dashRecord => dashRecord.financeId === financeRecord.id);
      // console.log('correspondingDashRecord:', correspondingDashRecord); // Debugging line

      const comsCounter = await prisma.communications.findUnique({
        where: {
          financeId: financeRecord.id
        },
      });
      return {
        ...comsCounter,
        ...correspondingDashRecord,
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

    const dashData = await prisma.dashboard.findMany({
      where: {
        financeId: {
          in: financeIds,
        },
      },
    });

    const mergedData = financeData.map((financeRecord) => {
      //   console.log('financeRecord.id:', financeRecord.id); // Debugging line
      const correspondingDashRecord = dashData.find(dashRecord => dashRecord.financeId === financeRecord.id);
      //   console.log('correspondingDashRecord:', correspondingDashRecord); // Debugging line
      return {
        ...correspondingDashRecord,
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

    const dashData = await prisma.dashboard.findMany({
      where: {
        financeId: financeId,
      },
    });
    //console.log('dashData:', dashData); // Debugging line

    /// Merge financeData and dashData
    const mergedData = financeData.map((financeRecord) => {
      // console.log('financeRecord.id:', financeRecord.id); // Debugging line
      const correspondingDashRecord = dashData.find(dashRecord => dashRecord.financeId === financeRecord.id);
      // console.log('correspondingDashRecord:', correspondingDashRecord); // Debugging line
      return {
        ...correspondingDashRecord,
        ...financeRecord,
      };
    });


    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
