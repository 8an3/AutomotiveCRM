import { prisma } from "~/libs";


export async function getSingleFinanceAppts(financeId) {
  console.log("getSingleCustomerNote", financeId);
  try {
    const latestFinance = await prisma.clientApts.findFirst({
      orderBy: { createdAt: "desc" },
      where: { financeId: financeId },
    });

    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}

export async function getAllFinanceApts2(financeId) {
  try {
    const dashboardEntries = await prisma.clientApts.findMany({
      where: {
        financeId: financeId,
      },
    });
    return dashboardEntries;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
export async function getAllFinanceApts(financeId) {
  const appointments = await prisma.clientApts.findMany({
    where: {
      financeId: financeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return appointments;
}


export async function getAllFinanceAptsForCalendar(userId) {
  const appointments = await prisma.clientApts.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return appointments;
}

export async function getLastFinanceApptsForAllCustomers() {
  try {
    const customers = await prisma.finance.findMany();

    const latestFinances = await Promise.all(customers.map(async (finance) => {
      const latestFinance = await prisma.clientApts.findFirst({
        where: {
          financeId: finance.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return latestFinance;
    }));

    return latestFinances;
  } catch (error) {
    console.error('Error retrieving latest finances:', error);
    throw new Error('Failed to retrieve latest finances');
  }
}
