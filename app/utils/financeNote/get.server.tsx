import { prisma } from "~/libs";


export async function getSingleCustomerNote(customerId) {
  console.log("getSingleCustomerNote", customerId);
  try {
    const latestFinance = await prisma.financeNote.findFirst({
      orderBy: { createdAt: "desc" },
      where: { customerId: customerId },
    });

    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
export async function getAllFinanceNotes(financeId) {

  try {
    const financeNotes = await prisma.financeNote.findMany({
      orderBy: { createdAt: "desc" },

      where: {
        financeId: financeId,
      },
    });
    return financeNotes;
  } catch (error) {
    console.error("Error fetching finance notes by customerId:", error);
    throw new Error("Failed to fetch finance notes by customerId");
  }
}

export async function getLastCreatedNotesForAllCustomers() {
  try {
    const customers = await prisma.finance.findMany();

    const latestFinances = await Promise.all(customers.map(async (finance) => {
      const latestFinance = await prisma.financeNote.findFirst({
        where: {
          customerId: finance.id,
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
